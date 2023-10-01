const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

const { profileImage } = require("discord-arts");

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13) {
    return number + "th";
  }

  switch (number % 10) {
    case 1:
      return number + "st";
    case 2:
      return number + "nd";
    case 3:
      return number + "rd";
    default:
      return number + "th";
  }
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["X"];
  const badgeMap = {
    ActiveDeveloper: "<:activedeveloper:1141095456307433534>",
    BugHunterLevel1: "<:discordbughunter1:1141095467489427470>",
    BugHunterLevel2: "<:discordbughunter2:1141095473227255899>",
    PremiumEarlySupporter: "<:discordearlysupporter:1141095477190873160>",
    Partner: "<:discordpartner:1141095489551470622>",
    Staff: "<:discordstaff:1141095493980668074>",
    HypeSquadOnlineHouse1: "<:hypesquadbravery:1141095501693980755>", // bravery
    HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1141095506425151569>", // brilliance
    HypeSquadOnlineHouse3: "<:hypesquadbalance:1141095499764613231>", // balance
    Hypesquad: "<:hypesquadevents:1141095510829183046>",
    CertifiedModerator: "<:olddiscordmod:1141095515216420895>",
    VerifiedDeveloper: "<:discordbotdev:1141095463194476735>",
  };

  return badgeNames.map((badgeName) => badgeMap[badgeName] || "❔");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("memberinfo")
    .setDescription("View your or any member's information")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription(
          "View information of a member. Leave empty to view your own information."
        )
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const member =
      interaction.options.getMember("member") || interaction.member;

    if (member.user.bot)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Bots don't have profiles right now!")
            .setColor("Red"),
        ],
        ephermeral: true,
      });

    try {
      const fetchMembers = await interaction.guild.members.fetch();

      const profileBuffer = await profileImage(member.id);

      const imageAttachment = new AttachmentBuilder(profileBuffer, {
        name: "profile.png",
      });

      const joinPosition =
        Array.from(
          fetchMembers
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            .keys()
        ).indexOf(member.id) + 1;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);

      const createdTime = parseInt(member.user.createdTimestamp / 1000);

      const Booster = member.premiumSince
        ? "<:discordboost7:1141095460484952174>"
        : "❌";

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${member.user.tag} | General Information`,
          iconURL: member.displayAvatarURL(),
        })
        .setColor(member.displayColor)
        .setDescription(
          `On <t:${joinTime}:D>, ${member} joined as the **${addSuffix(
            joinPosition
          )}** member of this server.`
        )
        .setImage("attachment://profile.png")
        .addFields([
          {
            name: "Badges",
            value: `${addBadges(userBadges).join("")}`,
            inline: true,
          },
          {
            name: "Booster",
            value: `${Booster}`,
            inline: true,
          },
          {
            name: "Top Roles",
            value: `${
              topRoles.length
                ? topRoles.join("").replace(`<@${interaction.guildId}>`)
                : "None"
            }`,
            inline: false,
          },
          {
            name: "Created",
            value: `<t:${createdTime}:R>`,
            inline: true,
          },
          {
            name: "Joined",
            value: `<t:${joinTime}:R>`,
            inline: true,
          },
          {
            name: "Identifier",
            value: `\`${member.id}\``,
            inline: false,
          },
          {
            name: "Avatar",
            value: `[Link](${member.displayAvatarURL()})`,
            inline: true,
          },
          {
            name: "Banner",
            value: `[Link](${(await member.user.fetch()).bannerURL()})`,
            inline: true,
          },
        ])
        .setTimestamp();

      interaction.editReply({
        embeds: [embed],
        files: [imageAttachment],
      });
    } catch (error) {
      interaction.editReply({
        content: "An error occured while fetching the member's information.",
        ephemeral: true,
      });

      throw error;
    }
  },
};
