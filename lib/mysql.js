var mysql = require('mysql');

var connection = undefined;

exports.mysqlConnection = function () {
    if (connection) {
        console.log('Returning existing connection pool');
        return connection;
    }
    // Important: Ensure that sum of all the server node's pool connectionLimit size < db's max_connections
    connection = mysql.createPool({
        connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 25,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
        debug: process.env.MYSQL_DEBUG || false
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

