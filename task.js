const fs = require('fs')
const path = require('path')
var schedule = require('node-schedule');
var Commands = require("./Commands");
var Channels = require("./Channels");

exports.load = (filepath) => {
    if (!fs.existsSync(filepath)) {
        return;
    }
    console.log(' loading tasks...')
    fs.readdirSync(filepath).sort().map(file => {
        const ext = path.extname(file)
        const full = path.join(filepath, path.basename(file, ext))

        try {
            const Cmd = require(full);
  
            schedule.scheduleJob(Cmd.cron,Cmd.getCommand());
        } catch (e) {
            console.log(e);
        }
    })
}

class Task {
    constructor(cron){
        this.cron = cron;
        this.Commands = Commands;
        this.Channels = Channels;
    }
}

exports.Task = Task;