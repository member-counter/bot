import MemberCounterCommand from '../typings/MemberCounterCommand';
import UserService from '../services/UserService';

// easter egg coded by my gf (line 14 and 15)
const patpat: MemberCounterCommand = {
  aliases: ['patpat'],
  denyDm: false,
  onlyAdmin: false,
  run: async ({ message }) => {
    const userSettings = new UserService(message.author.id);
    await userSettings.init();
    await userSettings.grantBadge(0b1000);

    message.channel
      .createMessage('https://i.imgflip.com/2yya22.png')
      .catch(console.error);
    // i never thought i will ever been coding with a very cute guy -alex
  },
};

const patpatCommands = [patpat];

export default patpatCommands;
