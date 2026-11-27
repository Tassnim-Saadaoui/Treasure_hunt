declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Promise<Response>): void;
};

interface PlayerRow {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  current_challenge: number;
  completed_challenges: number;
  created_at: string;
}

interface PlayerProgress {
  profile: {
    explorerName: string;
    teamName: string;
    specialty: 'Backend';
    joinedAt: number;
    avatar: string;
  };
  completedIds: number[];
  hintsUsedByChallenge: Record<number, number>;
  startedAt: number | null;
  completedAt: number | null;
  soundEnabled: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

class SupabaseRequestError extends Error {
  constructor(readonly status: number) {
    super(`Supabase request failed (${status}).`);
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

async function databaseRequest(path: string, init: RequestInit = {}): Promise<unknown> {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceRoleKey) throw new Error('Supabase server credentials are not configured.');

  const response = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) throw new SupabaseRequestError(response.status);
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function normalizeNickname(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const nickname = value.normalize('NFKC').trim();
  return nickname.length >= 2 &&
    nickname.length <= 20 &&
    /^[\p{L}\p{N} _-]+$/u.test(nickname)
    ? nickname
    : null;
}

function normalizeChallengeAnswer(value: unknown): string | null {
  return typeof value === 'string'
    ? value.normalize('NFKC').trim().toLocaleLowerCase('fr-FR')
    : null;
}

function isValidAvatar(value: unknown): value is string {
  return typeof value === 'string' && /^avatar[1-8]\.jpg$/.test(value);
}

function toProgress(player: PlayerRow): PlayerProgress {
  const joinedAt = Date.parse(player.created_at);
  const startedAt = Number.isFinite(joinedAt) ? joinedAt : Date.now();
  const storedCompletedCount = Number.isFinite(player.completed_challenges)
    ? Math.floor(player.completed_challenges)
    : 0;
  const completedCount = Math.max(0, Math.min(6, storedCompletedCount));
  const currentChallengeProgress = Number.isFinite(player.current_challenge)
    ? Math.max(0, Math.min(6, Math.floor(player.current_challenge) - 1))
    : 0;
  const restoredCount = Math.max(completedCount, currentChallengeProgress);
  return {
    profile: {
      explorerName: player.nickname,
      teamName: player.nickname,
      specialty: 'Backend',
      joinedAt: startedAt,
      avatar: player.avatar,
    },
    completedIds: Array.from({ length: restoredCount }, (_, index) => index + 1),
    hintsUsedByChallenge: {},
    startedAt,
    completedAt: null,
    soundEnabled: true,
  };
}

function databaseQuery(table: string, query: Record<string, string>): string {
  return `${table}?${new URLSearchParams(query).toString()}`;
}

async function findPlayer(nickname: string): Promise<PlayerRow | null> {
  const exactNicknamePattern = nickname.replace(/\\/g, '\\\\').replace(/_/g, '\\_');
  const rows = (await databaseRequest(
    databaseQuery('players', {
      select: 'id,nickname,avatar,score,current_challenge,completed_challenges,created_at',
      nickname: `ilike.${exactNicknamePattern}`,
      limit: '1',
    })
  )) as PlayerRow[];
  return rows[0] ?? null;
}

function playerResponse(player: PlayerRow): Response {
  return jsonResponse({ player, progress: toProgress(player) });
}

async function authenticate(body: Record<string, unknown>): Promise<Response> {
  const nickname = normalizeNickname(body.nickname);
  if (!nickname || !isValidAvatar(body.avatar)) {
    return jsonResponse(
      { error: 'Enter a username and choose one of the 8 avatars.' },
      400
    );
  }

  const existingPlayer = await findPlayer(nickname);
  if (existingPlayer) return playerResponse(existingPlayer);

  let inserted: PlayerRow[];
  try {
    inserted = (await databaseRequest('players', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        nickname,
        avatar: body.avatar,
        score: 0,
        current_challenge: 1,
        completed_challenges: 0,
      }),
    })) as PlayerRow[];
  } catch (error) {
    if (!(error instanceof SupabaseRequestError) || error.status !== 409) throw error;
    const registeredPlayer = await findPlayer(nickname);
    if (registeredPlayer) return playerResponse(registeredPlayer);
    throw error;
  }
  const player = inserted[0];
  if (!player) throw new Error('The player record could not be created.');
  return playerResponse(player);
}

function normalizeCompletedIds(value: unknown): number[] | null {
  if (!Array.isArray(value) || value.length > 6) return null;
  const completedIds = value as unknown[];
  if (completedIds.some((id, index) => id !== index + 1)) return null;
  return completedIds as number[];
}

async function saveProgress(body: Record<string, unknown>): Promise<Response> {
  const nickname = normalizeNickname(body.nickname);
  if (!nickname) {
    return jsonResponse({ error: 'The username is invalid.' }, 400);
  }

  const player = await findPlayer(nickname);
  if (!player) {
    return jsonResponse({ error: 'The username is not registered.' }, 404);
  }

  const progress = body.progress as Partial<PlayerProgress> | null;
  const completedIds = normalizeCompletedIds(progress?.completedIds);
  if (!completedIds) {
    return jsonResponse({ error: 'The supplied challenge progression is invalid.' }, 400);
  }

  const completedCount = completedIds.length;
  const updatedRows = (await databaseRequest(
    databaseQuery('players', { id: `eq.${player.id}` }),
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        current_challenge: Math.min(6, completedCount + 1),
        completed_challenges: completedCount,
      }),
    }
  )) as PlayerRow[];
  const updatedPlayer = updatedRows[0];
  if (!updatedPlayer) throw new Error('The player progression could not be saved.');
  return playerResponse(updatedPlayer);
}

async function submitChallenge1(body: Record<string, unknown>): Promise<Response> {
  const nickname = normalizeNickname(body.nickname);
  if (!nickname) return jsonResponse({ error: 'The username is invalid.' }, 400);

  const player = await findPlayer(nickname);
  if (!player) return jsonResponse({ error: 'The username is not registered.' }, 404);

  if (normalizeChallengeAnswer(body.answer) !== 'bonjour') {
    return jsonResponse({ error: 'Mot-clé incorrect. Scannez le QR code ou réessayez.' }, 400);
  }

  const completedCount = Math.max(1, Math.min(6, player.completed_challenges));
  const currentChallenge = Math.max(2, Math.min(6, player.current_challenge));
  const updatedRows = (await databaseRequest(
    databaseQuery('players', { id: `eq.${player.id}` }),
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        current_challenge: currentChallenge,
        completed_challenges: completedCount,
      }),
    }
  )) as PlayerRow[];
  const updatedPlayer = updatedRows[0];
  if (!updatedPlayer) throw new Error('Challenge 1 progression could not be saved.');
  return playerResponse(updatedPlayer);
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return jsonResponse({ error: 'A JSON request body is required.' }, 400);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'A valid JSON request body is required.' }, 400);
  }

  try {
    if (body.action === 'authenticate') return await authenticate(body);
    if (body.action === 'saveProgress') return await saveProgress(body);
    if (body.action === 'submitChallenge1') return await submitChallenge1(body);
    return jsonResponse({ error: 'Unknown player action.' }, 400);
  } catch (error) {
    if (error instanceof SupabaseRequestError && error.status === 409) {
      return jsonResponse({ error: 'This username is already registered.' }, 409);
    }
    if (error instanceof SupabaseRequestError || error instanceof TypeError) {
      return jsonResponse({ error: 'The player service is temporarily unavailable. Please try again.' }, 503);
    }
    return jsonResponse({ error: 'The player service could not complete the request.' }, 500);
  }
});
