# Super Robots
[![npm (scoped)](https://img.shields.io/npm/v/super-robots.svg?maxAge=2592000)](https://www.npmjs.com/package/super-robots)
## What's it?
It extends the hubot robot. Hubot only can support a adapter. Super Robots can support serveal hobut instance, and can support Skype Channel.

Super Robots support customer Channel easiyly. That means if some channel can't be integrated to hubot, such as simple web api (support send/receive message by rest api), we can develop a customized channel, and integrated into Super Robots. 

## How to use?
1. Add Super Robots to your project
`` npm install super-robots -save ``
1. Add the following code to your app.js
```
const path = require('path')

var superRobots = require("super-robots");

const options = {
    port : process.env.port || process.env.PORT,
    channels :[{
        name: 'skype',
        type: 'skype',
        appId: 'your skpye bot appId',
        password:'your skype bot password'
     },
     {
        name: 'slack',
        type: 'hubot',
        token: 'your slack token'
     },
    ],
    extChannelPath : path.resolve(".", "channel"),
    commandsPath : path.resolve(".", "command"),
    tasksPath: path.resolve(".", "task")
}

const robots = superRobots.loadBots(options);
robots.start();
```

## Customize
1. add commdands to the folder ./command
1. add channels to the folder ./channel
1. add tasks to the folder ./tasks

**NOTE: You can specify the folder for commands/channels/tasks** 

