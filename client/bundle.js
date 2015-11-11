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

	var DungeonClient, FileUploadManager, FilesPanel,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ./styles/global.less */ 1);
	
	FilesPanel = __webpack_require__(/*! ./components/FilesPanel */ 5);
	
	FileUploadManager = __webpack_require__(/*! ./FileUploadManager */ 18);
	
	DungeonClient = (function(superClass) {
	  extend(DungeonClient, superClass);
	
	  function DungeonClient() {
	    var _lastPercentage;
	    DungeonClient.__super__.constructor.apply(this, arguments);
	    this.uploadManager = new FileUploadManager(this);
	    window.addEventListener("dragover", (function(_this) {
	      return function(evt) {
	        console.log("over");
	        return evt.preventDefault();
	      };
	    })(this));
	    window.addEventListener("dragleave", (function(_this) {
	      return function(evt) {
	        console.log("leave");
	        return evt.preventDefault();
	      };
	    })(this));
	    window.addEventListener("drop", (function(_this) {
	      return function(evt) {
	        var currentDir, dt;
	        evt.stopPropagation();
	        evt.preventDefault();
	        currentDir = _this.filesPanel.state.currentDir;
	        dt = evt.dataTransfer;
	        console.log(dt.items);
	        if (dt.getData('text/html')) {
	          _this.uploadManager.handleDragHtml(currentDir, dt.getData('text/html'));
	          return _this.emit("uploading");
	        } else if (dt.items.length > 0) {
	          console.log("length::", dt.items.length);
	          _this.uploadManager.handleDragFiles(currentDir, dt.items);
	          return _this.emit("uploading");
	        } else {
	          return console.log("drop event unhandled");
	        }
	      };
	    })(this));
	    this.uploadManager.on("fileUploaded", (function(_this) {
	      return function() {
	        return _this.filesPanel.listDir(false);
	      };
	    })(this));
	    this.uploadManager.on("allFileUploaded", (function(_this) {
	      return function() {
	        return setTimeout(function() {
	          return _this.filesPanel.showMessage("uploadComplete", null, 3000);
	        }, 1);
	      };
	    })(this));
	    _lastPercentage = 0;
	    this.uploadManager.on("sliceComplete", (function(_this) {
	      return function(filename, completedSlices, sliceCount, completeFileCount, fileCount) {
	        var now, percentage;
	        now = Date.now();
	        percentage = Math.round((completedSlices / sliceCount) * 100);
	        if (percentage !== _lastPercentage) {
	          _lastPercentage = percentage;
	          return _this.filesPanel.showMessage("uploading", {
	            filename: filename,
	            percentage: percentage,
	            completeFileCount: completeFileCount,
	            fileCount: fileCount
	          });
	        }
	      };
	    })(this));
	    this.uploadManager.on("uploadError", (function(_this) {
	      return function(e) {
	        return _this.filesPanel.showMessage("uploadError");
	      };
	    })(this));
	    this.filesPanel = ReactDOM.render(React.createElement(FilesPanel, {
	      "client": this
	    }), $("#main-container")[0]);
	    console.log("inited Dungeon client");
	  }
	
	  return DungeonClient;
	
	})(Suzaku.EventEmitter);
	
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
/*!***********************************************!*\
  !*** ./client/src/components/FilesPanel.cjsx ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var ContextMenu, DetailPanel, DirItem, FileItem, FilesPanel, ImageItem, MessageHolder, utils,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
	DirItem = __webpack_require__(/*! ./DirItem */ 8);
	
	FileItem = __webpack_require__(/*! ./FileItem */ 9);
	
	ImageItem = __webpack_require__(/*! ./ImageItem */ 11);
	
	DetailPanel = __webpack_require__(/*! ./DetailPanel */ 12);
	
	ContextMenu = __webpack_require__(/*! ./ContextMenu */ 15);
	
	MessageHolder = __webpack_require__(/*! ./MessageHolder */ 21);
	
	utils = __webpack_require__(/*! ../clientUtils */ 20);
	
	module.exports = FilesPanel = (function(superClass) {
	  extend(FilesPanel, superClass);
	
	  FilesPanel.FileTypes = {
	    dir: "directory",
	    image: "image",
	    video: "video",
	    compressed: "compressed",
	    others: "others"
	  };
	
	  function FilesPanel() {
	    FilesPanel.__super__.constructor.apply(this, arguments);
	    this.state = {
	      currentDir: "/",
	      items: [],
	      error: false,
	      dirStack: [],
	      message: 'loading'
	    };
	    this.props.client.on("uploading", (function(_this) {
	      return function() {
	        return _this.setState({
	          message: "uploading"
	        });
	      };
	    })(this));
	  }
	
	  FilesPanel.prototype.listDir = function(showMessage) {
	    if (showMessage == null) {
	      showMessage = true;
	    }
	    if (this._isLoading) {
	      return;
	    }
	    this._isLoading = true;
	    return $.get("/listDir" + this.state.currentDir, (function(_this) {
	      return function(data) {
	        var message;
	        console.log("got list data", data);
	        data.items.sort(function(a, b) {
	          return (b.isDirectory - a.isDirectory) || (a.name.charCodeAt(0) - b.name.charCodeAt(0));
	        });
	        if (data.items.length === 0) {
	          message = 'empty';
	        } else {
	          message = null;
	        }
	        _this._isLoading = false;
	        if (showMessage) {
	          _this.setState({
	            items: data.items,
	            message: message
	          });
	          return setTimeout(function() {
	            return _this.setState({
	              message: null
	            });
	          }, 3000);
	        } else {
	          return _this.setState({
	            items: data.items
	          });
	        }
	      };
	    })(this)).fail((function(_this) {
	      return function(e) {
	        _this._isLoading = false;
	        console.log("error", e);
	        if (showMessage) {
	          return _this.setState({
	            error: true,
	            message: 'error'
	          });
	        }
	      };
	    })(this));
	  };
	
	  FilesPanel.prototype.enterDir = function(arg) {
	    var dirStack, newDir;
	    newDir = arg.newDir;
	    dirStack = this.state.dirStack.map(function(d) {
	      return d;
	    });
	    dirStack.push(this.state.currentDir);
	    return this.changeDir(newDir, dirStack);
	  };
	
	  FilesPanel.prototype.changeDir = function(dir, dirStack) {
	    var showMessage, state;
	    state = {
	      currentDir: dir
	    };
	    showMessage = this.state.message ? false : true;
	    if (showMessage) {
	      state.message = 'loading';
	    }
	    if (dirStack) {
	      state.dirStack = dirStack;
	    }
	    return this.setState(state, (function(_this) {
	      return function() {
	        return _this.listDir(showMessage);
	      };
	    })(this));
	  };
	
	  FilesPanel.prototype.goBack = function() {
	    var dir, dirStack;
	    dirStack = this.state.dirStack.map(function(d) {
	      return d;
	    });
	    if (dirStack.length === 0) {
	      return;
	    }
	    dir = dirStack.pop();
	    return this.changeDir(dir, dirStack);
	  };
	
	  FilesPanel.prototype.refresh = function() {
	    this.setState({
	      message: "loading"
	    });
	    return this.listDir();
	  };
	
	  FilesPanel.prototype.componentDidMount = function() {
	    return this.listDir();
	  };
	
	  FilesPanel.prototype.showMessage = function(msg, data, timeout) {
	    var msgId;
	    msgId = utils.getTimeBasedId();
	    this.setState({
	      message: msg,
	      messageData: data,
	      messageId: msgId
	    });
	    if (timeout) {
	      return setTimeout((function(_this) {
	        return function() {
	          if (_this.state.messageId === msgId) {
	            return _this.setState({
	              message: null
	            });
	          }
	        };
	      })(this), timeout);
	    }
	  };
	
	  FilesPanel.prototype._showItemDetail = function(arg) {
	    var itemData, itemType;
	    itemType = arg.itemType, itemData = arg.itemData;
	    return this.refs.detailPanel.showDetail(itemType, itemData);
	  };
	
	  FilesPanel.prototype.createNewFolder = function() {
	    var name;
	    name = window.prompt("请输入名称：");
	    if (name.indexOf("/") > -1) {
	      return alert("文件名不能含有'/'");
	    }
	    if (!name) {
	      return;
	    }
	    return $.get("/newFolder" + this.state.currentDir + "/" + name).done((function(_this) {
	      return function(res) {
	        return _this.listDir();
	      };
	    })(this)).fail(function(e) {
	      return console.error(e);
	    });
	  };
	
	  FilesPanel.prototype.handleMenuItemClick = function(arg) {
	    var action, itemData, key;
	    key = arg.key, itemData = arg.itemData;
	    action = key;
	    if (itemData) {
	      return this.refs[itemData.relativePath].doFileAction(action);
	    } else {
	      switch (action) {
	        case 'newFolder':
	          return this.createNewFolder();
	        case 'refresh':
	          return this.refresh();
	      }
	    }
	  };
	
	  FilesPanel.prototype.handleContextMenu = function(evt) {
	    console.log("contextMenu");
	    evt.stopPropagation();
	    evt.preventDefault();
	    return this.refs.contextMenu.show({
	      menuItems: ['newFolder', 'refresh'],
	      itemData: null,
	      position: {
	        x: evt.pageX,
	        y: evt.pageY - window.scrollY
	      }
	    });
	  };
	
	  FilesPanel.prototype.handleItemEvent = function(event, data) {
	    if (data.itemData) {
	      data.itemType = this.getItemType(data.itemData);
	    }
	    switch (event) {
	      case 'enterDir':
	        return this.enterDir(data);
	      case 'showDetail':
	        return this._showItemDetail(data);
	      case 'showContextMenu':
	        return this.refs.contextMenu.show(data);
	      case 'update':
	        return this.refresh();
	      default:
	        return console.error("unsupported event type!", event);
	    }
	  };
	
	  FilesPanel.prototype.getItemType = function(itemData) {
	    var extName, ft;
	    ft = FilesPanel.FileTypes;
	    if (itemData.isDirectory) {
	      return ft.dir;
	    }
	    extName = itemData.name.split(".").pop();
	    switch (extName) {
	      case "jpg":
	      case "jpeg":
	      case "png":
	        return ft.image;
	      default:
	        return ft.others;
	    }
	  };
	
	  FilesPanel.prototype.render = function() {
	    var ft, item;
	    return React.createElement("section", {
	      "className": "files-panel"
	    }, React.createElement(DetailPanel, {
	      "ref": "detailPanel"
	    }), React.createElement(ContextMenu, {
	      "ref": "contextMenu",
	      "onItemClick": this.handleMenuItemClick.bind(this)
	    }), React.createElement("header", {
	      "className": "main-header"
	    }, React.createElement("button", {
	      "onClick": this.refresh.bind(this)
	    }, "刷新"), React.createElement("button", {
	      "onClick": this.goBack.bind(this)
	    }, "后退"), React.createElement("span", {
	      "className": "current-path"
	    }, this.state.currentDir)), React.createElement("div", {
	      "className": "files-holder",
	      "onContextMenu": this.handleContextMenu.bind(this)
	    }, React.createElement(MessageHolder, {
	      "message": this.state.message,
	      "messageData": this.state.messageData
	    }), ((function() {
	      var i, len, ref, results;
	      ft = FilesPanel.FileTypes;
	      ref = this.state.items;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        item = ref[i];
	        switch (this.getItemType(item)) {
	          case ft.dir:
	            results.push(React.createElement(DirItem, {
	              "key": item.relativePath,
	              "ref": item.relativePath,
	              "data": item,
	              "onEvent": this.handleItemEvent.bind(this)
	            }));
	            break;
	          case ft.image:
	            results.push(React.createElement(ImageItem, {
	              "key": item.relativePath,
	              "ref": item.relativePath,
	              "data": item,
	              "onEvent": this.handleItemEvent.bind(this)
	            }));
	            break;
	          default:
	            results.push(React.createElement(FileItem, {
	              "key": item.relativePath,
	              "ref": item.relativePath,
	              "data": item,
	              "onEvent": this.handleItemEvent.bind(this)
	            }));
	        }
	      }
	      return results;
	    }).call(this)), React.createElement("div", {
	      "className": "clearfix"
	    })));
	  };
	
	  return FilesPanel;
	
	})(React.Component);


