import UserModel from '../models/UserModel';

class UserService {
  private doc: any;

  public constructor(public id: string) {}

  public async init(): Promise<void> {
    this.doc = await UserModel.findOneAndUpdate(
      { user: this.id },
      {},
      { new: true, upsert: true },
    );
  }

  private get isInitialized(): boolean {
    return !!this.doc;
  }

  private errorNotInit(): never {
    throw new Error('You must call .init() first');
  }

  public get badges(): number {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.badges;
  }

  public async grantBadge(badge: number): Promise<number> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.badges |= badge;
    this.doc.save();
    return this.doc.badges;
  }

  public get availableServerUpgrades(): number {
    if (!this.isInitialized) this.errorNotInit();
    return this.doc.availableServerUpgrades;
  }

  public async grantAvailableServerUpgrades(
    amount: number = 1,
  ): Promise<number> {
    if (!this.isInitialized) this.errorNotInit();
    this.doc.availableServerUpgrades += amount;
    this.doc.save();
    return this.doc.availableServerUpgrades;
  }
}

export default UserService;
