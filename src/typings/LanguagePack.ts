export default LanguagePack;

// This file has been auto-generated with json-to-ts (https://www.npmjs.com/package/json-to-ts)
// It is auto-generated when you create a commit, or by running manually 'npm run generateLPTypings'

interface LanguagePack {
  langCode: string;
  langName: string;
  commands: Commands;
  functions: Functions;
  common: Common;
}
interface Common {
  error: string;
  errorDb: string;
  errorDiscordAPI: string;
  errorUnknown: string;
  errorNoAdmin: string;
  noTopicCounterEnabled: string;
}
interface Functions {
  commandHandler: CommandHandler;
  getCounts: GetCounts;
  paginator: Paginator;
}
interface Paginator {
  pageCounter: string;
  jumpPrompt: string;
  errorPageLengthExceeded: string;
  errorNegativeInput: string;
}
interface GetCounts {
  onlyPremium: string;
  unknownCounter: string;
  disabled: string;
  noBanPerms: string;
  invalidChannelLength: string;
  notAvailable: string;
}
interface CommandHandler {
  noDm: string;
}
interface Commands {
  help: Help;
  guide: Guide;
  premium: Premium;
  lockChannel: LockChannel;
  editChannel: EditChannel;
  setDigit: SetDigit;
  shortNumber: ShortNumber;
  locale: Locale;
  prefix: Prefix;
  role: Role;
  seeSettings: SeeSettings;
  resetSettings: ResetSettings;
  upgradeServer: UpgradeServer;
  info: Info;
  lang: Lang;
  profile: Profile;
  counts: Counts;
  preview: Preview;
  setup: Setup;
  base64: Base64;
  checkPermissions: CheckPermissions;
}
interface CheckPermissions {
  helpDescription: string;
  optionalText: string;
  adminWarning: string;
  footer: string;
  details: Details;
}
interface Details {
  manageChannels: ManageChannels;
  viewChannel: ManageChannels;
  voiceConnect: ManageChannels;
  readMessageHistory: ManageChannels;
  sendMessages: ManageChannels;
  embedLinks: ManageChannels;
  addReactions: ManageChannels;
  manageMessages: ManageMessages;
  manageRoles: ManageChannels;
  banMembers: ManageMessages;
}
interface ManageMessages {
  name: string;
  description: string;
  optional: boolean;
}
interface ManageChannels {
  name: string;
  description: string;
}
interface Base64 {
  helpDescription: string;
  invalidAction: string;
}
interface Setup {
  helpDescription: string;
  status: Status;
  errorInvalidUsage: string;
  counterTemplates: CounterTemplates;
}
interface CounterTemplates {
  default: Default;
  twitch: Default;
  youtube: Default;
  twitter: Default;
}
interface Default {
  categoryName: string;
  counters: Counter[];
}
interface Counter {
  name: string;
  template: string;
  statusCreating: string;
  statusCreated: string;
}
interface Status {
  creatingCounts: string;
  createdCounts: string;
  creatingCategory: string;
  createdCategory: string;
}
interface Preview {
  helpDescription: string;
  helpImage: string;
  channelName: string;
  channelTopic: string;
}
interface Counts {
  helpDescription: string;
  members: string;
  onlineMembers: string;
  offlineMembers: string;
  bots: string;
  connectedUsers: string;
  channels: string;
  roles: string;
  nitroBoosters: string;
  bannedMembers: string;
}
interface Profile {
  helpDescription: string;
  badges: string;
  serverUpgradesAvailable: string;
  removeDataConfirmation: string;
  removeDataConfirmationString: string;
  removeDataSuccess: string;
  userNotFound: string;
}
interface Lang {
  helpDescription: string;
  success: string;
  errorNotFound: string;
}
interface Info {
  helpDescription: string;
  embedReply: EmbedReply2;
}
interface EmbedReply2 {
  description: string;
}
interface UpgradeServer {
  helpDescription: string;
  success: string;
  errorCannotUpgrade: string;
  noServerUpgradesAvailable: string;
}
interface ResetSettings {
  helpDescription: string;
  done: string;
}
interface SeeSettings {
  helpDescription: string;
  settingsMessage: SettingsMessage;
}
interface SettingsMessage {
  headerText: string;
  prefixText: string;
  langText: string;
  localeText: string;
  shortNumberText: string;
  noText: string;
  yesText: string;
  allowedRolesText: string;
  countersText: string;
  customNumbersText: string;
  warningNoPermsText: string;
  guildLogsText: string;
}
interface Role {
  helpDescription: string;
  rolesUpdated: string;
  errorNoRolesToUpdate: string;
  invalidParams: string;
}
interface Prefix {
  helpDescription: string;
  success: string;
  noPrefixProvided: string;
}
interface Locale {
  helpDescription: string;
  helpImage: string;
}
interface ShortNumber {
  helpDescription: string;
  helpImage: string;
  errorInvalidAction: string;
  success: string;
}
interface SetDigit {
  helpDescription: string;
  success: string;
  resetSuccess: string;
  errorMissingParams: string;
}
interface EditChannel {
  helpDescription: string;
  success: string;
  errorNotFound: string;
  errorNoContent: string;
}
interface LockChannel {
  helpDescription: string;
  success: string;
  errorInvalidChannel: string;
  errorNoPerms: string;
  errorNotFound: string;
}
interface Premium {
  helpDescription: string;
  embedReply: EmbedReply;
}
interface Guide {
  helpDescription: string;
  pagesText: string;
  explanation: string;
  countersHeader: string;
  usageText: string;
  exampleText: string;
  counters: Counters;
}
interface Counters {
  members: Members;
  approximatedOnlineMembers: Members;
  onlineMembers: Members;
  offlineMembers: Members;
  users: Members;
  onlineUsers: Members;
  offlineUsers: Members;
  bots: Members;
  onlineBots: Members;
  offlineBots: Members;
  roles: Members;
  channels: Members;
  membersWithRole: Members;
  onlineMembersWithRole: Members;
  offlineMembersWithRole: Members;
  connectedMembers: Members;
  bannedMembers: Members;
  membersPlaying: Members;
  http: Members;
  youtubeSubscribers: Members;
  youtubeViews: Members;
  youtubeVideos: Members;
  youtubeChannelName: Members;
  twitchFollowers: Members;
  twitchViews: Members;
  twitchChannelName: Members;
  memeratorMemes: Members;
  memeratorFollowers: Members;
  twitterFollowers: Members;
  countdown: Members;
  game: Members;
  clock: Members;
  'nitro-boosters': Members;
  redditMembers: Members;
  redditMembersOnline: Members;
  redditTitle: Members;
  static: Members;
  instagramFollowers: Members;
  sum: Members;
  subtract: Members;
  multiply: Members;
  divide: Members;
  modulus: Members;
}
interface Members {
  name: string;
  description: string;
  detailedDescription: string;
  usage: string[];
  example: string[];
}
interface Help {
  helpDescription: string;
  embedReply: EmbedReply;
  misc: Misc;
}
interface Misc {
  command: string;
  counter: string;
  errorNotFound: string;
}
interface EmbedReply {
  title: string;
  description: string;
  fields: Field[];
}
interface Field {
  name: string;
  value: string;
  inline: boolean;
}