/***/ },
/* 6 */
/*!*******************************************!*\
  !*** ./client/src/styles/filesPanel.less ***!
  \*******************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 7 */,
/* 8 */
/*!********************************************!*\
  !*** ./client/src/components/DirItem.cjsx ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var DirItem, FileItem, FileNameItem,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
	FileItem = __webpack_require__(/*! ./FileItem */ 9);
	
	FileNameItem = __webpack_require__(/*! ./FileNameItem */ 10);
	
	module.exports = DirItem = (function(superClass) {
	  extend(DirItem, superClass);
	
	  function DirItem() {
	    return DirItem.__super__.constructor.apply(this, arguments);
	  }
	
	  DirItem.prototype.handleClick = function(e) {
	    return this.props.onEvent("enterDir", {
	      newDir: this.props.data.relativePath
	    });
	  };
	
	  DirItem.prototype.render = function() {
	    return React.createElement("div", {
	      "className": "file-panel-item dir-item",
	      "onClick": this.handleClick.bind(this),
	      "onContextMenu": this.handleContextMenu.bind(this)
	    }, React.createElement("div", {
	      "className": "icon"
	    }, React.createElement("span", {
	      "className": "preview"
	    })), React.createElement(FileNameItem, {
	      "ref": "fileName",
	      "name": this.props.data.name,
	      "onChange": this.handleRename.bind(this)
	    }));
	  };
	
	  return DirItem;
	
	})(FileItem);


