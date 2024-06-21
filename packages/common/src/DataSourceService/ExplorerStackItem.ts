export class ExplorerStackItem<K extends string = string> {
  public explored = false;
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private ref: Record<K, any>,
    private accessKey: K,
  ) {}
  get node() {
    return this.ref[this.accessKey];
  }

  set node(v) {
    this.ref[this.accessKey] = v;
  }
}
