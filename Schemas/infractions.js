const mongoose = require("mongoose");

const infractionsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  infractions: {
    type: Array,
  },
});

module.exports = mongoose.model("infractions", infractionsSchema);
