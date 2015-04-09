+ function() {
  "use strict";

  var stream = require("stream")
  ,   util   = require("util");

  var PassThrough = stream.PassThrough || require("readable-stream").PassThrough;
  util.inherits(SyncStream, PassThrough);

  function SyncStream(options, arr) {
    if (Array.isArray(options)) {
      arr = options;
      options = null;
    }

    options = options || {};
    options.objectMode = options.objectMode === false ? false : true;

    PassThrough.call(this, options);

    this.highWaterMark = 5;

    this._streams    = [];
    this._streamEnd  = [];
    this._dataQueues = [];

    if (Array.isArray(arr)) {
      for (var i = 0; i < arr.length; i ++) {
        this.add(arr[i]);
      }
    }
  }

  SyncStream.prototype._rowReady = function() {
    for (var i = 0; i < this._dataQueues.length; i ++) {
      if (!this._streamEnd[i] && this._dataQueues[i].length === 0) {
        return false;
      }
    }
    return true;
  };

  SyncStream.prototype._genRow = function() {
    var row = [];
    for (var i = 0, empty = true; i < this._dataQueues.length; i ++) {
      if (this._streamEnd[i]) {
        row.push('');
      } else {
        empty = false;
        row.push(this._dataQueues[i].shift());

        if (!this._streamEnd[i]) {
          this._streams[i].resume();
        }
      }
    }
    return empty ? null : row;
  };

  SyncStream.prototype.add = function(stream) {
    var index = this._streams.length;
    this._dataQueues[index] = [];
    this._streamEnd[index]  = false;
    this._streams.push(stream);

    stream.on("data", this.onData.bind(this, index));
    stream.on("error", this.onError.bind(this));
    stream.on("end", this.onEnd.bind(this, index));

    return this;
  };

  SyncStream.prototype.flush = function() {
    if (this._rowReady()) {
      var row = this._genRow();
      this.push(row);
    }
  };

  SyncStream.prototype.onError = function(error) {
    // this.emit("error", error);
  };

  SyncStream.prototype.onData = function(index, data) {
    // console.log(index);

    this._dataQueues[index].push(data);
    this._streams[index].pause();

    this.flush();
  };

  SyncStream.prototype.onEnd = function(index) {
    // console.log("end", index);
    this._streamEnd[index] = true;

    this.flush();
  };


  module.exports = SyncStream;

}();
