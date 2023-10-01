const { Client, Message } = require("discord.js");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(client.config.prefix)) return;

    // console.log("client.config.prefix", client.config.prefix);
    // console.log(message.guild);

    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
    const commandName = args.shift().toLowerCase();

    // console.log("commandName", commandName);
    // console.log("args", args);
    // console.log("message", message);

    let command = client.messageCommands.get(commandName);

    if (!command) {
      client.messageCommands.forEach((messageCommand, messageCommandName) => {
        if (
          messageCommand.aliases &&
          messageCommand.aliases.includes(commandName)
        ) {
          command = messageCommand;

          return;
        }
      });
    }

    if (!command) return;

    if (
      command.developerOnly &&
      !client.config.developers.includes(message.author.id)
    ) {
      return message.reply({
        content: "This command is only available to the developers",
        ephemeral: true,
      });
    }

    try {
      command.execute(message, client, args);
    } catch (e) {
      console.log(e);
      message.reply({
        content: "An error occured while executing this command",
        ephemeral: true,
      });
    }
  },
};
