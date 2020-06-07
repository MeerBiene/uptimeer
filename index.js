const chalk = require("chalk");
const config = require("./config.json");
const ws = require("./backend/server");
var pollstart = require('./backend/util/pollhandler')


function websocket() {

  if (!config.indexroute.includes("/"))
    return console.error(
      `${chalk.bgRed.white(
        "[ERROR]"
      )} Your index route is noted incorrectly. Referr to the examples below.\nExamples:\n  "/uptime" -> will serve everything at "example.com/uptime" \n  "/" -> will serve everything at "example.com/" \nPlease fix your config accordingly before starting the server again.`
    );

  if (config.interval < 1)
    return console.error(
      `${chalk.bgRed.white(
        "[ERROR]"
      )} Your polling intervall cannot be lower than 5 minutes. Please fix your config before restarting the server again.`
    );

  if (config.interval > 60)
    return console.error(
      `${chalk.bgRed.white(
        "[ERROR]"
      )} Your polling intervall cannot be higher than 60 minutes/ 1 hour. Please fix your config before restarting the server again.`
    );

  const Ws = new ws(config.port);

  pollstart();
}

switch (config.mode) {
  case "light":
    // execute stuff
    websocket();
    break;
  case "dark":
    // execute
    websocket();
    break;
  default:
    console.error(
      `${chalk.bgRed.white(
        "[ERROR]"
      )} The mode option only accepts the arguments "light" or "dark". Please fix your config before starting the server again.`
    );
}