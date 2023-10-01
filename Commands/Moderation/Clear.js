const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

const transcripts = require("discord-html-transcripts");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete Bulk messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Provide the amount of messages to delete")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Provide the reason for deleting messages")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Provide the target user to delete messages from")
        .setRequired(false)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const amount = interaction.options.getNumber("amount");
    const reason = interaction.options.getString("reason");
    const target = interaction.options.getUser("user");

    // const guildConfig = client.guildConfig.get(interaction.guild.id);
    const channelMessages = await interaction.channel.messages.fetch();

    // console.log(guildConfig.modLogChannel);

    const logChannel = interaction.guild.channels.cache.get(
      "1141079402755665931"
    );

    const responseEmbed = new EmbedBuilder().setColor("DarkOrange");

    const logEmbed = new EmbedBuilder()
      .setColor("DarkPurple")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle("CLEAR COMMAND USED");

    let logEmbedDescription = [
      `• Moderator: ${interaction.member}`,
      `• Target: ${target ?? "None"}`,
      `• Channel: ${interaction.channel}`,
      `• Reason: **${reason}**`,
    ];

    if (target) {
      let i = 0;
      let messagesToDelete = [];
      channelMessages.forEach((message) => {
        if (message.author.id === target.id && amount > i) {
          messagesToDelete.push(message);
          i++;
        }
      });

      const transcript = await transcripts.generateFromMessages(
        messagesToDelete,
        interaction.channel
      );

      interaction.channel
        .bulkDelete(messagesToDelete, true)
        .then((messages) => {
          interaction.reply({
            embeds: [
              responseEmbed.setDescription(
                `🧹 Cleared \`${messages.size}\` messages from ${target}`
              ),
            ],
            ephemeral: true,
          });

          logEmbedDescription.push(`• Total Messages: __${messages.size}__`);

          logChannel.send({
            embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
            files: [transcript],
          });
        })
        .catch((err) => {
          console.log(err);
          interaction.reply({
            embeds: [
              responseEmbed.setDescription(
                `❌ Some error occured in deleting messages`
              ),
            ],
            ephemeral: true,
          });
        });
    } else {
      const transcript = await transcripts.createTranscript(
        interaction.channel,
        { limit: amount }
      );

      interaction.channel.bulkDelete(amount, true).then((messages) => {
        interaction.reply({
          embeds: [
            responseEmbed.setDescription(
              `🧹 Cleared \`${messages.size}\` messages`
            ),
          ],
          ephemeral: true,
        });

        logEmbedDescription.push(`• Total Messages: __${messages.size}__`);

        logChannel.send({
          embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
          files: [transcript],
        });
      });
    }
  },
};
