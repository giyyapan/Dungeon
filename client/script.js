(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EventEmitter, FileUploader,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EventEmitter = Suzaku.EventEmitter;

module.exports = FileUploader = (function(superClass) {
  extend(FileUploader, superClass);

  function FileUploader() {
    return FileUploader.__super__.constructor.apply(this, arguments);
  }

  FileUploader.prototype.upload = function(apiPath, file) {
    var reader, xhr;
    xhr = new XMLHttpRequest();
    console.log(xhr);
    reader = new FileReader();
    xhr.upload.addEventListener("progress", (function(_this) {
      return function(e) {
        var percentage;
        if (e.lengthCompulatable) {
          percentage = Math.round((e.loaded * 100) / e.total);
          console.log("upload " + percentage + "/100%");
          return _this.emit("onProgress", percentage);
        }
      };
    })(this));
    xhr.upload.addEventListener("load", (function(_this) {
      return function(e) {
        console.log("upload complete");
        return _this.emit("complete");
      };
    })(this));
    xhr.open("POST", apiPath);
    console.log(file);
    reader.readAsBinaryString(file);
    reader.onload = (function(_this) {
      return function(e) {
        console.log("reader onload");
        _this.emit("onload");
        console.log(e.target.result.length);
        return xhr.send(btoa(e.target.result));
      };
    })(this);
    return this;
  };

  return FileUploader;

})(EventEmitter);



},{}],2:[function(require,module,exports){
var DungeonClient, EventEmitter, FileUploader;

FileUploader = require('./FileUploader.coffee');

EventEmitter = Suzaku.EventEmitter;

DungeonClient = (function() {
  function DungeonClient() {
    this.fileUploader = new FileUploader;
    console.log("inited");
    window.addEventListener("dragover", (function(_this) {
      return function(e) {
        console.log("over");
        return e.preventDefault();
      };
    })(this));
    window.addEventListener("dragleave", (function(_this) {
      return function(e) {
        console.log("leave");
        return e.preventDefault();
      };
    })(this));
    window.addEventListener("drop", (function(_this) {
      return function(e) {
        var files;
        e.stopPropagation();
        e.preventDefault();
        files = e.dataTransfer.files;
        return _this.handleUploadFiles(files);
      };
    })(this));
  }

  DungeonClient.prototype.handleUploadFiles = function(files) {
    var f, i, j, len, len1, p, totalSize;
    totalSize = 0;
    for (i = 0, len = files.length; i < len; i++) {
      f = files[i];
      totalSize += f.size;
    }
    console.log("total file size is " + (totalSize / 1024 / 1024) + "MB");
    p = Promise.resolve();
    for (j = 0, len1 = files.length; j < len1; j++) {
      f = files[j];
      p = p.then((function(_this) {
        return function() {
          return _this.uploadFile(f);
        };
      })(this));
    }
    return p.then(function(e) {
      return console.log("finished");
    })["catch"](function(e) {
      console.error(e.stack);
      return console.error("upload error");
    });
  };

  DungeonClient.prototype.uploadFile = function(file) {
    return new Promise(function(resolve, reject) {
      console.log("start upload " + file.name);
      return new FileUploader().upload("/upload", file).on("complete", function() {
        return resolve();
      });
    });
  };

  return DungeonClient;

})();

window.onload = function() {
  return new DungeonClient();
};



},{"./FileUploader.coffee":1}]},{},[2])