var debug = require("debug")("ifazone:config:mysql");
var mysql = require('mysql');
var config = require("konphyg")(__dirname + "/../config")("all");


var connection = undefined;

exports.mysqlConnection = function () {
    if (connection) {
        console.log('Returning existing connection pool');
        return connection;
    }
    // Important: Ensure that sum of all the server node's pool connectionLimit size < db's max_connections
    connection = mysql.createPool({
        connectionLimit: config.mysql.connectionLimit || 25,
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        port: config.mysql.port,
        debug: config.mysql.debug || false
    });

    connection.on('acquire', function (connection) {
        //console.log('Connection %d acquired', connection.threadId);
    });

    connection.on('enqueue', function () {
        console.log('Waiting for available connection slot');
    });

    connection.on('release', function (connection) {
        //console.log('Connection %d released', connection.threadId);
    });

    //Flag to identify db connection type, It's required for handling transactional connections
    connection.is_pool_conn = true;
    return connection;
};

exports.transactionalConnection = function () {
    return new Promise(function (resolve, reject) {
        if (!connection) {
            return reject(new Error('Connection is not intialized.'));
        }
        if (!connection.is_pool_conn) {
            return resolve(connection);
        }
        connection.getConnection(function (err, conn) {
            if (err) {
                return reject(err);
            }
            return resolve(conn);
        });
    });
};

