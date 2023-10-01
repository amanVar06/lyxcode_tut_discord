const configDatabase = require("../Schemas/GuildLog");

async function loadConfig(client) {
  (await configDatabase.find({})).forEach((doc) => {
    client.guildConfig.set(doc.guildId, {
      memberLogChannel: doc.memberLogChannel,
      modLogChannel: doc.modLogChannel,
      memberRole: doc.defaultMemberRole,
      botRole: doc.defaultBotRole,
    });
  });

  return console.log("Loaded guild configs to the collection.");
}

module.exports = { loadConfig };
