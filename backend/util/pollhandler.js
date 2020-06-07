const config = require('../../config.json')
const CronJob = require('cron').CronJob;
const ping = require('ping');
const debug = require('./Logger')
const fetch = require('node-fetch');
const handle = require('./db');

if (config.discordmodule.enabled) {
    var client = require("./backend/util/discord");
}




function pollstart() {
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
};

function poller() {
    var topoll = config.servers;
    for (let server in topoll) {
        if (topoll.hasOwnProperty(server)) var props = topoll[server];
        advancedpoller(server, props);
    }
};

function advancedpoller(props) {

    switch (props.type.toLowerCase()) {
        case "web":
            webpoller(server, props);
        break;
        case "mc":
            mcpoller();
        break;
    }

};

async function webpoller(server, props) {
    
    handle.dbtablecreate();
    const today = Date.now();
    const humantime = `${new Date(today)}`
    handle.dbgetspecificdate("lobby-bot", "3", "5")
    ping.promise.probe(props.IP, {
        timeout: 30,
        extra: ['-c', config.packetamount]
    })
        .then(async res => {
            console.log(res)
            let serverobject = {
                server: `${server}`,
                time: `${today}`,
                humantime: `${humantime}`,
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
                        client.emit("serverup", server, props)
                    } else {
                        serverobject.status = `000`
                        await handle.dbpush(serverobject);
                        client.emit("serverdown", server, props)
                    }
                    
                    
                })
                .catch(async error => {
                    debug(error)
                    serverobject.status = `000`
                    await handle.dbpush(serverobject)
                })

        })
};

async function mcpoller() {
    // TODO: create seperate MC Poller for 
    if (!props.port) return console.error(`You specified no port for the minecraft server. Please fix your config accoringly before restarting the server.`)
    // mc server ping here.
    console.log("mcserver")
};

export default { pollstart };
