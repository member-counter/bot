import MemberCounterCommand from '../typings/MemberCounterCommand';
import UserService from '../services/UserService';

// easter egg coded by my gf (line 13)
const patpat: MemberCounterCommand = {
  aliases: ['patpat'],
  denyDm: false,
  onlyAdmin: false,
  run: async ({ message }) => {
    const userSettings = await UserService.init(message.author.id);
    await userSettings.grantBadge(0b10000000);

    await message.channel.createMessage('https://i.imgflip.com/2yya22.png');
    // i never thought i will ever been coding with a very cute guy -alex
  },
};

const patpatCommands = [patpat];

export default patpatCommands;