/***/ },
/* 9 */
/*!*********************************************!*\
  !*** ./client/src/components/FileItem.cjsx ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var FileItem, FileNameItem,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
	FileNameItem = __webpack_require__(/*! ./FileNameItem */ 10);
	
	module.exports = FileItem = (function(superClass) {
	  extend(FileItem, superClass);
	
	  function FileItem() {
	    return FileItem.__super__.constructor.apply(this, arguments);
	  }
	
	  FileItem.prototype.contextMenuItems = ['download', 'saveAs', 'rename', 'delete'];
	
	  FileItem.prototype.doFileAction = function(action) {
	    var msg, url;
	    switch (action) {
	      case 'download':
	        return console.log("download");
	      case 'saveAs':
	        return console.log("saveAs");
	      case 'rename':
	        return this.refs.fileName.edit();
	      case 'delete':
	        console.log("delete");
	        if (this.props.data.isDirectory) {
	          msg = "确定要删除文件夹 " + this.props.data.name + " 及其所有文件吗？";
	        } else {
	          msg = "确定要删除文件 " + this.props.data.name + " 吗？";
	        }
	        if (!window.confirm(msg)) {
	          return;
	        }
	        url = "/delete" + this.props.data.relativePath;
	        return this._callApi("get", url, this.props.onEvent.bind(null, 'update'));
	      default:
	        return console.error("unsupported action type:", action);
	    }
	  };
	
	  FileItem.prototype._callApi = function(method, url, callback) {
	    if (method == null) {
	      method = "get";
	    }
	    method = method.toUpperCase();
	    return $.ajax({
	      method: method,
	      url: url
	    }).done(function(res) {
	      return callback(res);
	    }).fail(function(e) {
	      return console.error(e);
	    });
	  };
	
	  FileItem.prototype.handleClick = function(evt) {
	    return this.props.onEvent("showDetail", {
	      itemData: this.props.data
	    });
	  };
	
	  FileItem.prototype.handleRename = function(arg) {
	    var newName, url;
	    newName = arg.newName;
	    url = "/rename" + this.props.data.relativePath + "?to=" + newName;
	    return this._callApi('get', url, (function(_this) {
	      return function() {
	        return _this.props.onEvent("update", {
	          itemData: _this.props.data
	        });
	      };
	    })(this));
	  };
	
	  FileItem.prototype.handleContextMenu = function(evt) {
	    evt.preventDefault();
	    evt.stopPropagation();
	    return this.props.onEvent("showContextMenu", {
	      menuItems: this.contextMenuItems,
	      itemData: this.props.data,
	      position: {
	        x: evt.pageX,
	        y: evt.pageY - window.scrollY
	      }
	    });
	  };
	
	  FileItem.prototype.render = function() {
	    return React.createElement("div", {
	      "className": "file-panel-item file-item",
	      "onClick": this.handleClick.bind(this),
	      "onContextMenu": this.handleContextMenu.bind(this)
	    }, React.createElement("div", {
	      "className": "icon"
	    }, React.createElement("div", {
	      "className": "preview"
	    }, "File:")), React.createElement(FileNameItem, {
	      "ref": "fileName",
	      "name": this.props.data.name,
	      "onChange": this.handleRename.bind(this)
	    }));
	  };
	
	  return FileItem;
	
	})(React.Component);


/***/ },
/* 10 */
/*!*************************************************!*\
  !*** ./client/src/components/FileNameItem.cjsx ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var FileNameItem,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
	module.exports = FileNameItem = (function(superClass) {
	  extend(FileNameItem, superClass);
	
	  function FileNameItem() {
	    FileNameItem.__super__.constructor.apply(this, arguments);
	    this.state = {
	      editing: false
	    };
	  }
	
	  FileNameItem.prototype.edit = function() {
	    return this.setState({
	      editing: true
	    }, (function(_this) {
	      return function() {
	        _this.refs.input.focus();
	        return _this.refs.input.select();
	      };
	    })(this));
	  };
	
	  FileNameItem.prototype.handleKeyDown = function(evt) {
	    switch (evt.keyCode) {
	      case Suzaku.Key.enter:
	        console.log(evt.target.value);
	        this.props.onChange({
	          newName: evt.target.value
	        });
	        return this.setState({
	          editing: false
	        });
	    }
	  };
	
	  FileNameItem.prototype.handleClick = function(evt) {
	    return evt.stopPropagation();
	  };
	
	  FileNameItem.prototype.handleBlur = function(evt) {
	    return this.setState({
	      editing: false
	    });
	  };
	
	  FileNameItem.prototype.render = function() {
	    if (this.state.editing) {
	      return React.createElement("input", {
	        "ref": "input",
	        "className": "file-name-input",
	        "type": "text",
	        "onClick": this.handleClick.bind(this),
	        "onKeyDown": this.handleKeyDown.bind(this),
	        "onBlur": this.handleBlur.bind(this),
	        "defaultValue": this.props.name
	      });
	    } else {
	      return React.createElement("p", {
	        "className": "name"
	      }, this.props.name);
	    }
	  };
	
	  return FileNameItem;
	
	})(React.Component);


/***/ },
/* 11 */
/*!**********************************************!*\
  !*** ./client/src/components/ImageItem.cjsx ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var FileItem, FileNameItem, ImageItem,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
	FileItem = __webpack_require__(/*! ./FileItem */ 9);
	
	FileNameItem = __webpack_require__(/*! ./FileNameItem */ 10);
	
	module.exports = ImageItem = (function(superClass) {
	  extend(ImageItem, superClass);
	
	  function ImageItem() {
	    return ImageItem.__super__.constructor.apply(this, arguments);
	  }
	
	  ImageItem.prototype.render = function() {
	    var src;
	    src = "/imgPreview" + this.props.data.relativePath;
	    return React.createElement("div", {
	      "className": "file-panel-item image-item",
	      "onClick": this.handleClick.bind(this),
	      "onContextMenu": this.handleContextMenu.bind(this)
	    }, React.createElement("div", {
	      "className": "icon"
	    }, React.createElement("img", {
	      "src": src,
	      "className": "preview"
	    })), React.createElement(FileNameItem, {
	      "ref": "fileName",
	      "name": this.props.data.name,
	      "onChange": this.handleRename.bind(this)
	    }));
	  };
	
	  return ImageItem;
	
	})(FileItem);


