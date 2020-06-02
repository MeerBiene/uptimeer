const moment = require("moment");
const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
const chalk = require("chalk");
const config = require("./config.json");
const ws = require("./backend/server");
const fetch = require("node-fetch");
const handle = require("./backend/util/db");
const discoconfig = require("./discordconfig.json");
const Keyv = require("keyv");
const ping = require("minecraft-server-util");
const debug = require('./backend/util/Logger')
const cache = new Keyv('sqlite://backend/util/data/cache.sqlite');
var CronJob = require('cron').CronJob;
const pingg = require('ping');
var hosts = ['46.4.64.96', 'yahoo.com'];


if (config.discordmodule.enabled) {
  var client = require("./backend/util/discord");
}

async function pollstarter() {
  var job = new CronJob(
    `0 */${config.interval} * * * *`,
    function () {
      poller();
    },
    null,
    true,
    "America/Los_Angeles"
  );
  job.start();
}

async function poller() {
  var topoll = config.servers;
  for (let server in topoll) {
    if (topoll.hasOwnProperty(server)) var props = topoll[server];
    advancedpoller(server, props);
  }
}

// TODO: discord message update when server down
function advancedpoller(server, props) {
  if (props.type.toLowerCase() === "web") {
    const today = Date.now();
    console.log(today)
    handle.dbtablecreate();
    pingg.promise.probe(props.IP, {
      timeout: 10,
      extra: ['-c', '4']
    })
      .then(async res => {
        console.log(res)
        let serverobject = {
          server: `${server}`,
          time: `${today}`,
          upbool: `${res.alive}`,
          minresponse: `${res.min}`,
          average: `${res.avg}`,
          maxresponse: `${res.max}`,
          packetloss: `${res.packetLoss}`,
          status: ""
        }
    if (!props.IP.includes('http://')) {
      var URI = `http://${props.IP}/`
    } else if (!props.IP.includes('https://')) {
      var URI = `http://${props.IP}/`
    } else {
      var URI = props.IP
    }
    fetch(URI)
        .then(async res => {
          if (res) {
          serverobject.status = `${res.status}`
          await handle.dbpush(serverobject);
          } else {
          serverobject.status = `000`
          await handle.dbpush(serverobject);
          }  
        })
        .catch(async error => {
          debug(error)
          serverobject.status = `000`
          await handle.dbpush(serverobject)
        })
      
      })

    
  } else if (props.type.toLowerCase() === "mc") {
      if (!props.port) return console.error(`You specified no port for the minecraft server. Please fix your config accoringly before restarting the server.`)
    // mc server ping here.
      console.log("mcserver")
  }
}

function websocket() {
  // TODO: figure out how to ping minecraft servers

  if (!config.indexroute.includes("/"))
    return console.error(
      `${chalk.bgRed.white(
        "[ERROR]"
      )} Your index route is noted incorrectly. Referr to the examples below.\nExamples:\n  "/uptime" -> will serve everything at "yourdomain.com/uptime" \n  "/" -> will serve everything at "yourdomain.com/" \nPlease fix your config accordingly before starting the server again.`
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

  pollstarter();
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