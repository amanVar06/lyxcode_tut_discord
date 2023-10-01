const { loadFiles } = require("../Functions/fileLoader");

async function loadCommands(client) {
  console.time("Commands Loaded");

  client.commands = new Map();
  client.subCommands = new Map();

  const commandsArray = new Array();
  const commandsTableArray = new Array();

  const files = await loadFiles("Commands");
  // console.log(files);

  for (const file of files) {
    try {
      const command = require(file);
      // console.log(`Loaded ${command.data.name} command`, command);

      if (command.subCommand) {
        client.subCommands.set(command.subCommand, command);
        continue;
      }

      client.commands.set(command.data.name, command);

      commandsArray.push(command.data.toJSON());
      // console.log(commandsArray);

      commandsTableArray.push({ Command: command.data.name, Status: "✅" });
    } catch (error) {
      console.log(error);
      commandsTableArray.push({
        Command: file.split("/").pop().slice(0, -3),
        Status: "❌",
      });
    }
  }

  client.application.commands.set(commandsArray);

  console.table(commandsTableArray, ["Command", "Status"]);
  console.info("\n\x1b[36m%s\x1b[0m", "Loaded Commands!");

  console.timeEnd("Commands Loaded");
}

module.exports = {
  loadCommands,
};
