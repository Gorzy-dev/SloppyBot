const MemberLog = require('../../Schemas/MemberLog');

function getRandomXP() {
  return Math.floor(Math.random() * (3 - 1 + 1)) + 1;
}

function shouldGainXP() {
  return Math.random() < 0.5;
}

function shouldGainJuggs() {
  return Math.random() < 0.010; // 10 in 1000 chance
}

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    const serverSpecificMemberLog = MemberLog(message.guild.name);

    let userData = await serverSpecificMemberLog.findOne({ Guild: message.guild.id, UserID: message.author.id });

    if (!userData) {
      userData = new serverSpecificMemberLog({
        Guild: message.guild.id,
        UserID: message.author.id,
        GuildName: message.guild.name,
        UserName: message.author.username,
        slimeJuggs: 0, // Default to 0
      });      
    } else {
      userData.GuildName = message.guild.name;
      userData.UserName = message.author.username;
    }

    if (shouldGainXP()) {
      const randomXP = getRandomXP();

      userData.xp += randomXP;
      userData.totalxp += randomXP;

      const xpToNextLevel = 100 * Math.pow(userData.level, 1.5);
      if (userData.xp >= xpToNextLevel) {
        userData.level++;
        userData.xp -= xpToNextLevel;

        await message.channel.send({ content: `${message.author}, you have reached level ${userData.level}!`, ephemeral: true });
      }
    }

    if (shouldGainJuggs()) {
      userData.slimeJuggs++;

      //await message.channel.send({ content: `${message.author}, you found a Slime Jugg!`, ephemeral: true });
    }

    await userData.save();
  },
};
