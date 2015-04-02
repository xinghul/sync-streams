+function() {
  "use strict";

  var mock = require("mock-data");

  var syncStream = require("./")
  ,   rInt       = mock.generate({type: "integer", count: 5})
  ,   rDate      = mock.generate({type: "date", count: 10})
  ,   rIpv4      = mock.generate({type: "ipv4", count: 10});

  syncStream.add(rInt).add(rDate).add(rIpv4);

  syncStream.on("data", function (row) {
    console.log(row);
  });

  syncStream.on("end", function() {
    // console.log("all end");
  });

  syncStream.on("error", function(error) {
    console.log(error);
  });


}();
