export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Draws cards in random order with no repeats until the deck is empty. */
export class Deck<T> {
  private order: T[];
  private index = 0;
  constructor(items: readonly T[], rng: () => number = Math.random) {
    this.order = shuffle(items, rng);
  }
  get remaining() { return this.order.length - this.index; }
  get size() { return this.order.length; }
  next(): T | null {
    if (this.index >= this.order.length) return null;
    return this.order[this.index++];
  }
}
