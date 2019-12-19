const fs = require('fs')
const path = require('path')
var commands={}


exports.load = (filepath) => {

    if (!fs.existsSync(filepath)) {
        return;
    }
    console.log('Supported Commands:')
    var that = this;
    fs.readdirSync(filepath).sort().map(file => {
        const ext = path.extname(file)
        const full = path.join(filepath, path.basename(file, ext))

        try {
            const Cmd = require(full);
            const instance = new Cmd()
            console.log(`       ${instance.name}`)
            add(instance);
        } catch (e) {
            console.log(e);
        }
    })
    console.log('-----------')
}
exports.getCommand = (name) => {
    let cmd = commands[name];
    if (cmd){
        return cmd;
    }
    return commands['unknown'];
}

function add(command){
    commands[command.name] = command;
}

class Unknown {
    constructor(){
        this.name = 'unknown';
    }
    run (option, callback) {
        var errorMsg = "Sorry, I don't understand!";
        return callback(errorMsg);
    }
}
add(new Unknown());

