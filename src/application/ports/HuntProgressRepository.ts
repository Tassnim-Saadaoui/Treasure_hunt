import type { HuntProgressState } from '../../domain/hunt/types';

/** Persistence boundary; replace the browser adapter with an API adapter when a backend exists. */
export interface HuntProgressRepository {
  load(): Promise<HuntProgressState>;
  save(state: HuntProgressState): Promise<void>;
}
