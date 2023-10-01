const { GuildMember, EmbedBuilder, Client } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "guildMemberRemove",
  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const guildConfig = await client.guildConfig.get(member.guild.id);
    if (!guildConfig) return;

    const logChannel = (await member.guild.channels.fetch()).get(
      guildConfig.memberLogChannel
    );

    if (!logChannel) return;

    const accountCreation = parseInt(member.user.createdTimestamp / 1000);

    const serverLeft = moment().unix();
    // console.log(serverLeft);

    const Embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.displayAvatarURL(),
      })
      .setColor("Fuchsia")
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setDescription(
        [
          `• User: ${member.user}`,
          `• Account Type: **${member.user.bot ? "Bot" : "User"}**`,
          `• Account Creation: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
          `• Left Server: <t:${serverLeft}:D> | <t:${serverLeft}:R>`,
        ].join("\n")
      )
      .setFooter({ text: "Left" })
      .setTimestamp();

    logChannel.send({ embeds: [Embed] });
  },
};
