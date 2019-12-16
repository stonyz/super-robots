const path = require('path')
var restify = require('restify');
var Commands = require("./Commands");
var Channels = require("./Channels");
var tasks = require("./task");
const logger = require('./util/logger');
const SkypeChannel = require('./channel/SkypeChannel');
const SlackChannel = require('./channel/SlackChannel');

class Robots {
    constructor(options) {
        this.port = options.port;
        this.channels = options.channels;
        this.extChannelPath = options.extChannelPath;
        this.commandsPath = options.commandsPath;
        this.tasksPath = options.tasksPath;
    }

    start() {
        var server = restify.createServer();
        var port = process.env.port || process.env.PORT || this.port;
        server.listen(port, function () {
            logger.info(`server started! listening at:${port}`);
        });

        server.use((req, res, next) => {
            // do logging
            logger.info(`Requesting url: ${req.url}`);

            next(); // make sure we go to the next routes and don't stop here
        });

        server.use(restify.plugins.bodyParser({ mapParams: false }));  //to get the request body- json/xml string, whatever
        server.use(restify.plugins.queryParser());  //get Query parameter by req.query.parametername

        server.get('/logs/*', restify.plugins.serveStatic({
            directory: __dirname
        }));
        // Listen for messages from users 
        server.post('/:channel/messages', (req, res, next) => {
            const channelName = req.params.channel;
            const channel = Channels.getChannel(channelName);
            logger.debug('channle is null? ' + channel)
            channel.listen(req, res, next);

        });

        server.post('/:channel/callback', function (req, res, next) {
            var toAddress = req.body && req.body.to;
            if (!toAddress) {
                toAddress = req.params.to;
            }

            if (!toAddress) {
                res.send("can't to field!");
                return;
            }
            logger.info('send message to ' + toAddress);
            var message = req.body && req.body.message || req.params.message || '';


            const channelName = req.params.channel;
            const channel = Channels.getChannel(channelName);

            channel.sendMessage(toAddress, message);
            res.send("send message to bot successfull!");
        });


        this.channels.forEach((channelJson) => {
            const type = channelJson.type;
            const name = channelJson.name;
            if (type == 'skype') {
                let channel = new SkypeChannel(channelJson.appId, channelJson.password);
                Channels.register(name, channel)
            }
            if (type == 'hubot') {
                let channel = new SlackChannel();
                Channels.register(name, channel)
            }
        });
        //load extra channel
        Channels.loadExt(this.extChannelPath);
        Commands.load(this.commandsPath);

        tasks.load(this.tasksPath);
    }

}

module.exports = Robots



