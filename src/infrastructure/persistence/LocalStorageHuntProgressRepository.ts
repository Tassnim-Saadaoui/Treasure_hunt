import type { HuntProgressRepository } from '../../application/ports/HuntProgressRepository';
import { normalizeProgressState, createInitialProgressState } from '../../domain/hunt/progress';
import type { HuntProgressState } from '../../domain/hunt/types';
import { savePlayerProgress } from './PlayerAuthClient';

const STORAGE_KEY = 'nateg_treasure_hunt_v1';
let remoteSaveQueue = Promise.resolve();

export class LocalStorageHuntProgressRepository implements HuntProgressRepository {
  async load(): Promise<HuntProgressState> {
    if (typeof window === 'undefined') return createInitialProgressState();

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeProgressState(JSON.parse(raw)) : createInitialProgressState();
    } catch {
      return createInitialProgressState();
    }
  }

  async save(state: HuntProgressState): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage may be unavailable or full in restricted browser contexts.
      }
    }
    const queuedSave = remoteSaveQueue.then(() => savePlayerProgress(state));
    remoteSaveQueue = queuedSave.catch(() => undefined);
    await queuedSave;
  }
}

export const huntProgressRepository = new LocalStorageHuntProgressRepository();
