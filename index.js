const moment = require("moment");
const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
const chalk = require("chalk");
const config = require('./config.json')
const ws = require('./backend/server')
const fetch = require('node-fetch')
const handle = require('./backend/util/db')
const discoconfig = require('./discordconfig.json')
const Keyv = require('keyv');
const cache = new Keyv('sqlite://backend/util/data/cache.sqlite')
var CronJob = require('cron').CronJob;





if (config.discordmodule.enabled) { 
  
    var client = require('./backend/util/discord')

}


async function pollstarter() {

    var job = new CronJob(`0 */${config.interval} * * * *`, function() {
        
        poller()

      }, null, true, 'America/Los_Angeles');
      job.start();

}


async function poller() {

    var topoll = config.servers
    for (let server in topoll) {
        if (topoll.hasOwnProperty(server))
        var props = topoll[server]
        advancedpoller(server, props)
        
    }

    
}


// TODO: discord message update when server down
function advancedpoller(server, props) {
    fetch(props.IP)
        .then(async res => {
            if (config.debug) {
                console.log(timestamp + "The server '" + props.IP + "' responded with the statuscode:", res.status)
            }
            if (res.status !== 200) throw new Error('Server doenst seem to be online.')
            await handle.dbtablecreate();
            let serverobject = {
                server: `${server}`,
                time: `${new Date()}`,
                upbool: `${true}`
            }
            await handle.dbpush(serverobject);
            
            

        })
        .catch(async error => {
            await handle.dbtablecreate();
            let serverobject = {
                server: `${server}`,
                time: `${new Date()}`,
                upbool: `${false}`
            }
            await handle.dbpush(serverobject);
        })


        

}




function websocket() {
    
    // TODO: figure out how to ping minecraft servers

    if (!config.indexroute.includes("/")) return console.error(`${chalk.bgRed.white("[ERROR]")} Your index route is noted incorrectly. Referr to the examples below.\nExamples:\n  "/uptime" -> will serve everything at "yourdomain.com/uptime" \n  "/" -> will serve everything at "yourdomain.com/" \nPlease fix your config accordingly before starting the server again.`)
    
    if (config.interval < 5) return console.error(`${chalk.bgRed.white("[ERROR]")} Your polling intervall cannot be lower than 5 minutes. Please fix your config before restarting the server again.`)

    if (config.interval > 60) return console.error(`${chalk.bgRed.white("[ERROR]")} Your polling intervall cannot be higher than 60 minutes/ 1 hour. Please fix your config before restarting the server again.`)
    
    const Ws = new ws(config.port)

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
        console.error(`${chalk.bgRed.white("[ERROR]")} The mode option only accepts the arguments "light" or "dark". Please fix your config before starting the server again.`)
}