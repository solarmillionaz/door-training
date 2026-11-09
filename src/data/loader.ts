import type { Card, CategoryId } from './types';

const cache = new Map<CategoryId, Card[]>();
const loaders: Record<CategoryId, () => Promise<{ cards: Card[] }>> = {
  objections: () => import('./objections'),
  smokescreens: () => import('./smokescreens'),
  concerns: () => import('./concerns'),
};

/** Lazy-loads a category's cards (separate JS chunk per category). */
export async function loadCategory(cat: CategoryId): Promise<Card[]> {
  const hit = cache.get(cat);
  if (hit) return hit;
  const { cards } = await loaders[cat]();
  cache.set(cat, cards);
  return cards;
}

export async function loadCards(cat: CategoryId | 'all'): Promise<Card[]> {
  if (cat !== 'all') return loadCategory(cat);
  const parts = await Promise.all((['objections', 'smokescreens', 'concerns'] as const).map(loadCategory));
  return parts.flat();
}

export const peekCards = (cat: CategoryId | 'all'): Card[] | null =>
  cat === 'all'
    ? (cache.has('objections') && cache.has('smokescreens') && cache.has('concerns') ? [...cache.get('objections')!, ...cache.get('smokescreens')!, ...cache.get('concerns')!] : null)
    : cache.get(cat) ?? null;
