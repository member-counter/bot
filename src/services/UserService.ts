import UserModel from '../models/UserModel';

class UserService {
  private constructor(public id: string, private doc: any) {}

  public static async init(id: string): Promise<UserService> {
    const doc = await UserModel.findOneAndUpdate(
      { user: id },
      {},
      { new: true, upsert: true },
    );
    return new UserService(id, doc);
  }

  public get badges(): number {
    return this.doc.badges;
  }

  public async grantBadge(badge: number): Promise<number> {
    this.doc.badges |= badge;
    this.doc.save();
    return this.doc.badges;
  }

  public async revokeBadge(badge: number): Promise<number> {
    this.doc.badges &= ~badge;
    this.doc.save();
    return this.doc.badges;
  }

  public get availableServerUpgrades(): number {
    return this.doc.availableServerUpgrades;
  }

  public async grantAvailableServerUpgrades(
    amount: number = 1,
  ): Promise<number> {
    this.doc.availableServerUpgrades += amount;
    this.doc.save();
    return this.doc.availableServerUpgrades;
  }
}

export default UserService;
