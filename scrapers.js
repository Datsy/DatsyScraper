var db = require('./db.js');
var http = require('http');

exports.BABS = function() {
  setInterval(function() {
    var jsonReq = http.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        writeNewData(data);
      });
    });
    
    jsonReq.on('error', function (e) {
      console.log(e.message);
    });

    jsonReq.end();
  }, 65000);
};

var options = {
  host: 'bayareabikeshare.com',
  path: '/stations/json',
  method: 'GET',
  contentType: 'application/json'
};

var writeNewData = function(data) {
  data = JSON.parse(data);
  for (var i = 0; i < data.stationBeanList.length; i++) {
    var row = data.stationBeanList[i];
    row.executionTime = data.executionTime;
    var query = "INSERT INTO stationstatuses ("
      + "executiontime," 
      + "stationid,"
      + "stationname,"
      + "availabledocks," 
      + "totaldocks,"
      + "latitude,"
      + "longitude," 
      + "statusvalue," 
      + "statuskey,"
      + "availablebikes," 
      + "staddress1,"
      + "staddress2,"
      + "city,"
      + "postalcode," 
      + "location,"
      + "altitude,"
      + "teststation," 
      + "lastcommunicationtime,"
      + "landmark"
      + ") VALUES (" +
      nullify(row.executionTime, 'timestamp') + "," +
      nullify(row.id) + "," +
      nullify(row.stationName, 'text') + "," +
      nullify(row.availableDocks) + "," +
      nullify(row.totalDocks) + "," +
      nullify(row.latitude) + "," +
      nullify(row.longitude) + "," +
      nullify(row.statusValue, 'text') + "," +
      nullify(row.statusKey) + "," +
      nullify(row.availableBikes) + "," +
      nullify(row.stAddress1, 'text') + "," +
      nullify(row.stAddress2, 'text') + "," +
      nullify(row.city, 'text') + "," +
      nullify(row.postalCode) + "," +
      nullify(row.location, 'text') + "," +
      nullify(row.altitude, 'text') + "," +
      nullify(row.testStation) + "," +
      nullify(row.lastCommunicationTime, 'timestamp') + "," +
      nullify(row.landMark, 'text') +
      ");";
    db.insertNewData(query);
  }
};

var nullify = function(value, type) {
  if (type === 'timestamp') {
    return (value === null || value === '' ? "null" : "'" + value + " PST'");
  } else if (type === 'text') {
    return (value === null || value === '' ? "null" : "'" + value + "'");
  } else { 
    return (value === null || value === '' ? "null" : value);
  }
};
