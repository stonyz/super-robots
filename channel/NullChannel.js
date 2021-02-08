const Channel = require('../Channel.js');

class NullChannel extends Channel {
    constructor(){
        super();
    }

    listen (req, res, next){
        res.send("The Channle can't be found!");
    }

    sendMessage(channelId, message, cb) {
        cb("1", "The Channle can't be found!");
    }
}
module.exports = NullChannel