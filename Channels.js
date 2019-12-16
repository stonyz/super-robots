const fs = require('fs')
const path = require('path')
const async = require('async')

var channels = {}

//should be fullPath
exports.loadExt = (filepath) => {

    if (!fs.existsSync(filepath)) {
        return;
    }
    console.log('Supported Channels:')
    var that = this;
    fs.readdirSync(filepath).sort().map(file => {
        const ext = path.extname(file)
        const full = path.join(filepath, path.basename(file, ext))

        try {
            const Cmd = require(full);
            const instance = new Cmd()
            console.log(`       ${instance.name}`)
            that.register(instance.name, instance);
        } catch (e) {
            console.log(e);
        }
    })
    console.log('-----------')
}

exports.getChannel = (name) => {
    if (name ==='api') {
        name = 'skype'
    }
    let cmd = channels[name];
    if (cmd) {
        return cmd;
    }
    return null;
}

function exists (name) {
    return channels[name] !== undefined;
}

exports.register = (name,cmd) =>{
    if (exists(name)){
        return false;
    }
    channels[name] = cmd;
    if (typeof cmd.start === "function") { 
        cmd.start();
    }

}
