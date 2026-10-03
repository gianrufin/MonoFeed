import { useState, useEffect, useCallback } from 'react';
import { Fact } from '../types';
import { PHILIPPINES_FACTS } from '../data/philippinesFacts';

const SAVED_FACTS_STORAGE_KEY = 'monofeed_offline_saved_facts_v1';

export function useSavedFacts() {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(SAVED_FACTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_FACTS_STORAGE_KEY, JSON.stringify(savedIds));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [savedIds]);

  const isSaved = useCallback(
    (id: string): boolean => {
      return savedIds.includes(id);
    },
    [savedIds]
  );

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const removeSave = useCallback((id: string) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearAllSaved = useCallback(() => {
    setSavedIds([]);
  }, []);

  // Return the actual Fact objects corresponding to savedIds
  const savedFacts: Fact[] = savedIds
    .map((id) => PHILIPPINES_FACTS.find((f) => f.id === id))
    .filter((f): f is Fact => f !== undefined);

  return {
    savedIds,
    savedFacts,
    isSaved,
    toggleSave,
    removeSave,
    clearAllSaved,
    savedCount: savedIds.length
  };
}
