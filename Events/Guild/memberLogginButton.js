const {
  ButtonInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const splitArray = interaction.customId.split("-");
    if (splitArray[0] !== "MemberLogging") return;

    const member = (await interaction.guild.members.fetch()).get(splitArray[2]);
    const Embed = new EmbedBuilder();
    const errorArray = [];

    if (!member)
      return interaction.reply({
        embeds: [
          Embed.setDescription(
            "This user is no longer a member of this guild."
          ),
        ],
      });

    // or we can just write "KickMembers" or "BanMembers" instead of PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
    if (
      !interaction.member.permissions.has(
        PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
      )
    )
      errorArray.push("- You do not have required permission for this action.");

    if (!member.moderatable)
      errorArray.push(`- **${member}** is not moderatable by this bot.`);

    if (errorArray.length) {
      return interaction.reply({
        embeds: [
          Embed.setTitle("Error")
            .setColor("DarkRed")
            .setDescription(errorArray.join("\n")),
        ],
        ephemeral: true,
      });
    }

    switch (splitArray[1]) {
      case "Kick":
        {
          member
            .kick(
              `Kicked by ${interaction.user.username} | Member Logging System`
            )
            .then(() => {
              interaction.reply({
                embeds: [
                  Embed.setDescription(
                    `**${member}** has been kicked.`
                  ).setColor("DarkNavy"),
                ],
              });
            })
            .catch((err) => {
              interaction.reply({
                embeds: [
                  Embed.setDescription(
                    `**${member}** could not be kicked.`
                  ).setColor("DarkRed"),
                ],
              });
            });
        }
        break;
      case "Ban":
        {
          member
            .ban({
              reason: `Banned by ${interaction.user.username} | Member Logging System`,
              deleteMessageSeconds: 0,
            })
            .then(() => {
              interaction.reply({
                embeds: [
                  Embed.setDescription(
                    `**${member}** has been banned from this guild.`
                  ).setColor("DarkNavy"),
                ],
              });
            })
            .catch((err) => {
              console.log(err);
              interaction.reply({
                embeds: [
                  Embed.setDescription(
                    `**${member}** could not be banned.`
                  ).setColor("DarkRed"),
                ],
              });
            });
        }
        break;
    }
  },
};
