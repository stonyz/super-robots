
var callfile = require('child_process');
var fs = require('fs');

function executeShell(shell, args, callback){
    fs.exists(shell, function (exists) {
        if (!exists) {
            callback("Can't find the deploy script!");
            return;
        }
        callfile.execFile(shell, args, null, function (err, stdout, stderr) {
            // callback(err, stdout, stderr);
            var respMsg = "# Shell Output,\n\n" + stdout;
            if (stderr) {
                respMsg = respMsg + "\n# Shell Error Output,\n\n" + stderr;
            }
            if (err) {
                respMsg = respMsg + "ERROR CODE:" + err;
            }
            // console.log(respMsg);
            callback(null, respMsg);
        });
    })
}

exports.executeShell = executeShell;
