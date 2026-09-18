import { SaveSlotMeta, PlayerProfile } from '../types/game';
import { HOUSING_TIERS } from '../constants/gameData';

const SLOTS_META_KEY = 'hustle_sim_slots_meta';
const RECENT_SLOT_KEY = 'hustle_sim_active_slot_id';
const LEGACY_STORAGE_KEY = 'hustle_empire_sim_state_v1';

export const DEFAULT_EMPTY_SLOT = (slotId: 1 | 2 | 3): SaveSlotMeta => ({
  slotId,
  isEmpty: true,
  playerName: `Save Slot ${slotId}`,
  daysPlayed: 0,
  level: 1,
  netWorth: 100,
  cash: 100,
  creditScore: 550,
  housingTier: 1,
  housingName: "Mom's Couch",
  lastSaved: 0,
});

export const getSlotStorageKey = (slotId: 1 | 2 | 3, key: string) => {
  return `hustle_sim_slot_${slotId}_${key}`;
};

/**
 * Reads all 3 slots' metadata from localStorage, migrating legacy save if present.
 */
export const getAllSlotsMeta = (): SaveSlotMeta[] => {
  try {
    const raw = localStorage.getItem(SLOTS_META_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SaveSlotMeta[];
      if (Array.isArray(parsed) && parsed.length === 3) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // Check if legacy save exists to migrate into Slot 1
  let slot1Initial = DEFAULT_EMPTY_SLOT(1);
  try {
    const legacyPlayerRaw = localStorage.getItem(LEGACY_STORAGE_KEY + '_player');
    if (legacyPlayerRaw) {
      const p = JSON.parse(legacyPlayerRaw) as PlayerProfile;
      const housing = HOUSING_TIERS.find((h) => h.tier === p.housingTier);
      slot1Initial = {
        slotId: 1,
        isEmpty: false,
        playerName: p.name || 'Alex Vance',
        daysPlayed: p.daysPlayed || 1,
        level: p.level || 1,
        netWorth: p.cash || 100,
        cash: p.cash || 100,
        creditScore: p.creditScore || 550,
        housingTier: p.housingTier || 1,
        housingName: housing?.name || "Mom's Couch",
        lastSaved: Date.now(),
      };

      // Copy legacy keys to slot 1 keys
      const keysToCopy = [
        'player',
        'bank',
        'cards',
        'loans',
        'businesses',
        'props_market',
        'props_owned',
        'stocks',
        'portfolio',
        'achievements',
        'tutorial',
        'autocollect',
      ];
      for (const k of keysToCopy) {
        const val = localStorage.getItem(LEGACY_STORAGE_KEY + '_' + k);
        if (val) {
          localStorage.setItem(getSlotStorageKey(1, k), val);
        }
      }
    }
  } catch {
    // ignore
  }

  const initialSlots: SaveSlotMeta[] = [
    slot1Initial,
    DEFAULT_EMPTY_SLOT(2),
    DEFAULT_EMPTY_SLOT(3),
  ];

  try {
    localStorage.setItem(SLOTS_META_KEY, JSON.stringify(initialSlots));
  } catch {
    // ignore
  }

  return initialSlots;
};

/**
 * Updates a single slot's metadata in the persistent meta registry
 */
export const updateSlotMeta = (slotId: 1 | 2 | 3, updates: Partial<SaveSlotMeta>): SaveSlotMeta[] => {
  const current = getAllSlotsMeta();
  const updated = current.map((slot) => {
    if (slot.slotId === slotId) {
      return { ...slot, ...updates, lastSaved: Date.now() };
    }
    return slot;
  });

  try {
    localStorage.setItem(SLOTS_META_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return updated;
};

/**
 * Completely clears a save slot
 */
export const deleteSlotData = (slotId: 1 | 2 | 3): SaveSlotMeta[] => {
  const keysToDelete = [
    'player',
    'bank',
    'cards',
    'loans',
    'businesses',
    'props_market',
    'props_owned',
    'stocks',
    'portfolio',
    'achievements',
    'dailyMissions',
    'newsFeed',
    'tutorial',
    'autocollect',
  ];

  for (const k of keysToDelete) {
    try {
      localStorage.removeItem(getSlotStorageKey(slotId, k));
    } catch {
      // ignore
    }
  }

  const current = getAllSlotsMeta();
  const updated = current.map((slot) => {
    if (slot.slotId === slotId) {
      return DEFAULT_EMPTY_SLOT(slotId);
    }
    return slot;
  });

  try {
    localStorage.setItem(SLOTS_META_KEY, JSON.stringify(updated));
    const recent = getRecentSlotId();
    if (recent === slotId) {
      setRecentSlotId(null);
    }
  } catch {
    // ignore
  }

  return updated;
};

/**
 * Track recently played slot for Quick Continue
 */
export const getRecentSlotId = (): (1 | 2 | 3) | null => {
  try {
    const raw = localStorage.getItem(RECENT_SLOT_KEY);
    if (raw) {
      const id = parseInt(raw, 10);
      if (id === 1 || id === 2 || id === 3) {
        return id;
      }
    }
  } catch {
    // ignore
  }
  return null;
};

export const setRecentSlotId = (slotId: (1 | 2 | 3) | null): void => {
  try {
    if (slotId === null) {
      localStorage.removeItem(RECENT_SLOT_KEY);
    } else {
      localStorage.setItem(RECENT_SLOT_KEY, slotId.toString());
    }
  } catch {
    // ignore
  }
};
