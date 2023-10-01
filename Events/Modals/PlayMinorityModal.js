const {
  ModalSubmitInteraction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

const voted = new Set();

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isModalSubmit()) return;

    const splittedArray = interaction.customId.split("-");
    if (splittedArray[0] !== "PlayMinority") return;

    const { fields, guild, member } = interaction;

    const channelToSend = splittedArray[2];
    const roleToMention = splittedArray[3];

    const channel = guild.channels.cache.get(channelToSend);

    const question = fields.getTextInputValue(
      `${interaction.customId}-Question`
    );
    const option1 = fields.getTextInputValue(
      `${interaction.customId}-Option-1`
    );
    const option2 = fields.getTextInputValue(
      `${interaction.customId}-Option-2`
    );

    const extraOptions = fields
      .getTextInputValue(`${interaction.customId}-ExtraOptions`)
      .split("\n");

    const options = [option1, option2, ...extraOptions];

    console.log(options);

    const gameEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Minority Game",
      })
      .setTitle(question)
      .setColor("DarkVividPink")
      .setFields([
        {
          name: option1,
          value: "0",
          inline: true,
        },
        {
          name: option2,
          value: "0",
          inline: true,
        },
      ])
      .setTimestamp();

    const replyObject = await channel.send({
      content:
        roleToMention === guild.roles.everyone.id
          ? "@everyone"
          : `<@&${roleToMention}>`,
      embeds: [gameEmbed],
    });

    const optionButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(option1)
        .setCustomId(`PlayMinority-${option1}-${replyObject.id}`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel(option2)
        .setCustomId(`PlayMinority-${option2}-${replyObject.id}`)
        .setStyle(ButtonStyle.Primary)
    );

    replyObject.edit({
      components: [optionButtons],
    });

    const collector = replyObject.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 10000,
    });

    collector.on("collect", async (interaction) => {
      let str = `${interaction.user.id}-${replyObject.id}`;

      if (voted.has(str)) {
        interaction.reply({
          content: "You have already voted!",
          ephemeral: true,
        });
        return;
      }

      const option = interaction.customId.split("-")[1];

      const embed = replyObject.embeds[0];

      const field = embed.fields.find((field) => field.name === option);

      const value = parseInt(field.value);

      field.value = `${value + 1}`;

      await replyObject.edit({
        embeds: [embed],
      });

      voted.add(interaction.user.id);
      interaction.reply({
        content: "Voted!",
        ephemeral: true,
      });
    });

    collector.on("end", async (interaction) => {
      const embed = replyObject.embeds[0];

      const option1 = parseInt(embed.fields[0].value);
      const option2 = parseInt(embed.fields[1].value);

      //   const option1Percentage = Math.round(
      //     (option1 / (option1 + option2)) * 100
      //   );
      //   const option2Percentage = Math.round(
      //     (option2 / (option1 + option2)) * 100
      //   );

      let winner =
        option1 > option2 ? embed.fields[0].name : embed.fields[1].name;

      if (option1 === option2) {
        winner = "Tie";
      }

      const winnerEmbed = new EmbedBuilder()
        .setAuthor({
          name: "Minority Game",
        })
        .setTitle(question)
        .setColor("DarkVividPink")
        .setFields([
          {
            name: embed.fields[0].name,
            value: `${option1} votes`,
            inline: true,
          },
          {
            name: embed.fields[1].name,
            value: `${option2} votes`,
            inline: true,
          },
        ])
        .setDescription(`Winner: ${winner}`)
        .setTimestamp();

      await replyObject.edit({
        embeds: [winnerEmbed],
        components: [],
      });
    });

    interaction.reply({
      content: `Sent message to <#${channelToSend}>`,
      ephemeral: true,
    });
  },
};
