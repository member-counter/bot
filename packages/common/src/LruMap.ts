/**
 * A map with a maximum size. When it is full, `set` removes the least
 * recently used key. A `get` or a `set` of a key makes it the most recently
 * used.
 *
 * It wraps a Map and does not extend it. An extended Map would also expose
 * the Map methods that do not apply the size limit and the use order.
 *
 * It uses the insertion order of the Map: the first key is the least
 * recently used, and every operation is O(1).
 */
export class LruMap<K, V> {
  private readonly map = new Map<K, V>();

  constructor(private readonly maxSize: number) {
    if (!Number.isInteger(maxSize) || maxSize < 1) {
      throw new RangeError(`maxSize must be a positive integer: ${maxSize}`);
    }
  }

  get size() {
    return this.map.size;
  }

  /** Return the value, and make the key the most recently used. */
  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;

    const value = this.map.get(key) as V;
    // Move the key to the end of the map.
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  /** Return true when the key is in the map. It does not change the order. */
  has(key: K) {
    return this.map.has(key);
  }

  /**
   * Set the value, and make the key the most recently used. When the map is
   * full, remove the least recently used key.
   */
  set(key: K, value: V) {
    this.map.delete(key);
    this.map.set(key, value);

    if (this.map.size > this.maxSize) {
      const oldest = this.map.keys().next();
      if (!oldest.done) this.map.delete(oldest.value);
    }

    return this;
  }

  delete(key: K) {
    return this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  /** The keys from the least to the most recently used. */
  keys() {
    return this.map.keys();
  }
}
