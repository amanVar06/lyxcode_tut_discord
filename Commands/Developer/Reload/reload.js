const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");

// this is the small command so we can handle the subcommand
// without making a new file

// const { loadCommands } = require("../../Handlers/commandHandler");
// const { loadEvents } = require("../../Handlers/eventHandler");

module.exports = {
  developerOnly: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads all commands/events")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) =>
      options.setName("commands").setDescription("Reloads all commands")
    )
    .addSubcommand((options) =>
      options.setName("events").setDescription("Reloads all events")
    ),
  // /**
  //  *
  //  * @param {ChatInputCommandInteraction} interaction
  //  * @param {Client} client
  //  *
  //  */
  // execute(interaction, client) {
  //   const subcommand = interaction.options.getSubcommand();

  //   switch (subcommand) {
  //     case "commands":
  //       {
  //         loadCommands(client);
  //         interaction.reply({
  //           content: `Reloaded all commands!`,
  //           ephemeral: true,
  //         });
  //       }
  //       break;
  //     case "events":
  //       {
  //         for (const [key, value] of client.events) {
  //           client.removeListener(`${key}`, value, true);
  //         }
  //         loadEvents(client);
  //         interaction.reply({
  //           content: `Reloaded all events!`,
  //           ephemeral: true,
  //         });
  //       }
  //       break;
  //   }
  // },
};