/***/ },
/* 12 */
/*!************************************************!*\
  !*** ./client/src/components/DetailPanel.cjsx ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var DetailPanel,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/detailPanel.less */ 13);
	
	module.exports = DetailPanel = (function(superClass) {
	  extend(DetailPanel, superClass);
	
	  function DetailPanel() {
	    DetailPanel.__super__.constructor.apply(this, arguments);
	    this.state = {
	      itemData: null
	    };
	  }
	
	  DetailPanel.prototype.showDetail = function(type, itemData) {
	    console.log("showDetail", type, itemData);
	    return this.setState({
	      itemType: type,
	      itemData: itemData
	    });
	  };
	
	  DetailPanel.prototype.handleInnerClick = function(evt) {
	    evt.stopPropagation();
	    return evt.preventDefault();
	  };
	
	  DetailPanel.prototype.dissmiss = function(evt) {
	    return this.setState({
	      itemData: null
	    });
	  };
	
	  DetailPanel.prototype.render = function() {
	    var ft, itemData, src;
	    itemData = this.state.itemData;
	    if (!itemData) {
	      return React.createElement("section", {
	        "className": "hidden"
	      });
	    }
	    return React.createElement("section", {
	      "className": "detail-panel popup-layer",
	      "onClick": this.dissmiss.bind(this)
	    }, React.createElement("button", {
	      "className": "close-btn",
	      "onClick": this.dissmiss.bind(this)
	    }, "×"), ((function() {
	      ft = __webpack_require__(/*! ./FilesPanel */ 5).FileTypes;
	      switch (this.state.itemType) {
	        case ft.image:
	          src = "/viewImage" + itemData.relativePath;
	          return React.createElement("img", {
	            "className": "content",
	            "src": src,
	            "onClick": this.handleInnerClick.bind(this)
	          });
	        case ft.others:
	          return React.createElement("div", {
	            "className": "content",
	            "onClick": this.handleInnerClick.bind(this)
	          }, React.createElement("p", null, "no preview for this file"));
	      }
	    }).call(this)), React.createElement("span", {
	      "className": "name"
	    }, this.state.itemData.name));
	  };
	
	  return DetailPanel;
	
	})(React.Component);


/***/ },
/* 13 */
/*!********************************************!*\
  !*** ./client/src/styles/detailPanel.less ***!
  \********************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 14 */,
/* 15 */
/*!************************************************!*\
  !*** ./client/src/components/ContextMenu.cjsx ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ContextMenu,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/menus.less */ 16);
	
	module.exports = ContextMenu = (function(superClass) {
	  extend(ContextMenu, superClass);
	
	  ContextMenu.NameDict = {
	    'rename': '重命名',
	    'download': '下载',
	    'saveAs': '另存为',
	    'delete': '删除',
	    'newFolder': '新建文件夹',
	    'refresh': '刷新'
	  };
	
	  function ContextMenu() {
	    ContextMenu.__super__.constructor.apply(this, arguments);
	    this.state = {};
	  }
	
	  ContextMenu.prototype.show = function(arg) {
	    var itemData, menuItems, position;
	    menuItems = arg.menuItems, itemData = arg.itemData, position = arg.position;
	    return this.setState({
	      items: menuItems,
	      itemData: itemData,
	      position: position
	    });
	  };
	
	  ContextMenu.prototype.handleListItemClick = function(key, evt) {
	    evt.stopPropagation();
	    console.log("menu item clicked:", key);
	    this.props.onItemClick({
	      itemData: this.state.itemData,
	      key: key
	    });
	    return this.dismiss();
	  };
	
	  ContextMenu.prototype.dismiss = function(evt) {
	    return this.setState({
	      items: null
	    });
	  };
	
	  ContextMenu.prototype.render = function() {
	    var key, pos;
	    if (!this.state.items || this.state.items.length === 0) {
	      return React.createElement("section", {
	        "className": "hidden"
	      });
	    }
	    pos = this.state.position;
	    return React.createElement("section", {
	      "className": "menu-wrapper popup-layer",
	      "onClick": this.dismiss.bind(this)
	    }, React.createElement("ul", {
	      "className": "menu item-context-menu",
	      "style": {
	        left: pos.x,
	        top: pos.y
	      }
	    }, (function() {
	      var i, len, ref, results;
	      ref = this.state.items;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        key = ref[i];
	        results.push(React.createElement("li", {
	          "key": key,
	          "onClick": this.handleListItemClick.bind(this, key)
	        }, ContextMenu.NameDict[key]));
	      }
	      return results;
	    }).call(this)));
	  };
	
	  return ContextMenu;
	
	})(React.Component);


/***/ },
/* 16 */
/*!**************************************!*\
  !*** ./client/src/styles/menus.less ***!
  \**************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 17 */,
