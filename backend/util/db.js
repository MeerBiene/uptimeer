const SQLite = require("better-sqlite3");
const sql = new SQLite('./backend/util/data/data.sqlite');

const config = require('../../config.json');
const discoconfig = require('../../discordconfig.json');


async function dbtablecreate() {

    const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='data';`).get();
    if (!table['count(*)']) {
        
        sql.prepare("CREATE TABLE data (server TEXT, time TEXT, humantime TEXT, upbool TEXT, minresponse TEXT, average TEXT, maxresponse TEXT, packetloss TEXT, status INTEGER);").run()
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");

    }

}

/**
 * @typedef {Object} serverobject
 * @property {string} server - ID of server that is pinged
 * @property {string} time - time when ping happends
 * @property {string} humantime - human readable time
 * @property {boolean} upbool - is server alive?
 * @property {string} minresponse - minimum response time 
 * @property {string} average - average response time
 * @property {string} maxresponse - maximum response time
 * @property {string} packetloss - packetloss in %
 */


/**
 * @function dbpush
 * @param {serverobject} serverobject 
 */

async function dbpush(serverobject) {

    sql.prepare(`INSERT INTO 'data' (server, time, humantime, upbool, minresponse, average, maxresponse, packetloss, status) VALUES (@server, @time, @humantime, @upbool, @minresponse, @average, @maxresponse, @packetloss, @status)`).run(serverobject)

}



async function dbgetspecificdate(server, dateday, datemonth) {

    let data = sql.prepare(`SELECT * FROM 'data' WHERE server='${server}';`).all()
    let sorted = [];
    
    for (piece in data) {
        if (data.hasOwnProperty(piece)) {
            let props = data[piece]
            console.log(props)

            let today = new Date(1591130460057)
            console.log(today)
            console.log("month: ", today.getMonth(), "day: ", today.getDay())
            
            
            //if (day !== dateday) return
            //if (month !== datemonth) return
            //sorted.push(piece, props)
            console.log(sorted)
        }
    }
    return data
    //console.log(data)
}


function discordupdate() {

    if (!config.discordmodule.enabled) return

}



module.exports = {dbtablecreate, dbpush, dbgetspecificdate}