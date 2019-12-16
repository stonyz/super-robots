var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
const logger = require('./logger');

var file = "./deploy.db";
var exists = fs.existsSync(file);

let db = new sqlite3.Database('./deploy.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        logger.info('Connected to the chinook database.');
    }
});

if (!exists) {
    db.run("CREATE TABLE deploy_history (project TEXT,deploy_by TEXT, deploy_time TEXT, status TEXT, log_file TEXT, server TEXT)");
}

exports.addNew = (record)=> {
    var stmt = db.prepare("INSERT INTO deploy_history (project, deploy_by, deploy_time, status, log_file, server) VALUES (?,?,?,?,?,?)");
    stmt.run(record.project, record.deployBy,record.deployTime, record.status, record.logFile, record.server);
    stmt.finalize();
}

exports.showAll = () =>{
    db.each("SELECT * FROM Stuff", function(err, row) {
        logger.info( row.thing);
      });
}

exports.show = (from, num, q, cb) =>{
    db.serialize(function () {
        let sql = `SELECT * FROM deploy_history `;
        if (q){
            sql += `WHERE project like '%${q}%' `;
        }
        sql += `ORDER BY deploy_time DESC LIMIT ${num} OFFSET ${from} `;
        db.all(sql, function (err, rows) {
            logger.info(JSON.stringify(rows));
            cb && cb(err,rows);
        });
    });
}

exports.query = (sql, cb) => {
    db.serialize(function () {
        db.all(sql, function (err, rows) {
            logger.info(JSON.stringify(rows));
            cb && cb(err,rows);
        });
    });
}