const SQLite = require("better-sqlite3");
const sql = new SQLite('./backend/util/data/data.sqlite');

const config = require('../../config.json');
const discoconfig = require('../../discordconfig.json');


async function dbtablecreate() {

    const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='data';`).get();
    if (!table['count(*)']) {
        
        sql.prepare("CREATE TABLE data (server TEXT, time TEXT, upbool TEXT);").run()
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");

    }

}

/**
 * @typedef {Object} serverobject
 * @property {string} server
 * @property {string} time
 * @property {string} upbool
 */


/**
 * @function dbpush
 * @param {serverobject} serverobject 
 */

async function dbpush(serverobject) {

    sql.prepare(`INSERT INTO 'data' (server, time, upbool) VALUES (@server, @time, @upbool)`).run(serverobject)

}



function dbget() {



}


function discordupdate() {

    

}



module.exports = {dbtablecreate, dbpush, dbget}