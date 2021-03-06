var Commands = require("./Commands");
class Channel {
    constructor (){
        
    }
    runCommand(userProfile, messageText, replier) {
        messageText = messageText.replace(/\s*,\s*/g,','); //remove the space before/after comma
        var phases = messageText.split(" ");
        var cmd = phases[0];
        var argv = phases.slice(1);

        let command = Commands.getCommand(cmd);
        command && command.run(
            {
                argv,
                rawCommand: messageText,
                userProfile
            },
            replier,
            this);
    }
}

module.exports = Channel
