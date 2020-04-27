import MemberCounterCommand from '../typings/MemberCounterCommand';
import ReactionManager from '../utils/ReactionManager';
import embedBase from '../utils/embedBase';

const splitContent = (string: string): string[] => {
  // TODO
  return [''];
};

const guide: MemberCounterCommand = {
  aliases: ['guide', 'setup', 'intro'],
  denyDm: false,
  onlyAdmin: false,
  run: async ({ message, languagePack }) => {
    const { channel, author } = message;
    const pages = [
      'first page```ts\n```first page',
      'second page```ts\n```second page',
      'third page```ts\n```third page',
    ];
    let currentPage = 0;

    const embed = embedBase({
      description: pages[currentPage],
      footer: { text: `Page ${currentPage + 1}/${pages.length}` },
    });

    const guideMessage = await channel.createMessage({ embed });

    await Promise.all([
      await guideMessage.addReaction('◀'),
      await guideMessage.addReaction('▶'),
    ]);

    ReactionManager.addReactionListener({
      message: guideMessage,
      emoji: '◀',
      autoDestroy: 30 * 60 * 1000,
      callback: (userId) => {
        if (userId !== author.id) return;
        if (currentPage > 0) --currentPage;
        embed.description = pages[currentPage];
        embed.footer = {
          text: `Page ${currentPage + 1}/${pages.length}`,
        };
        guideMessage.edit({ embed }).catch(console.error);
      },
    });

    ReactionManager.addReactionListener({
      message: guideMessage,
      emoji: '▶',
      autoDestroy: 30 * 60 * 1000,
      callback: (userId) => {
        if (userId !== author.id) return;
        if (currentPage < pages.length - 1) ++currentPage;
        embed.description = pages[currentPage];
        embed.footer = {
          text: `Page ${currentPage + 1}/${pages.length}`,
        };
        guideMessage.edit({ embed }).catch(console.error);
      },
    });
  },
};

const guideCommand = [guide];

export default guideCommand;
