const connection = require("../lib/mysql").mysqlConnection();
const DBHelper = require("../utils/dbHelper");
const sendResponse = require("../utils/apiResponse").sendResponse;



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

    if (searchKeyword) {
        // query += `where name like '%${searchKeyword}%' `;
        query += `where name like '%${searchKeyword}%' or description like '%${searchKeyword}%' or email like '%${searchKeyword}%'`;
    }

    if (sortBy && orderBy) {
        query += `order by ${sortBy} ${orderBy} `;
    }

    if (limit || skip) {
        query += `LIMIT ${skip}, ${limit};`;
    }


    DBHelper.getSql(connection, query)
        .then(data => {
            if (data.length) {
                let result = {
                    "items": data,
                    "totalResults": data.length,
                    // page: 1,
                    // "totalPages": 2,
                    // "hasPrevPage": skip > 10 ? true : false,
                    // "prevPage": skip > 10 ? parseInt(skip / 10) : 0,
                    // nextPage: 6,      
                }
                sendResponse(response, false, 200, 2000, result)
            } else {
                sendResponse(response, false, 200, 4002)
            }
        }).catch(error => {
            sendResponse(response, true, 500, 4001, error)
        })
};


