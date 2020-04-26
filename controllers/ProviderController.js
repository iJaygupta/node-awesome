const connection = require("../lib/mysql").mysqlConnection();
const DBHelper = require("../utils/dbHelper");


/**
 * Get List of Internet Service Provider.
 *
 * @param {string}      limit
 * @param {string}      skip
 * @param {string}      sortBy
 * @param {string}      orderBy
 * @param {string}      searchKeyword 
 *
 * @returns {Object}
 */

exports.listServiceProvider = (request, response) => {

    let limit = parseInt(request.query.limit) || 10;
    let skip = parseInt(request.query.skip) || 0;
    let sortBy = request.query.sortBy;
    let orderBy = request.query.orderBy;

    let searchKeyword = request.query.searchKeyword || "";

    let query = `select * from provider `

    if (sortBy && orderBy) {
        query += `order by ${sortBy} ${orderBy} `;
    }

    if (limit || skip) {
        query += `LIMIT ${skip}, ${limit};`;
    }


    DBHelper.getSql(connection, query)
        .then(data => {
            let result = {
                "items": data,
                "totalResults": data.length,
                // page: 1,
                // "totalPages": 2,
                // "hasPrevPage": skip > 10 ? true : false,
                // "prevPage": skip > 10 ? parseInt(skip / 10) : 0,
                // nextPage: 6,      
            }
            response.send(result);

        }).catch(error => {
            response.send(error)
        })
};


