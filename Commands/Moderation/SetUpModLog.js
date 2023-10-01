const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
  Client,
} = require("discord.js");

const Database = require("../../Schemas/GuildLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup_modlog")
    .setDescription("Sets up the modlog channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to set for the modlogs")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const logChannel = options.getChannel("channel").id;

    await Database.findOneAndUpdate(
      {
        guildId: guild.id,
      },
      {
        modLogChannel: logChannel,
      },
      {
        new: true,
        upsert: true,
      }
    );

    client.guildConfig.set(guild.id, {
      modLogChannel: logChannel,
    });

    const Embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle("ModLog Channel Setup")
      .setDescription(
        [`- Logging channel updated: <#${logChannel}>`].join("\n")
      )
      .setTimestamp();

    return interaction.reply({
      embeds: [Embed],
    });
  },
};