/* 18 */
/*!*********************************************!*\
  !*** ./client/src/FileUploadManager.coffee ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter, FileUploadManager, StatusMachine, Uploader,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	EventEmitter = Suzaku.EventEmitter;
	
	Uploader = __webpack_require__(/*! ./Uploader */ 19);
	
	StatusMachine = __webpack_require__(/*! ./StatusMachine */ 22);
	
	module.exports = FileUploadManager = (function(superClass) {
	  extend(FileUploadManager, superClass);
	
	  function FileUploadManager(client) {
	    FileUploadManager.__super__.constructor.apply(this, arguments);
	  }
	
	  FileUploadManager.prototype.handleDragHtml = function(currentDir, html) {
	    var img, j, len, results1, rootElem, srcs, url;
	    rootElem = $("<div>" + html.replace(/<script/g, '<_script') + "</div>");
	    srcs = (function() {
	      var j, len, ref, results1;
	      ref = rootElem.find("img");
	      results1 = [];
	      for (j = 0, len = ref.length; j < len; j++) {
	        img = ref[j];
	        results1.push(img.src);
	      }
	      return results1;
	    })();
	    console.log(srcs);
	    if (srcs.length === 0) {
	      return false;
	    }
	    results1 = [];
	    for (j = 0, len = srcs.length; j < len; j++) {
	      url = srcs[j];
	      results1.push($.post("/grabImage" + currentDir, JSON.stringify({
	        url: url
	      })).done((function(_this) {
	        return function(data) {
	          return _this.emit("fileUploaded");
	        };
	      })(this)).fail((function(_this) {
	        return function(e) {
	          return console.log("error", e);
	        };
	      })(this)));
	    }
	    return results1;
	  };
	
	  FileUploadManager.prototype.handleDragFiles = function(currentDir, items) {
	    this.completeFileCount = 0;
	    items = Array.prototype.map.call(items, function(i) {
	      return i.webkitGetAsEntry();
	    });
	    return new StatusMachine().status("initItems", function(data, status) {
	      return status.next([items, null]);
	    }).status("readDataTransferItems", (function(_this) {
	      return function(arg, status) {
	        var _items, unfinishedData;
	        _items = arg[0], unfinishedData = arg[1];
	        return status.nextTo(_this._readDataTransferItems(_items, unfinishedData));
	      };
	    })(this)).status("uploadFiles", (function(_this) {
	      return function(arg, status) {
	        var emptyFolderPaths, f, files, j, l, len, len1, p, path, totalSize, unfinishedData;
	        files = arg[0], emptyFolderPaths = arg[1], unfinishedData = arg[2];
	        console.log(files, emptyFolderPaths);
	        totalSize = 0;
	        for (j = 0, len = files.length; j < len; j++) {
	          f = files[j];
	          totalSize += f.size;
	        }
	        console.log("total file size is " + (totalSize / 1024 / 1024) + "MB");
	        p = Promise.resolve();
	        console.log(files.length + " files to go");
	        _this.fileCount += files.length;
	        files.forEach(function(file) {
	          return p = p.then(function() {
	            var dir, relativeDir;
	            relativeDir = file.relativeDir.slice(1);
	            console.log(relativeDir);
	            dir = "" + currentDir + relativeDir;
	            return _this.uploadFile(dir, file);
	          });
	        });
	        for (l = 0, len1 = emptyFolderPaths.length; l < len1; l++) {
	          path = emptyFolderPaths[l];
	          p = p.then(function() {
	            return _this._createEmptyFolder(path);
	          });
	        }
	        return p.then(function(e) {
	          console.log("finished");
	          if (unfinishedData) {
	            return status.goto("readDataTransferItems", [null, unfinishedData]);
	          } else {
	            return status.goto("allFileUploaded");
	          }
	        });
	      };
	    })(this)).status("allFileUploaded", (function(_this) {
	      return function(data, status) {
	        _this.emit("allFileUploaded");
	        return status.complete();
	      };
	    })(this))["catch"]((function(_this) {
	      return function(e) {
	        console.error(e.stack);
	        console.error("upload error");
	        return _this.emit("uploadError", e);
	      };
	    })(this));
	  };
	
	  FileUploadManager.prototype.uploadFile = function(currentDir, file) {
	    return new Promise((function(_this) {
	      return function(resolve, reject) {
	        var uploader;
	        console.log("start upload " + file.name);
	        uploader = new Uploader();
	        uploader.upload(currentDir, file);
	        uploader.on("sliceComplete", function(slice, completedSlices, sliceCount) {
	          return _this.emit("sliceComplete", file.name, completedSlices, sliceCount, _this.completeFileCount, _this.fileCount);
	        });
	        uploader.on("complete", function() {
	          _this.emit("fileUploaded");
	          _this.completeFileCount += 1;
	          return resolve();
	        });
	        return uploader.on("error", function(e) {
	          return reject(e);
	        });
	      };
	    })(this));
	  };
	
	  FileUploadManager.prototype._createEmptyFolder = function(path) {
	    return new Promise((function(_this) {
	      return function(resolve, reject) {
	        console.log("/newFolder" + path);
	        return $.get("/newFolder" + path).done(function(res) {
	          _this.emit("fileUploaded");
	          return resolve();
	        }).fail(function(e) {
	          return reject(e);
	        });
	      };
	    })(this));
	  };
	
	  FileUploadManager.prototype._readDataTransferItems = function(items, unfinishedData) {
	    return new StatusMachine().status("start", function() {
	      var files;
	      if (unfinishedData) {
	        return this.goto("continueReadFolderEntries", unfinishedData);
	      } else {
	        files = items.filter(function(i) {
	          return i && i.isFile;
	        });
	        files.forEach(function(i) {
	          return i.relativeDir = '/';
	        });
	        this.set({
	          files: files,
	          folders: items.filter(function(i) {
	            return i && i.isDirectory;
	          }),
	          emptyFolders: [],
	          entries: []
	        });
	        return this.goto("handleNextFolder");
	      }
	    }).status("continueReadFolderEntries", function(unfinishedData) {
	      this.set({
	        files: [],
	        folders: unfinishedData.folders,
	        emptyFolders: [],
	        entries: [],
	        folder: unfinishedData.folder,
	        gatherCounter: unfinishedData.gatherCounter,
	        reader: unfinishedData.reader
	      });
	      return this.goto("readFolderEntries");
	    }).status("handleNextFolder", function() {
	      var folder, folders;
	      folders = this.get("folders");
	      folder = folders.pop();
	      if (!folder) {
	        console.log(1);
	        return this.goto("getOutput");
	      } else {
	        this.set({
	          folder: folder
	        });
	        return this.goto("travalseFolder");
	      }
	    }).status("travalseFolder", function() {
	      var folder;
	      folder = this.get('folder');
	      console.log("for folder " + folder.fullPath);
	      this.set({
	        reader: folder.createReader(),
	        entries: [],
	        gatherCounter: 0
	      });
	      return this.next();
	    }).status("readFolderEntries", function(data, status) {
	      var emptyFolders, entries, folder, gatherCounter, reader;
	      folder = this.get("folder");
	      reader = this.get("reader");
	      entries = this.get("entries");
	      emptyFolders = this.get("emptyFolders");
	      gatherCounter = this.get("gatherCounter") + 1;
	      this.set({
	        gatherCounter: gatherCounter
	      });
	      return reader.readEntries((function(_this) {
	        return function(results) {
	          var MAX_COUNT, entry, j, len;
	          MAX_COUNT = 30;
	          if (results.length > 0) {
	            for (j = 0, len = results.length; j < len; j++) {
	              entry = results[j];
	              entries.push(entry);
	            }
	            if (results.length > MAX_COUNT) {
	              return _this.goto("getFileAndFoldersFromEntries", false);
	            } else {
	              return _this.goto("readFolderEntries");
	            }
	          } else {
	            if (gatherCounter === 1) {
	              emptyFolders.push(folder);
	            }
	            return _this.goto("getFileAndFoldersFromEntries");
	          }
	        };
	      })(this), (function(_this) {
	        return function(err) {
	          console.error(err);
	          return _this["throw"](err);
	        };
	      })(this));
	    }).status("getFileAndFoldersFromEntries", function(finished) {
	      var entries, files, folder, folders, i, j, len;
	      if (finished == null) {
	        finished = true;
	      }
	      folder = this.get("folder");
	      files = this.get("files");
	      folders = this.get("folders");
	      entries = this.get("entries");
	      for (j = 0, len = entries.length; j < len; j++) {
	        i = entries[j];
	        if (!(i)) {
	          continue;
	        }
	        if (i.isFile) {
	          i.relativeDir = folder.fullPath;
	          files.push(i);
	        }
	        if (i.isDirectory) {
	          folders.push(i);
	        }
	      }
	      if (!finished) {
	        return this.goto("getOutput", false);
	      } else {
	        return this.goto("handleNextFolder");
	      }
	    }).status("getOutput", function(finished) {
	      if (finished == null) {
	        finished = true;
	      }
	      return Promise.all(this.get("files").map(function(f) {
	        return new Promise(function(resolve, reject) {
	          return f.file(function(file) {
	            file.relativeDir = f.relativeDir;
	            return resolve(file);
	          }, function(err) {
	            console.error(err);
	            return resolve(null);
	          });
	        });
	      })).then((function(_this) {
	        return function(fileObjects) {
	          var data, emptyFolderPaths, j, k, len, results1, v;
	          fileObjects = fileObjects.filter(function(f) {
	            return f;
	          });
	          emptyFolderPaths = _this.get("emptyFolders").map(function(f) {
	            return f.fullPath;
	          });
	          if (!finished) {
	            unfinishedData = {
	              reader: _this.get("reader"),
	              folder: _this.get("folder"),
	              folders: _this.get("folders"),
	              gatherCounter: _this.get("gatherCounter")
	            };
	            _this.complete([fileObjects, emptyFolderPaths, unfinishedData]);
	          } else {
	            _this.complete([fileObjects, emptyFolderPaths]);
	          }
	          data = _this.getAll();
	          results1 = [];
	          for (v = j = 0, len = data.length; j < len; v = ++j) {
	            k = data[v];
	            results1.push(data[k] = null);
	          }
	          return results1;
	        };
	      })(this))["catch"]((function(_this) {
	        return function(e) {
	          console.error(e);
	          return _this["throw"](e);
	        };
	      })(this));
	    })["catch"](function(err) {
	      return console.error(err.stack);
	    }).toPromise();
	  };
	
	  return FileUploadManager;
	
	})(EventEmitter);


