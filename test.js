+function() {
  "use strict";

  var mock = require("mock-data")
  ,   util = require("util");

  var SyncStream = require("./")
  ,   rInt       = mock.generate({type: "integer", count: 5})
  ,   rDate      = mock.generate({type: "date", count: 10})
  ,   rIpv4      = mock.generate({type: "ipv4", count: 10});

  var syncStream = new SyncStream([rInt, rDate, rIpv4]);

  // syncStream.add(rInt).add(rDate).add(rIpv4);

  var Writable = require("stream").Writable;

  function WriteStream(options) {
    options = options || {};
    options.objectMode = true;

    Writable.call(this, options);
  };
  util.inherits(WriteStream, Writable);

  WriteStream.prototype._write = function(chunk, encoding, __callback) {
    console.log("#", chunk.join(","));
    __callback();
  };



  var writeStream = new WriteStream();

  syncStream.pipe(writeStream);

}();
