const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  ChannelType,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  ModalSubmitFields,
  TextInputBuilder,
  PermissionFlagsBits,
  TextInputStyle,
} = require("discord.js");

const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play_minority")
    .setDescription("Play minority game with your friends!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Role to mention when game starts")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send game message")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member, options, createdTimestamp } = interaction;

    const role = options.getRole("role").id;
    const channel = options.getChannel("channel")
      ? options.getChannel("channel")
      : interaction.channel;

    // console.log(member.id, interaction.user.id);
    // same thing

    let _id = `PlayMinority-Modal-${channel.id}-${role}-${createdTimestamp}`;

    const Modal = new ModalBuilder()
      .setCustomId(_id)
      .setTitle("Minority Game")
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(`${_id}-Question`)
            .setLabel("Enter question here for minority game")
            .setRequired(true)
            .setMaxLength(100)
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(`${_id}-Option-${1}`)
            .setLabel("Enter option 1 here")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(`${_id}-Option-${2}`)
            .setLabel("Enter option 2 here")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(`${_id}-ExtraOptions`)
            .setLabel("Enter extra options here (in separate lines)")
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    await interaction.showModal(Modal);

    // interaction.reply({
    //   content: `Sent message to ${channel}`,
    //   ephemeral: true,
    // });

    // channel.send({
    //   content: `<@&${role}>, Time to play minority game!`,
    // });
  },
};