/***/ },
/* 19 */
/*!************************************!*\
  !*** ./client/src/Uploader.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter, Uploader, utils,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	EventEmitter = Suzaku.EventEmitter;
	
	utils = __webpack_require__(/*! ./clientUtils */ 20);
	
	module.exports = Uploader = (function(superClass) {
	  extend(Uploader, superClass);
	
	  function Uploader() {
	    Uploader.__super__.constructor.apply(this, arguments);
	    this.sliceSize = 3 * utils.SIZE.MB;
	    this.maxThreads = 2;
	    this.file = null;
	    this.availThreads = 0;
	    this.sliceCount = 0;
	    this.apiPath = null;
	    this.completedSlices = 0;
	    this.currentSlice = 0;
	    this.currentDir = "/";
	  }
	
	  Uploader.prototype.upload = function(currentDir, file) {
	    this.currentDir = currentDir;
	    this.file = file;
	    if (this.file.size > 0) {
	      this.sliceCount = Math.ceil(this.file.size / this.sliceSize);
	    } else {
	      this.sliceCount = 1;
	    }
	    return this.preCheck((function(_this) {
	      return function() {
	        return _this.doUpload();
	      };
	    })(this));
	  };
	
	  Uploader.prototype.preCheck = function(callback) {
	    var args, xhr;
	    xhr = new XMLHttpRequest();
	    args = "filename=" + this.file.name + "&size=" + this.file.size + "&sliceCount=" + this.sliceCount;
	    xhr.open("GET", "/check" + this.currentDir + "?" + args);
	    xhr.send();
	    return xhr.onreadystatechange = (function(_this) {
	      return function(evt) {
	        if (xhr.readyState === 4) {
	          if (xhr.status === 200) {
	            return callback();
	          } else {
	            console.error("preCheck error for file:", _this.file);
	            return _this.emit("error", xhr.responseText);
	          }
	        }
	      };
	    })(this);
	  };
	
	  Uploader.prototype.doUpload = function() {
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
	        _this.completedSlices += 1;
	        if (_this.completedSlices === _this.sliceCount) {
	          return _this.emit("complete");
	        } else {
	          return _this.uploadNextSlice();
	        }
	      };
	    })(this));
	    return this.uploadNextSlice();
	  };
	
	  Uploader.prototype.uploadNextSlice = function() {
	    if (!(this.currentSlice < this.sliceCount && this.availThreads > 0)) {
	      return;
	    }
	    this.availThreads -= 1;
	    this.uploadSlice(this.currentSlice);
	    this.currentSlice += 1;
	    return this.uploadNextSlice();
	  };
	
	  Uploader.prototype.uploadSlice = function(slice) {
	    var bolb, name, reader, start, stop, url, xhr;
	    if (!(slice < this.sliceCount)) {
	      return;
	    }
	    name = this.file.name;
	    if (this.file.size > 0) {
	      start = slice * this.sliceSize;
	      stop = (slice + 1) * this.sliceSize - 1;
	      if (stop > (this.file.size - 1)) {
	        stop = this.file.size - 1;
	      }
	    } else {
	      start = stop = 0;
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
	    xhr.onreadystatechange = (function(_this) {
	      return function(evt) {
	        if (xhr.readyState === 4) {
	          if (xhr.status === 200) {
	            return _this.emit("sliceComplete", slice, _this.completedSlices, _this.sliceCount);
	          } else {
	            return _this.emit("error", xhr.responseText);
	          }
	        }
	      };
	    })(this);
	    url = "/upload" + this.currentDir + "?start=" + start + "&stop=" + stop + "&filename=" + name;
	    return xhr.open("POST", url);
	  };
	
	  Uploader.prototype.sendAsBinary = function(xhr, data) {
	    var i, j, parts, ref;
	    this.xhr = new XMLHttpRequest();
	    parts = new Uint8Array(data.length);
	    if (data.length > 0) {
	      parts = new Uint8Array(data.length);
	      for (i = j = 0, ref = data.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
	        parts[i] = data[i].charCodeAt(0);
	      }
	      return xhr.send(parts.buffer);
	    } else {
	      return xhr.send('');
	    }
	  };
	
	  Uploader.prototype.showResult = function(res, label) {
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
	
	  return Uploader;
	
	})(EventEmitter);


