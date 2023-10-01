const {
  GuildMember,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
} = require("discord.js");

const moment = require("moment");

module.exports = {
  name: "guildMemberAdd",
  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const guildConfig = client.guildConfig.get(member.guild.id);
    if (!guildConfig) return;

    const guildRoles = member.guild.roles.cache;
    let assignedRole = member.user.bot
      ? guildRoles.get(guildConfig.botRole)
      : guildRoles.get(guildConfig.memberRole);

    if (!assignedRole) assignedRole = "Not Configured.";
    else
      await member.roles.add(assignedRole).catch((err) => {
        assignedRole = "Failed due to role hierarchy.";
      });

    const logChannel = (await member.guild.channels.fetch()).get(
      guildConfig.memberLogChannel
    );

    if (!logChannel) return;

    let color = "#74e21e";
    let risk = "Fairly Safe";

    const accountCreation = parseInt(member.user.createdTimestamp / 1000);
    // 1692107178

    // console.log(accountCreation);

    const joiningTime = parseInt(member.joinedAt / 1000);

    // console.log(joiningTime);

    const monthsAgo = moment().subtract(2, "months").unix();
    const weeksAgo = moment().subtract(2, "weeks").unix();
    const daysAgo = moment().subtract(2, "days").unix();

    if (accountCreation >= monthsAgo) {
      color = "#e2bb1e";
      risk = "Medium";
    }

    if (accountCreation >= weeksAgo) {
      color = "#e24b1e";
      risk = "High";
    }

    if (accountCreation >= daysAgo) {
      color = "#e21e1e";
      risk = "Extreme";
    }

    const Embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.displayAvatarURL(),
      })
      .setColor(color)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setDescription(
        [
          `• User: ${member.user}`,
          `• Account Type: **${member.user.bot ? "Bot" : "User"}**`,
          `• Role Assigned: ${assignedRole}`,
          `• Risk Level: **${risk}**`,
          `• Account Creation: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
          `• Account Joined: <t:${joiningTime}:D> | <t:${joiningTime}:R>`,
        ].join("\n")
      )
      .setFooter({ text: "Joined" })
      .setTimestamp();

    if (risk === "Extreme" || risk === "High") {
      const Buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`MemberLogging-Kick-${member.id}`)
          .setLabel("Kick")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`MemberLogging-Ban-${member.id}`)
          .setLabel("Ban")
          .setStyle(ButtonStyle.Danger)
      );

      return logChannel.send({ embeds: [Embed], components: [Buttons] });
    } else {
      return logChannel.send({ embeds: [Embed] });
    }
  },
};
