const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Provide the question to ask")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const pollQuestion = interaction.options.getString("question");

    const pollEmbed = new EmbedBuilder()
      .setTitle("Question")
      .setDescription(pollQuestion)
      .setColor([104, 204, 156])
      .setImage("https://i.ibb.co/vxdBKFd/Untitled-1.gif")
      .addFields([
        { name: "Yes's", value: "0", inline: true },
        { name: "No's", value: "0", inline: true },
      ]);

    const replyObject = await interaction.reply({
      embeds: [pollEmbed],
      fetchReply: true,
    });

    const pollButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Yes")
        .setCustomId(`Poll-Yes-${replyObject.id}`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setLabel("No")
        .setCustomId(`Poll-No-${replyObject.id}`)
        .setStyle(ButtonStyle.Danger)
    );

    interaction.editReply({
      components: [pollButtons],
    });
  },
};
