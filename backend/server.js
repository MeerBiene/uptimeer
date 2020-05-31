const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
var cors = require('cors')
const path = require("path");
const chalk = require("chalk");
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const config = require('../config.json');
const handle = require('../backend/util/db');

class server {

    constructor(port) {

        this.port = port;

        

        if (config.logging) {
            var accessLogStream = rfs.createStream('access.log', {
                interval: '1d', // rotate daily
                path: path.join(__dirname, 'log')
            })
        }

        this.app = express();

        this.app.engine(
            "hbs",
            hbs({
                extname: "hbs",
                defaultLayout: "layout",
                layoutsDir: __dirname + "/layouts",
            })
        );

        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "hbs");
        this.app.use(express.static(__dirname + "public"));
        

        this.app.use(cors())
        if (config.logging){
            this.app.use(morgan('combined', {stream: accessLogStream}))
        }
        this.app.use(
            bodyParser.urlencoded({
                extended: false,
            })
        );
        this.app.unsubscribe(bodyParser.json());

        this.registerRoots();

        // todo: list all loaded routes in console log

        this.server = this.app.listen(this.port, () => {
            console.log(
                `${chalk.bgMagenta(
                    "[UPTIMEER]"
                )} Your Uptime tracker webserver is running and listening on port: ${port}`
            );
        });

    }


    registerRoots() {

        /**
         * Routes: /index -> render uptime thingy
         * 
         * 
         */

        this.app.get(`${config.indexroute}`, (req, res) => {
            res.render(`index_${config.mode}`, {
                title: "Uptime Robot",
                sometest: "If you see this, your server is working"
            });
            
        });

        this.app.get('/jsonapi', async (req, res) => {
             let test = await handle.dbgetspecificdate(req.query.server, req.query.date)
                
             .then(data => { 
                    console.log(data)
                    res.json({data})
                 })
                 
                 //console.log(test)
        })

    }

}

module.exports = server;