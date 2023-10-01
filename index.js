const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  Collection,
} = require("discord.js");

const { User, GuildMember, Message, ThreadMember } = Partials;

require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Client is now connected to database.");
  })
  .catch((err) => {
    console.log(err);
  });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
  ],
  partials: [User, GuildMember, Message, ThreadMember],
});

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.messageCommands = new Collection();
client.guildConfig = new Collection();
// no sub commands needed for message commands becuase we can just use args

const { loadEvents } = require("./Handlers/eventHandler");
loadEvents(client);

const { loadConfig } = require("./Functions/configLoader");
loadConfig(client);

// console.log(client.config);
// console.log(client.events);

// console.log("Client", client);

client.login(client.config.token);
//   .then(() => {
//     console.log(`Client logged in as ${client.user.username}`);
//     client.user.setActivity(`Watching ${client.guilds.cache.size} server(s)`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// client.on("ready", () => {
//   console.log(`Logged in as ${client.user.username}!`);
//   client.user.setActivity(`Watching ${client.guilds.cache.size} servers`);
// });

// client.login(client.config.token);
