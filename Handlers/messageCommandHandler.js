const { loadFiles } = require("../Functions/fileLoader");

async function loadMessageCommands(client) {
  console.time("Message Commands Loaded");

  client.messageCommands = new Map();

  const commandsTableArray = new Array();

  const files = await loadFiles("MessageCommands");
  // console.log(files);

  for (const file of files) {
    try {
      const command = require(file);

      client.messageCommands.set(command.name, command);

      commandsTableArray.push({ Command: command.name, Status: "✅" });
    } catch (error) {
      console.log(error);
      commandsTableArray.push({
        Command: file.split("/").pop().slice(0, -3),
        Status: "❌",
      });
    }
  }

  console.table(commandsTableArray, ["Command", "Status"]);
  console.info("\n\x1b[36m%s\x1b[0m", "Loaded Message Commands!");

  console.timeEnd("Message Commands Loaded");
}

module.exports = {
  loadMessageCommands,
};
