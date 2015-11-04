/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************************!*\
  !*** ./client/src/client.cjsx ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var DungeonClient, FileUploader, MainContainer, TestComponent,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ./styles/global.less */ 1);
	
	FileUploader = __webpack_require__(/*! ./FileUploader */ 5);
	
	TestComponent = __webpack_require__(/*! ./TestComponent */ 6);
	
	MainContainer = (function(superClass) {
	  extend(MainContainer, superClass);
	
	  function MainContainer() {
	    console.log("run container constructor");
	  }
	
	  MainContainer.prototype.render = function() {
	    return React.createElement("div", null, React.createElement(TestComponent, {
	      "text": "111",
	      "text2": "222",
	      "obj": {
	        key: "val"
	      }
	    }));
	  };
	
	  return MainContainer;
	
	})(React.Component);
	
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
	    this.listFiles();
	    ReactDOM.render(React.createElement(MainContainer, null), $("#main-container")[0]);
	  }
	
	  DungeonClient.prototype.listFiles = function(dir) {
	    if (dir == null) {
	      dir = "";
	    }
	    return $.get("/list/" + dir, function(data) {
	      return console.log("got list data", data);
	    }).fail(function(e) {
	      return console.log("error", e);
	    });
	  };
	
	  DungeonClient.prototype.handleUploadFiles = function(files) {
	    var f, i, len, p, totalSize;
	    totalSize = 0;
	    for (i = 0, len = files.length; i < len; i++) {
	      f = files[i];
	      totalSize += f.size;
	    }
	    console.log("total file size is " + (totalSize / 1024 / 1024) + "MB");
	    p = Promise.resolve();
	    Array.prototype.forEach.call(files, (function(_this) {
	      return function(f) {
	        return p = p.then(function() {
	          return _this.uploadFile(f);
	        });
	      };
	    })(this));
	    return p.then(function(e) {
	      return console.log("finished");
	    })["catch"](function(e) {
	      console.error(e.stack);
	      return console.error("upload error");
	    });
	  };
	
	  DungeonClient.prototype.uploadFile = function(file) {
	    return new Promise(function(resolve, reject) {
	      var uploader;
	      console.log("start upload " + file.name);
	      uploader = new FileUploader();
	      uploader.on("complete", function() {
	        return resolve();
	      });
	      return uploader.upload(file);
	    });
	  };
	
	  return DungeonClient;
	
	})();
	
	new DungeonClient();


/***/ },
/* 1 */
/*!***************************************!*\
  !*** ./client/src/styles/global.less ***!
  \***************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/*!****************************************!*\
  !*** ./client/src/FileUploader.coffee ***!
  \****************************************/
