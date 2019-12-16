var builder = require('botbuilder');
const logger = require('../util/logger');
const Channel = require('../Channel.js');

class SkypeChannel extends Channel {
    constructor(appId, appPassword) {
        super();
        this.name = 'skype';
        this.appId = appId;
        this.appPassword = appPassword;
        this.handelImcomingMsg = this.handelImcomingMsg.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        
    }

    start() {
        // Create the chat connector for communicating with the Bot Framework Service
        this.connector = new builder.ChatConnector({
            appId: this.appId,
            appPassword: this.appPassword
        });
        this.listen = this.connector.listen();
        // Create your bot with a function to receive messages from the user
        var inMemoryStorage = new builder.MemoryBotStorage();
        this.bot = new builder.UniversalBot(this.connector, this.handelImcomingMsg).set('storage', inMemoryStorage);
        this.bot.on('conversationUpdate', message => this.handleUpdateMessage(message));
    }

    handleUpdateMessage(message) {
        logger.info(JSON.stringify(message));
        if (message.membersAdded && message.membersAdded.length > 0) {
            var membersAdded = message.membersAdded
                .map(function (m) {
                    var isSelf = m.id === message.address.bot.id;
                    return (isSelf ? message.address.bot.name : m.name) || (' (Id: ' + m.id + ')');
                })
                .join(', ');

            this.bot.send(new builder.Message()
                .address(message.address)
                .text('Welcome to join the group!'));
        }

    }

     handelImcomingMsg(session) {
        // echo the user's message
        logger.info(JSON.stringify(session.message));
        var fromAddress = session.message.address;
        // var messageText = session.message.text;  //For test client
        var messageText = session.message.sourceEvent && session.message.sourceEvent.text || session.message.text;  //For prod
        messageText = messageText.replace(/<at.*>.*<\/at>/g, "").trim();
        messageText = messageText.replace(/\s+/g, " ");
        logger.info('Incoming Msg:' + messageText + ' from:' + JSON.stringify(fromAddress));
        if (messageText.indexOf("Edited previous message") === 0) {
            logger.info('Ingore updated message');
            return;
        }

        if (this.isMentionAll(session.message)) {
            return session.send("Yeah, I'm here.");
        }

        var fromAddress = session.message.address;
      
        const userProfile = {
            userId: fromAddress.user.id,
            userName: fromAddress.user.name,
            channelId: fromAddress.conversation.id
        }
        super.runCommand(userProfile, messageText, (msg) => {
            session.send(msg);
        });

    }

    isMentionAll(message) {
        if (message.entities) {
            var result = message.entities
                .filter(entity => (entity.type === "mention" && entity.mentioned.id === '*'));
            // logger.info(result);   
            return result.length !== 0;
        }
        return false;
    }

    sendMessage(address, message) {
        if ((typeof address) === "string") {
            address = JSON.parse(address);
        }

        var msg = new builder.Message().address(address);
        msg.text(message);
        msg.textLocale('en-US');
        this.bot.send(msg);
    }
}
module.exports = SkypeChannel