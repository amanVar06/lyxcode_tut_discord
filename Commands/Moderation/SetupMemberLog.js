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
    .setName("setup_memberlog")
    .setDescription("Configure the member logging system for your guild")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addChannelOption((options) =>
      options
        .setName("log_channel")
        .setDescription("The channel to send the logs to")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption((options) =>
      options
        .setName("member_role")
        .setDescription("set the member role to give to new members")
    )
    .addRoleOption((options) =>
      options
        .setName("bot_role")
        .setDescription("set the bot role to give to new bots")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   *
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const logChannel = options.getChannel("log_channel").id;

    let memberRole = options.getRole("member_role")
      ? options.getRole("member_role").id
      : null;

    let botRole = options.getRole("bot_role")
      ? options.getRole("bot_role").id
      : null;

    await Database.findOneAndUpdate(
      {
        guildId: guild.id,
      },
      {
        memberLogChannel: logChannel,
        defaultMemberRole: memberRole,
        defaultBotRole: botRole,
      },
      {
        new: true,
        upsert: true,
      }
    );

    client.guildConfig.set(guild.id, {
      memberLogChannel: logChannel,
      memberRole: memberRole,
      botRole: botRole,
    });

    // for role use <@&role>

    const Embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Member Log Setup")
      .setDescription(
        [
          `- Logging channel updated: <#${logChannel}>`,
          `- Member auto-role updated: ${
            memberRole ? `<@&${memberRole}>` : "Not specified"
          }`,
          `- Bot auto-role updated: ${
            botRole ? `<@&${botRole}>` : "Not specified"
          }`,
        ].join("\n")
      );

    return interaction.reply({
      embeds: [Embed],
    });
  },
};
