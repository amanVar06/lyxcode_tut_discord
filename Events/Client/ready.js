const { Client } = require("discord.js");

const { loadCommands } = require("../../Handlers/commandHandler");
const { loadMessageCommands } = require("../../Handlers/messageCommandHandler");

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.log(`Client logged in as ${client.user.username}`);
    client.user.setActivity(`Watching ${client.guilds.cache.size} guild(s)`);
    client.user.setStatus("dnd");

    await loadCommands(client);
    // await loadMessageCommands(client);
  },
};
