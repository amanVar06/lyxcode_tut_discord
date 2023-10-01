const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  SlashCommandBuilder,
  Client,
} = require("discord.js");

const Database = require("../../Schemas/infractions");

const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Restrict a member's ability to communicate")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("Select the target member")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("duration")
        .setDescription(
          "Provide a duration for this timeout (1m, 10m, 30m, 1h, 1d, 1w)"
        )
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("Provide a reason for this timeout")
        .setMaxLength(512)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guild, member } = interaction;

    const target = options.getMember("target");
    const duration = options.getString("duration");
    const reason = options.getString("reason") || "No reason provided.";

    const errorsArray = [];

    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: "Could not timeout member due to" })
      .setColor("Red");

    if (!target) {
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription("Member has most likely left the guild"),
        ],
        ephemeral: true,
      });
    }

    if (!ms(duration) || ms(duration) > ms("28d")) {
      errorsArray.push("Time provided is invalid or over the 28d limit.");
    }

    if (!target.manageable || !target.moderatable) {
      errorsArray.push("Selected target is not moderateable by this bot");
    }

    if (member.roles.highest.position < target.roles.highest.position) {
      errorsArray.push("Selected member has a higher role position than you.");
    }

    if (errorsArray.length) {
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
        ephemeral: true,
      });
    }

    let timeError = false;
    await target.timeout(ms(duration), reason).catch(() => (timeError = true));

    if (timeError) {
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription(
            "Could not timeout user due to an uncommon error. Cannot take negative values"
          ),
        ],
        ephemeral: true,
      });
    }

    const newInfractionsObject = {
      issuerId: member.id,
      issuerName: member.user.username,
      reason: reason,
      date: Date.now(),
    };

    let user = await Database.findOne({
      guildId: guild.id,
      userId: target.id,
    });

    // console.log(user);

    if (!user) {
      user = await Database.create({
        guildId: guild.id,
        userId: target.id,
        infractions: [newInfractionsObject],
      });
    } else {
      user.infractions.push(newInfractionsObject) && (await user.save());
    }

    const successEmbed = new EmbedBuilder()
      .setAuthor({ name: "Timeout issues", iconURL: guild.iconURL() })
      .setColor("Gold")
      .setDescription(
        [
          `${target} was issued a timeout for **${ms(ms(duration), {
            long: true,
          })}** by ${member}`,
          `bringing their infractions total to **${user.infractions.length} points**`,
          `\nReason: ${reason}`,
        ].join("\n")
      );

    return interaction.reply({
      embeds: [successEmbed],
    });
  },
};
