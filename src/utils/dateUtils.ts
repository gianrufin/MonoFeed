import { Fact } from '../types';
import { PHILIPPINES_FACTS } from '../data/philippinesFacts';

/**
 * Returns the day of the year (1 - 366).
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Deterministically picks the daily fact for a given date based on the day of the year.
 */
export function getDailyFact(date: Date = new Date()): Fact {
  const dayOfYear = getDayOfYear(date);
  const index = (dayOfYear - 1) % PHILIPPINES_FACTS.length;
  return PHILIPPINES_FACTS[index >= 0 ? index : 0];
}

/**
 * Formats a date into a clean, minimalist date string.
 * e.g., "Saturday, October 3, 2026"
 */
export function formatFullDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Formats a short date for cards.
 * e.g., "Oct 3, 2026"
 */
export function formatShortDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Returns total count of verified facts.
 */
export function getTotalFactCount(): number {
  return PHILIPPINES_FACTS.length;
}

/**
 * Gets a fact by id or fallback to first.
 */
export function getFactById(id: string): Fact | undefined {
  return PHILIPPINES_FACTS.find((f) => f.id === id);
}
