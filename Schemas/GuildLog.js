const { model, Schema } = require("mongoose");

module.exports = model(
  "GuildLog",
  new Schema({
    guildId: String,
    memberLogChannel: String,
    modLogChannel: String,
    defaultMemberRole: String,
    defaultBotRole: String,
  })
);
