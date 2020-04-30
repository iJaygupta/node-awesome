const connection = require("../lib/mysql").mysqlConnection();
const DBHelper = require("../utils/dbHelper");
const sendResponse = require("../utils/apiResponse").sendResponse;
const resPerPage = process.env.RESULTS_PER_PAGE || 10;


/**
 * Get List of Internet Service Provider.
 *
 * @param {string}      page
 * @param {string}      pagination
 * @param {string}      searchKeyword 
 * @param {string}      orderBy
 * @param {string}      sortBy
 * @param {string}      limit
 * @param {string}      skip
 *
 * @returns {Object}
 */

exports.listServiceProvider = (request, response) => {


    let page = parseInt(request.query.page) || 1;
    let sortBy, orderBy, limit, skip, searchKeyword;

    if (!(request.query.pagination && request.query.page)) {
        sortBy = request.query.sortBy;
        orderBy = request.query.orderBy;
        limit = parseInt(request.query.limit) || resPerPage;
        skip = parseInt(request.query.skip) || 0;
        searchKeyword = request.query.searchKeyword || "";
    } else {
        limit = resPerPage;
        skip = (page - 1) * resPerPage
    }

    let query = `select * from provider `
    let countQuery = `select count(*) as totalRecords from provider ;`
    let countResult = DBHelper.getSql(connection, countQuery);

    if (searchKeyword) {
        query += `where name like '%${searchKeyword}%' or description like '%${searchKeyword}%' or lowest_price like '%${searchKeyword}%'`;
    }

    if (sortBy && orderBy) {
        query += `order by ${sortBy} ${orderBy} `;
    }

    if (limit || skip) {
        query += `LIMIT ${skip}, ${limit};`;
    }


    DBHelper.getSql(connection, query)
        .then(data => {
            countResult.then(countData => {
                if (data.length) {
                    let result = {
                        "items": data,
                        "totalRecords": countData[0].totalRecords,
                        "totalResult": data.length,
                        "pagination": !(request.query.pagination && request.query.page) ? false : ""
                    }
                    if (request.query.pagination && request.query.page) {
                        result["pagination"] = {
                            "totalRecords": countData[0].totalRecords,
                            "totalPages": Math.ceil(countData[0].totalRecords / resPerPage),
                            "currentPage": page,
                            "resPerPage": resPerPage,
                            "hasPrevPage": page > 1,
                            "hasNextPage": page < Math.ceil(countData[0].totalRecords / resPerPage),
                            "previousPage": page > 1 ? page - 1 : null,
                            "nextPage": page < Math.ceil(countData[0].totalRecords / resPerPage) ? page + 1 : null
                        }
                    } else {
                        if (request.query.limit) {
                            result["limit"] = limit
                        }
                        if (request.query.skip) {
                            result["skip"] = skip
                        }
                    }
                    sendResponse(response, false, 200, 2000, result)
                } else {
                    sendResponse(response, false, 200, 4002)
                }
            })
        }).catch(error => {
            sendResponse(response, true, 500, 4001, error)
        })
};


