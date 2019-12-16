'use strict'
require('coffeescript');
var path = require('path');
const Channel = require('../Channel.js');
const logger = require('../util/logger');

class SlackChannel extends Channel {

    constructor(){
        super();
        this.name = 'slack';
    }

    start() {
        var hubot = require('hubot');
        var robot = hubot.loadBot(undefined, "slack", false, "", false);
        robot.adapter.once('connected', function () {
            loadScripts(robot);
            logger.debug('The Slack hubot login!');
        });
        robot.run(); // will open it
        var that = this;
        var loadScripts = function (robot) {
            var scriptsPath = path.resolve(".", "scripts");
            logger.debug('script path=' + scriptsPath);
            // robot.load(scriptsPath);
            robot.respond(/(.*)/i, [], (resp) => {
                that.run(resp);
            });
        };
    }

    run(resp) {
        const messageText = resp.match[1];
        logger.debug('slack receive msg:' + messageText);

        const userProfile = {
            userId: resp.envelope.user.id,
            userName: resp.envelope.user.real_name,
            channelId: resp.envelope.user.room
        }
        super.runCommand(userProfile, messageText, (msg) => {
            resp.send(msg);
        });
    }

    listen (req, res, next){
        let body = req.body;
        const type = body.type;
        if (type === 'url_verification'){
            const challenge = body.challenge;
            res.send(challenge);
            return;
        }
    }

    sendMessage (address, message) {

    }
}

module.exports = SlackChannel
