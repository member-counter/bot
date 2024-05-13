// I would reuse discord.js' BitField, but it can't be bundled for frontend

export class BitField {
  constructor(public bitfield: number) {}

  has(flag: number) {
    return (this.bitfield & flag) === flag;
  }

  add(flag: number) {
    this.bitfield |= flag;
  }

  remove(flag: number) {
    this.bitfield &= ~flag;
  }
}
