const Discord = require('discord.js')
const discoconfig = require('../../discordconfig.json')
const chalk = require('chalk')
const Keyv = require('keyv');
const cache = new Keyv('sqlite://backend/util/data/cache.sqlite')
const client = new Discord.Client();

// TODO: discord message update when server down

async function init() {



    client.on('ready', () => {
        console.log(`${chalk.bgBlueBright.white("[DISCORD]")} Your Bot "${client.user.username}" is logged in and ready to go.`)
    })


    client.on('message', (message) => {
        if (message.content === `${discoconfig.PREFIX}status`) {

            message.delete().catch(e => {console.error(e)});

            let embed = new Discord.MessageEmbed()
                .setDescription(":green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square: Service is online \n\nThis will be your status message, where all configured servers will be shown. It will update, when the servers are polled the next time.")
                .setColor("GREEN")

            message.channel.send(embed).then(async msg => {
                // TODO - set message to db.
                await cache.set("message", `${msg.id}`)
                await cache.set("channel", `${msg.channel.id}`)

            })
        }
    });


    client.on("serverdown", (server, props) => {

    });

    client.on("serverup", (server, props) => {

    });

    client.on("ready", client => {

    });


    client.login(discoconfig.TOKEN)
    

}

init();





module.exports = {client};



