const { EmbedBuilder, Message, Client } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["pong"],
  description: "Reply with pong!",
  /**
   *
   * @param {Message} message
   * @param {Client} client    *
   */
  execute(message, client, args) {
    const embed = new EmbedBuilder()
      .setTitle("Pong!")
      .setDescription(`Latency: ${Date.now() - message.createdTimestamp}ms`)
      .setColor("#00ff00")
      .setTimestamp();

    const channelId = message.channel.id;
    console.log("Args", args);

    client.channels.cache.get(channelId).send({
      embeds: [embed],
    });
  },
};
