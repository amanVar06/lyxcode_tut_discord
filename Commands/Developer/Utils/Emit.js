const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  developerOnly: true,
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emit the guildMember Add/Remove event")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    client.emit("guildMemberAdd", interaction.member);

    interaction.reply({
      content: "Emitted guildMemberAdd event",
      ephemeral: true,
    });
  },
};
