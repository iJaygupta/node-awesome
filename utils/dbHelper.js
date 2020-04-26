var Q = require('q');
var async = require('async');
const Promise = require('bluebird');
/**
 * A generic function to generate an update sql query based on
 * the object provided
 *
 * @param{string} tablename - Tablename for which the update query has to be
 * generated
 * @param{object} obj - The object from which the fieldname and field values to be
 * fetched
 * @returns {object} - generated sql and an array of  values
 *
 */
function genUpdate(tablename, obj, properties) {

  var names = [];
  var values = [];
  var arr = [];
  if (!properties) {
    for (var prop in obj) {
      var val = obj[prop];
      if (typeof (val) == "function") {
        names.push(prop);
        values.push(prop + "=" + val(obj));
      } else {
        names.push(prop);
        values.push(prop + "=?");
        arr.push(val);
      }
    }
  } else {
    for (var i = 0; i < properties.length; i++) {
      var prop = properties[i];
      if (obj.hasOwnProperty(prop)) {
        var val = obj[prop];
        if (typeof (val) == "function") {
          names.push(prop);
          values.push(prop + "=" + val(obj));
        } else {
          names.push(prop);
          values.push(prop + "=?");
          arr.push(val);
        }
      }
    }
  }

  var sql = "update " + tablename + " set " + values.join(',');
  return {
    sql: sql,
    valueArr: arr
  };

}

/**
 * A generic function to generate an insert sql query based on
 * the object provided
 *
 * @param {string} tablename - Tablename for which the update query has to be
 * generated
 * @param {object} obj - The object from which the fieldname and field values to be
 * @param {array} properties -  properties array which needs to be generated
 * @returns {boolean} - promise with status true or false
 *
 */

function genInsert(tableName, obj, properties) {
  var props = "";

  var names = [];
  var values = [];
  var arr = [];
  if (!properties) {
    for (var prop in obj) {
      var val = obj[prop];
      if (typeof (val) == "function") {
        names.push(prop);
        values.push(val(obj));
      } else {
        names.push(prop);
        values.push("?");
        arr.push(val);
      }
    }
  } else {
    for (var i = 0; i < properties.length; i++) {
      var prop = properties[i];
      if (obj.hasOwnProperty(prop)) {
        var val = obj[prop];
        if (typeof (val) == "function") {
          names.push(prop);
          values.push(val(obj));
        } else {
          names.push(prop);
          values.push("?");
          arr.push(val);
        }


      }
    }
  }
  var sql = "insert into " + tableName + "(" + names.join(',') + ") values(" + values.join(',') + ")";

  return {
    sql: sql,
    valueArr: arr
  };
}

function genInsertOnDupUpdate(tableName, obj, dupField, dupValues) {
  var props = "";

  var names = [];
  var values = [];
  var arr = [];
  for (var prop in obj) {
    names.push(prop);
    values.push("?");
    arr.push(obj[prop]);
  }
  var sql = "insert into " + tableName + "(" + names.join(',') + ") values(" + values.join(',') + ")";
  if (dupField) {
    sql += " ON DUPLICATE KEY UPDATE";
    if (dupValues) {
      for (var prop in dupValues) {
        var val = dupValues[prop];
        if (typeof (val) == "function") {
          var val1 = val(obj);
          sql += " " + prop + " = " + val1 + ",";
        } else {
          sql += " " + prop + " = VALUES(" + prop + "),";
        }
      };

    } else {
      for (var prop in obj) {
        if (prop != dupField) {
          sql += " " + prop + " = VALUES(" + prop + "),";
        }
      }
    }
    sql = sql.substring(0, sql.length - 1);


  }

  return {
    sql: sql,
    valueArr: arr
  };
}
function getSql(connection, sql, params, rowno) {
  var dfd = Q.defer();
  connection.query(sql, params, function (err, res) {
    if (err) {
      console.log(err);
      return dfd.reject(err);
    }
    if (typeof rowno == 'undefined')
      return dfd.resolve(res);

    if (!res.length) {
      console.log("Error: No Rows found", sql, params.join(","));
      return dfd.reject(new Error("No rows found"));
    }

    if (!res[rowno]) {
      console.log("Error: No Row found ", rowno, sql, params.join(","));
      return dfd.reject(new Error("No row found"));
    }
    return dfd.resolve(res[rowno]);
  });
  return dfd.promise;
}
/**
 * A generic function to generate an insert sql query based on
 * the tablename and array provided. It can be used for multiple objects insertion
 *
 * @param {string} tablename - Tablename for which the update query has to be
 * generated
 * @param {array} objArr -  properties array which needs to be generated
 * @returns {string} - sqlString which can be passed to getSql function directly for execution
 * No need of valueArr
 */
function genInsertMulti(tableName, objArr) {
  var keys = Object.keys(objArr[0]);
  var valueArr = [];
  var sql = "INSERT INTO " + tableName + "(" + keys.join(",") + ") VALUES ";
  objArr.forEach(i => {
    var values = Object.values(i);
    valueArr.push(...values);
    var valueStr = values.map(d => `?`).join(',');
    sql += "(" + valueStr + "),";
  });
  sql = sql.substring(0, sql.length - 1);
  return {
    sql: sql,
    valueArr: valueArr
  };
}
function genInsertBigData(tableName, objArr) {
  var returnObj = {
    sql: [],
    valueArr: [],
    rowCountOfEachQuery: []
  };
  while (objArr.length) {
    const slicedArray = objArr.splice(0, 999);
    let result = genInsertMulti(tableName, slicedArray);
    returnObj.sql.push(result.sql);
    returnObj.valueArr.push(result.valueArr);
    returnObj.rowCountOfEachQuery.push(slicedArray.length);
  }
  return returnObj;
}
/**
 * A generic function to do transaction of multiple query with commit and rollback
 *
 * @param {Array} queries - The queries we need to do in tranaction
 * @param {Array} queryValues -  Array of values to be insterted in place of '?' in querry strings.
 * @param {obj} connection - transaction connection obtained after promise is resolved.
 */
function transaction(queries, queryValues, connection) {
  Promise.promisifyAll(connection);
  return connection.beginTransactionAsync()
    .then(() => {
      const queryPromises = [];

      queries.forEach((query, index) => {
        queryPromises.push(connection.queryAsync(query, queryValues[index]));
      });
      return Promise.all(queryPromises);
    })
    .then(results => {
      return connection.commitAsync()
        .then(connection.endAsync())
        .then(() => {
          return results;
        });
    })
    .catch(err => {
      return connection.rollbackAsync()
        .then(connection.endAsync())
        .then(() => {
          return Promise.reject(err);
        });
    });
}
function insertBigData(conn, tableName, arr) {
  var sql = genInsertBigData(tableName, arr);
  return new Promise((resolve, reject) => {
    let index = 0;
    async.mapSeries(sql.sql, (query, callback) => {
      getSql(conn, query, sql.valueArr[index]).then((r) => {
        index++;
        callback(null, r);
      }).catch((e) => {
        callback(e, null)
      });
    }, (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res);
    })
  });
}

module.exports = {
  genInsert: genInsert,
  genInsertOnDupUpdate: genInsertOnDupUpdate,
  genUpdate: genUpdate,
  getSql: getSql,
  genInsertMulti: genInsertMulti,
  transaction: transaction,
  genInsertBigData: genInsertBigData,
  insertBigData: insertBigData
}