/***/ function(module, exports) {

	var EventEmitter, FileUploader, size,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	EventEmitter = Suzaku.EventEmitter;
	
	size = {
	  kb: 1024,
	  mb: 1024 * 1024
	};
	
	module.exports = FileUploader = (function(superClass) {
	  extend(FileUploader, superClass);
	
	  function FileUploader() {
	    this.uploadApi = "/upload";
	    this.checkApi = "/check";
	    this.sliceSize = 3 * size.mb;
	    this.maxThreads = 2;
	    this.file = null;
	    this.availThreads = 0;
	    this.sliceCount = 0;
	    this.apiPath = null;
	    this.currentSlice = 0;
	  }
	
	  FileUploader.prototype.setUploadApi = function(uploadApi) {
	    this.uploadApi = uploadApi;
	  };
	
	  FileUploader.prototype.setCheckApi = function(checkApi) {
	    this.checkApi = checkApi;
	  };
	
	  FileUploader.prototype.upload = function(file) {
	    var xhr;
	    this.file = file;
	    xhr = new XMLHttpRequest();
	    xhr.open("GET", this.checkApi + "?filename=" + this.file.name + "&size=" + this.file.size);
	    xhr.send();
	    xhr.onload = (function(_this) {
	      return function() {
	        return _this.doUpload();
	      };
	    })(this);
	    return xhr.onerror = (function(_this) {
	      return function(e) {
	        console.error(e);
	        return _this.emit("error", e);
	      };
	    })(this);
	  };
	
	  FileUploader.prototype.doUpload = function() {
	    this.sliceCount = Math.ceil(this.file.size / this.sliceSize);
	    this.availThreads = this.maxThreads;
	    console.log("sliceCount is " + this.sliceCount);
	    this.currentSlice = 0;
	    console.log("got file " + this.file.name + " total size " + this.file.size);
	    console.log("uploading using sliceSize " + this.sliceSize + " and " + this.maxThreads + " threads");
	    this.on("sliceProgress", (function(_this) {
	      return function(slice, percentage) {
	        return _this.emit("progress");
	      };
	    })(this));
	    this.on("sliceComplete", (function(_this) {
	      return function(slice) {
	        _this.availThreads += 1;
	        if (slice < (_this.sliceCount - 1)) {
	          return _this.uploadNextSlice();
	        } else if (_this.availThreads === _this.maxThreads) {
	          return _this.emit("complete");
	        }
	      };
	    })(this));
	    return this.uploadNextSlice();
	  };
	
	  FileUploader.prototype.uploadNextSlice = function() {
	    if (!(this.availThreads > 0)) {
	      return;
	    }
	    this.availThreads -= 1;
	    this.uploadSlice(this.currentSlice);
	    this.currentSlice += 1;
	    return this.uploadNextSlice();
	  };
	
	  FileUploader.prototype.uploadSlice = function(slice) {
	    var bolb, name, reader, start, stop, url, xhr;
	    if (!(slice < this.sliceCount)) {
	      return;
	    }
	    name = this.file.name;
	    start = slice * this.sliceSize;
	    stop = (slice + 1) * this.sliceSize - 1;
	    if (stop > (this.file.size - 1)) {
	      stop = this.file.size - 1;
	    }
	    bolb = this.file.slice(start, stop + 1);
	    reader = new FileReader();
	    reader.readAsBinaryString(bolb);
	    reader.onloadend = (function(_this) {
	      return function(e) {
	        if (reader.readyState === FileReader.DONE) {
	          _this.emit("onload");
	          _this.sendAsBinary(xhr, reader.result);
	          return reader = null;
	        }
	      };
	    })(this);
	    xhr = new XMLHttpRequest();
	    xhr.upload.onprogress = (function(_this) {
	      return function(evt) {
	        var percentage;
	        if (evt.lengthComputable) {
	          percentage = Math.round((evt.loaded * 100) / evt.total);
	          return _this.emit("sliceProgress", slice, percentage);
	        }
	      };
	    })(this);
	    xhr.upload.onload = (function(_this) {
	      return function(e) {
	        return _this.emit("sliceComplete", slice);
	      };
	    })(this);
	    xhr.upload.onerror = (function(_this) {
	      return function(error) {
	        return _this.emit("error", error);
	      };
	    })(this);
	    url = this.uploadApi + ("?start=" + start + "&stop=" + stop + "&filename=" + name);
	    return xhr.open("POST", url);
	  };
	
	  FileUploader.prototype.sendAsBinary = function(xhr, data) {
	    var i, j, parts, ref;
	    this.xhr = new XMLHttpRequest();
	    parts = new Uint8Array(data.length);
	    for (i = j = 0, ref = data.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
	      parts[i] = data[i].charCodeAt(0);
	    }
	    return xhr.send(parts.buffer);
	  };
	
	  FileUploader.prototype.showResult = function(res, label) {
	    var aByte, byteStr, j, markup, n, ref;
	    markup = [];
	    for (n = j = 0, ref = res.length - 1; 0 <= ref ? j <= ref : j >= ref; n = 0 <= ref ? ++j : --j) {
	      aByte = res.charCodeAt(n);
	      byteStr = aByte.toString(16);
	      if (byteStr.length < 2) {
	        byteStr = "0" + byteStr;
	      }
	      markup.push(byteStr);
	    }
	    return console.log(markup.join(" "));
	  };
	
	  return FileUploader;
	
	})(EventEmitter);


/***/ },
/* 6 */
/*!***************************************!*\
  !*** ./client/src/TestComponent.cjsx ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var TestComponent,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ./styles/testComponent.less */ 7);
	
	module.exports = TestComponent = (function(superClass) {
	  extend(TestComponent, superClass);
	
	  function TestComponent() {
	    this.state = {
	      text: "!!!!"
	    };
	  }
	
	  TestComponent.prototype.render = function() {
	    var n;
	    return React.createElement("div", {
	      "className": "test-component"
	    }, "Test Component", React.createElement("p", null, "props:", JSON.stringify(this.props)), React.createElement("p", null, "state:", JSON.stringify(this.state)), (function() {
	      var i, results;
	      results = [];
	      for (n = i = 1; i <= 5; n = ++i) {
	        results.push(React.createElement("p", {
	          "key": n
	        }, "This line has been printed ", n, " times"));
	      }
	      return results;
	    })());
	  };
	
	  return TestComponent;
	
	})(React.Component);


/***/ },
/* 7 */
/*!**********************************************!*\
  !*** ./client/src/styles/testComponent.less ***!
  \**********************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map