/***/ },
/* 20 */
/*!***************************************!*\
  !*** ./client/src/clientUtils.coffee ***!
  \***************************************/
/***/ function(module, exports) {

	module.exports = {
	  SIZE: {
	    KB: 1024,
	    MB: 1024 * 1024
	  },
	  getTimeBasedId: function() {
	    var rand, time;
	    time = Date.now().toString(36);
	    rand = parseInt(Math.random() * 1000).toString(36);
	    return time + rand;
	  },
	  normalize: function(path) {
	    var regexp;
	    regexp = /\//g;
	    return path.replace(regexp, "/");
	  }
	};


/***/ },
/* 21 */
/*!**************************************************!*\
  !*** ./client/src/components/MessageHolder.cjsx ***!
  \**************************************************/
/***/ function(module, exports) {

	var MessageHolder,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	module.exports = MessageHolder = (function(superClass) {
	  extend(MessageHolder, superClass);
	
	  function MessageHolder() {
	    return MessageHolder.__super__.constructor.apply(this, arguments);
	  }
	
	  MessageHolder.prototype.render = function() {
	    var content;
	    content = (function(_this) {
	      return function() {
	        var md;
	        switch (_this.props.message) {
	          case "loading":
	            return "载入中";
	          case "error":
	            return "载入错误";
	          case "empty":
	            return "没有文件";
	          case "uploadError":
	            return React.createElement("span", {
	              "className": "error"
	            }, "上传错误 QAQ");
	          case "uploadComplete":
	            return React.createElement("span", {
	              "className": "success"
	            }, "上传成功 =w=");
	          case "uploading":
	            md = _this.props.messageData;
	            if (!md) {
	              return React.createElement("span", null, "上传中...");
	            } else {
	              return React.createElement("span", null, "正在上传文件", React.createElement("b", {
	                "className": "filename"
	              }, md.filename), React.createElement("b", {
	                "className": "percentage"
	              }, md.percentage, "%"), "完成文件数", React.createElement("b", null, md.completeFileCount, "\x2F", md.fileCount));
	            }
	        }
	      };
	    })(this)();
	    return React.createElement("p", {
	      "className": (!this.props.message ? "message-holder hidden" : "message-holder")
	    }, content);
	  };
	
	  return MessageHolder;
	
	})(React.Component);


/***/ },
/* 22 */
/*!*****************************************!*\
  !*** ./client/src/StatusMachine.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var Status, StatusMachine,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  slice = [].slice;
	
	Status = (function(superClass) {
	  extend(Status, superClass);
	
	  function Status(name1, handler1) {
	    this.name = name1;
	    this.handler = handler1;
	    Status.__super__.constructor.apply(this, arguments);
	    this.data = null;
	    this.isErrorStatus = false;
	    this.name = this.name.toString();
	    this.nextStatus = null;
	  }
	
	  Status.prototype.run = function(data) {
	    var e, error1;
	    console.log("run status", this.name);
	    this.emit("start");
	    try {
	      return this.handler.apply(this, [data, this]);
	    } catch (error1) {
	      e = error1;
	      return this.panic(e);
	    }
	  };
	
	  Status.prototype.nextTo = function(promise) {
	    return promise.then((function(_this) {
	      return function(data) {
	        return _this.next(data);
	      };
	    })(this))["catch"]((function(_this) {
	      return function(e) {
	        _this["throw"](e, {
	          fromPromise: promise
	        });
	        return Promise.reject();
	      };
	    })(this));
	  };
	
	  Status.prototype.queryData = function(promise, dataName, notEmpty) {
	    if (dataName == null) {
	      dataName = this.name + "Data";
	    }
	    if (notEmpty == null) {
	      notEmpty = false;
	    }
	    return promise.then((function(_this) {
	      return function(data) {
	        if (notEmpty && (!data || data.length) === 0) {
	          return _this["throw"](new Error("cannot find data " + dataName));
	        } else {
	          _this.set(dataName, data);
	          return _this.next(data);
	        }
	      };
	    })(this))["catch"]((function(_this) {
	      return function(e) {
	        _this["throw"](e, {
	          fromPromise: promise,
	          fromQueryData: true
	        });
	        return Promise.reject();
	      };
	    })(this));
	  };
	
	  Status.prototype.next = function(data) {
	    return this.emit("next", data);
	  };
	
	  Status.prototype.goto = function(name, data) {
	    return this.emit("goto", name, data);
	  };
	
	  Status.prototype["throw"] = function(error, data) {
	    return this.emit("throw", error, data);
	  };
	
	  Status.prototype.panic = function(error, data) {
	    return this.emit("panic", error, data);
	  };
	
	  Status.prototype.complete = function(data) {
	    return this.emit("complete", data);
	  };
	
	  Status.prototype.set = function(key, value) {
	    var k, results, v;
	    console.log("set", key, value);
	    if (key === void 0 && value === void 0) {
	      console.error("[Status] wrong arguments in Status.set key:'" + key + "',value:'" + value + "'");
	    }
	    if (typeof key === "object" && value === void 0) {
	      results = [];
	      for (k in key) {
	        v = key[k];
	        results.push(this.data[k] = v);
	      }
	      return results;
	    } else {
	      return this.data[key] = value;
	    }
	  };
	
	  Status.prototype.save = function(key, value) {
	    return this.set(key, value);
	  };
	
	  Status.prototype.get = function(key) {
	    if (this.data[key] === void 0) {
	      console.error("[Status] try to get an not defined key:'" + key + "' in " + this.name);
	    }
	    return this.data[key];
	  };
	
	  Status.prototype.getAll = function() {
	    return this.data;
	  };
	
	  Status.prototype.load = function(key) {
	    return this.get(key);
	  };
	
	  return Status;
	
	})(Suzaku.EventEmitter);
	
	module.exports = StatusMachine = (function(superClass) {
	  extend(StatusMachine, superClass);
	
	  StatusMachine.Status = Status;
	
	  function StatusMachine(autoStart) {
	    if (autoStart == null) {
	      autoStart = true;
	    }
	    StatusMachine.__super__.constructor.apply(this, arguments);
	    this.isActive = true;
	    this.dataStorage = {};
	    this.statusCount = 0;
	    this.statusDict = {};
	    this.statusList = [];
	    this.lastStatus = null;
	    this.lastNormalStatus = null;
	    this.lastErrorStatus = null;
	    this.errorHandlers = {};
	    if (autoStart) {
	      process.nextTick((function(_this) {
	        return function() {
	          return _this.start();
	        };
	      })(this));
	    }
	  }
	
	  StatusMachine.prototype.start = function(data) {
	    if (!this.statusList[0]) {
	      return console.error("[StatusMachine] no vailid status");
	    }
	    return this.statusList[0].run(data);
	  };
	
	  StatusMachine.prototype.status = function() {
	    var args, handler, name, s;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    name = null;
	    if (typeof args[0] === "function") {
	      handler = args[0];
	    } else {
	      name = args[0], handler = args[1];
	    }
	    if (!name) {
	      name = this.statusList.length + 1;
	    }
	    s = new Status(name, handler);
	    s.data = this.dataStorage;
	    this.statusDict[s.name] = s;
	    if (this.statusList[this.statusList.length - 1]) {
	      this.statusList[this.statusList.length - 1].nextStatus = s;
	    }
	    this.statusList.push(s);
	    this.statusCount = this.statusList.length;
	    this._bindStatusEvents(s);
	    return this;
	  };
	
	  StatusMachine.prototype["catch"] = function() {
	    var args, handler, s, statusName;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    if (typeof args[0] === "function") {
	      handler = args[0];
	      statusName = "_all";
	    } else {
	      statusName = args[0], handler = args[1];
	      if (!this.statusDict[statusName]) {
	        console.error("[StatusMachine] can't catch error for not exists status " + statusName);
	        return false;
	      }
	    }
	    if (this.errorHandlers[statusName]) {
	      console.error("[StatusMachine] already has a error handler for status " + statusName);
	      return false;
	    }
	    s = new Status("errorHandler:" + statusName, handler);
	    s.isErrorStatus = true;
	    s.data = this.dataStorage;
	    this.errorHandlers[statusName] = s;
	    this._bindStatusEvents(s);
	    if (statusName === "_all") {
	      s.next = null;
	    } else {
	      s.next = (function(_this) {
	        return function(data) {
	          if (_this.errorHandlers["_all"]) {
	            return _this.errorHandlers["_all"].run(data, _this.lastNormalStatus.name);
	          } else {
	            return console.error("[StatusMachine] no next error handler for " + s.name);
	          }
	        };
	      })(this);
	    }
	    s.nextTo = null;
	    return this;
	  };
	
	  StatusMachine.prototype.complete = function(data) {
	    if (!this.isActive) {
	      return;
	    }
	    this.isActive = false;
	    this.emit("complete", data);
	    return this;
	  };
	
	  StatusMachine.prototype.toPromise = function() {
	    return new Promise((function(_this) {
	      return function(resolve, reject) {
	        _this.on("complete", function(data) {
	          return resolve(data);
	        });
	        return _this.on("panic", function(e) {
	          return reject(e);
	        });
	      };
	    })(this));
	  };
	
	  StatusMachine.prototype.panic = function(e) {
	    this.emit("error", e);
	    this.emit("panic", e);
	    return this;
	  };
	
	  StatusMachine.prototype._bindStatusEvents = function(status) {
	    status.on("start", (function(_this) {
	      return function() {
	        _this.lastStatus = status;
	        if (status.isErrorStatus) {
	          return _this.lastErrorStatus = status;
	        } else {
	          return _this.lastNormalStatus = status;
	        }
	      };
	    })(this));
	    status.on("next", (function(_this) {
	      return function(data) {
	        if (!_this.isActive) {
	          return console.error("[StatusMachine] try to call next for " + status.name + " after complete");
	        }
	        if (status.nextStatus) {
	          return status.nextStatus.run(data);
	        } else {
	          return _this.complete(data);
	        }
	      };
	    })(this));
	    status.on("goto", (function(_this) {
	      return function(name, data) {
	        var e, s;
	        if (!_this.isActive) {
	          return console.error("[StatusMachine] try to goto " + name + " for " + status.name + " after complete");
	        }
	        s = _this.statusDict[name];
	        if (!s) {
	          console.error("[StatusMachine] no status named " + name);
	          e = new Error("invailid status name " + name + " to go from " + status.name, 500);
	          e.status = status;
	          return _this.panic(e);
	        } else {
	          return s.run(data);
	        }
	      };
	    })(this));
	    status.on("throw", (function(_this) {
	      return function(error, data) {
	        var e, handlerStatus;
	        if (!_this.isActive) {
	          return console.error("[StatusMachine] try to true " + error + " for " + status.name + " after complete");
	        }
	        handlerStatus = _this.errorHandlers[status.name] || _this.errorHandlers["_all"];
	        if (!handlerStatus) {
	          e = new Error("unhandled error from status " + status.name, 500);
	          e.status = status;
	          return _this.panic(e);
	        } else {
	          return handlerStatus.run(error, status.name, data || {});
	        }
	      };
	    })(this));
	    status.on("panic", (function(_this) {
	      return function(e) {
	        return _this.panic(e);
	      };
	    })(this));
	    return status.on("complete", (function(_this) {
	      return function(data) {
	        return _this.complete(data);
	      };
	    })(this));
	  };
	
	  StatusMachine.prototype.onComplete = function(handler) {
	    this.on("complete", handler);
	    return this;
	  };
	
	  StatusMachine.prototype.onPanic = function(handler) {
	    this.on("panic", handler);
	    return this;
	  };
	
	  return StatusMachine;
	
	})(Suzaku.EventEmitter);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/~/node-libs-browser/~/process/browser.js */ 23)))

/***/ },
/* 23 */
/*!**********************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/process/browser.js ***!
  \**********************************************************/
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map