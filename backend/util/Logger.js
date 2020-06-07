const chalk = require("chalk");
const moment = require("moment");
const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
const config = require('../../config.json')


function debug(msg) {
    if (!config.debug) return;
    console.log(timestamp + " " + msg)
}

module.exports = debug;