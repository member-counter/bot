// I would reuse discord.js' BitField, but it can't be bundled for frontend

export class BitField {
  constructor(public bitfield: number) {}

  has(flag: number) {
    return (this.bitfield & flag) === flag;
  }

  any(flag: number) {
    return (this.bitfield & flag) !== 0;
  }

  add(flag: number) {
    this.bitfield |= flag;
    return this;
  }

  remove(flag: number) {
    this.bitfield &= ~flag;
    return this;
  }

  missing(flag: number) {
    return (this.bitfield & flag) === 0;
  }
}
