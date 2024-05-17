// I would reuse discord.js' BitField, but it can't be bundled for frontend

export class BitField {
  public bitfield: bigint;
  constructor(bitfield: bigint | undefined | null | string) {
    if (typeof bitfield === "string") this.bitfield = BigInt(bitfield);
    else this.bitfield = bitfield ?? 0n;
  }

  has(flag: bigint) {
    return (this.bitfield & flag) === flag;
  }

  any(flag: bigint) {
    return (this.bitfield & flag) !== 0n;
  }

  add(flag: bigint) {
    this.bitfield |= flag;
    return this;
  }

  remove(flag: bigint) {
    this.bitfield &= ~flag;
    return this;
  }

  missing(flag: bigint) {
    return (this.bitfield & flag) === 0n;
  }
}
