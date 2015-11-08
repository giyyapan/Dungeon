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
	
	FileUploadManager = __webpack_require__(/*! ./FileUploadManager */ 22);
	
	DungeonClient = (function(superClass) {
	  extend(DungeonClient, superClass);
	
	  function DungeonClient() {
	    DungeonClient.__super__.constructor.apply(this, arguments);
	    this.uploadManager = new FileUploadManager(this);
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
	        var currentDir, dt;
	        e.stopPropagation();
	        e.preventDefault();
	        currentDir = _this.filesPanel.state.currentDir;
	        dt = e.dataTransfer;
	        if (dt.files.length > 0) {
	          _this.uploadManager.handleDragFiles(currentDir, dt.files);
	          return _this.emit("uploading");
	        } else if (dt.getData('text/html')) {
	          _this.uploadManager.handleDragHtml(currentDir, dt.getData('text/html'));
	          return _this.emit("uploading");
	        } else {
	          return console.log("drop event unhandled");
	        }
	      };
	    })(this));
	    this.uploadManager.on("fileUploaded", (function(_this) {
	      return function() {
	        return _this.filesPanel.listDir();
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

	var ContextMenu, DetailPanel, DirItem, FileItem, FilesPanel, ImageItem,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
	DirItem = __webpack_require__(/*! ./DirItem */ 8);
	
	FileItem = __webpack_require__(/*! ./FileItem */ 9);
	
	ImageItem = __webpack_require__(/*! ./ImageItem */ 10);
	
	DetailPanel = __webpack_require__(/*! ./DetailPanel */ 11);
	
	ContextMenu = __webpack_require__(/*! ./ContextMenu */ 20);
	
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
	
	  FilesPanel.prototype.listDir = function() {
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
	        return _this.setState({
	          items: data.items,
	          message: message
	        });
	      };
	    })(this)).fail((function(_this) {
	      return function(e) {
	        console.log("error", e);
	        return _this.setState({
	          error: true,
	          message: 'error'
	        });
	      };
	    })(this));
	  };
	
	  FilesPanel.prototype.changeDir = function(arg) {
	    var dirStack, newDir;
	    newDir = arg.newDir;
	    dirStack = this.state.dirStack.map(function(d) {
	      return d;
	    });
	    dirStack.push(this.state.currentDir);
	    return this.setState({
	      currentDir: newDir,
	      dirStack: dirStack,
	      message: 'loading'
	    }, (function(_this) {
	      return function() {
	        return _this.listDir();
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
	    return this.setState({
	      currentDir: dir,
	      dirStack: dirStack,
	      message: "loading"
	    }, (function(_this) {
	      return function() {
	        return _this.listDir();
	      };
	    })(this));
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
	
	  FilesPanel.prototype.showDetail = function(arg) {
	    var itemData, itemType;
	    itemType = arg.itemType, itemData = arg.itemData;
	    return this.refs.detailPanel.showDetail(itemType, itemData);
	  };
	
	  FilesPanel.prototype.onMenuItemClick = function(arg) {
	    var action, itemData, key;
	    key = arg.key, itemData = arg.itemData;
	    action = key;
	    return this.refs[itemData.relativePath].doFileAction(action);
	  };
	
	  FilesPanel.prototype.handleItemEvent = function(event, data) {
	    if (data.itemData) {
	      data.itemType = this.getItemType(data.itemData);
	    }
	    switch (event) {
	      case 'enterDir':
	        return this.changeDir(data);
	      case 'showDetail':
	        return this.showDetail(data);
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
	      "onItemClick": this.onMenuItemClick.bind(this)
	    }), React.createElement("header", {
	      "className": "main-header"
	    }, React.createElement("button", {
	      "onClick": this.refresh.bind(this)
	    }, "刷新"), React.createElement("button", {
	      "onClick": this.goBack.bind(this)
	    }, "后退"), React.createElement("span", {
	      "className": "current-path"
	    }, this.state.currentDir)), React.createElement("div", {
	      "className": "files-holder"
	    }, (this.state.message ? React.createElement("span", {
	      "className": "message-holder"
	    }, ((function() {
	      switch (this.state.message) {
	        case "loading":
	          return "载入中";
	        case "error":
	          return "载入错误";
	        case "empty":
	          return "没有文件";
	        case "uploading":
	          return "上传中...";
	      }
	    }).call(this))) : void 0), ((function() {
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
	    }).call(this))));
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

	var DirItem, FileItem,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
	FileItem = __webpack_require__(/*! ./FileItem */ 9);
	
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
	    })), React.createElement("p", {
	      "className": "name",
	      "tilte": this.props.data.name
	    }, this.props.data.name));
	  };
	
	  return DirItem;
	
	})(FileItem);


/***/ },
/* 9 */
/*!*********************************************!*\
  !*** ./client/src/components/FileItem.cjsx ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var FileItem,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
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
	        return console.log("rename");
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
	
	  FileItem.prototype.handleClick = function(e) {
	    return this.props.onEvent("showDetail", {
	      itemData: this.props.data
	    });
	  };
	
	  FileItem.prototype.handleContextMenu = function(evt) {
	    var rect;
	    evt.preventDefault();
	    evt.stopPropagation();
	    rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
	    console.log(evt.pageX, evt.pageY);
	    return this.props.onEvent("showContextMenu", {
	      menuItems: this.contextMenuItems,
	      itemData: this.props.data,
	      position: {
	        x: evt.pageX,
	        y: evt.pageY
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
	    }, "File:")), React.createElement("p", {
	      "className": "name",
	      "tilte": this.props.data.name
	    }, this.props.data.name));
	  };
	
	  return FileItem;
	
	})(React.Component);


/***/ },
/* 10 */
/*!**********************************************!*\
  !*** ./client/src/components/ImageItem.cjsx ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var FileItem, ImageItem,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/filesPanel.less */ 6);
	
	FileItem = __webpack_require__(/*! ./FileItem */ 9);
	
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
	    })), React.createElement("p", {
	      "className": "name",
	      "tilte": this.props.data.name
	    }, this.props.data.name));
	  };
	
	  return ImageItem;
	
	})(FileItem);


/***/ },
/* 11 */
/*!************************************************!*\
  !*** ./client/src/components/DetailPanel.cjsx ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var DetailPanel,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/detailPanel.less */ 12);
	
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
/* 12 */
/*!********************************************!*\
  !*** ./client/src/styles/detailPanel.less ***!
  \********************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/*!**************************************!*\
  !*** ./client/src/styles/menus.less ***!
  \**************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 19 */,
/* 20 */
/*!************************************************!*\
  !*** ./client/src/components/ContextMenu.cjsx ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ContextMenu,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	__webpack_require__(/*! ../styles/menus.less */ 18);
	
	module.exports = ContextMenu = (function(superClass) {
	  extend(ContextMenu, superClass);
	
	  ContextMenu.NameDict = {
	    'rename': '重命名',
	    'download': '下载',
	    'saveAs': '另存为',
	    'delete': '删除',
	    'newDir': '创建文件夹'
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
/* 21 */,
/* 22 */
/*!*********************************************!*\
  !*** ./client/src/FileUploadManager.coffee ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter, FileUploadManager, Uploader,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	EventEmitter = Suzaku.EventEmitter;
	
	Uploader = __webpack_require__(/*! ./Uploader */ 23);
	
	module.exports = FileUploadManager = (function(superClass) {
	  extend(FileUploadManager, superClass);
	
	  function FileUploadManager(client) {
	    FileUploadManager.__super__.constructor.apply(this, arguments);
	  }
	
	  FileUploadManager.prototype.handleDragHtml = function(currentDir, html) {
	    var i, img, len, results, rootElem, srcs, url;
	    rootElem = $("<div>" + html.replace(/<script/g, '<_script') + "</div>");
	    srcs = (function() {
	      var i, len, ref, results;
	      ref = rootElem.find("img");
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        img = ref[i];
	        results.push(img.src);
	      }
	      return results;
	    })();
	    console.log(srcs);
	    if (srcs.length === 0) {
	      return false;
	    }
	    results = [];
	    for (i = 0, len = srcs.length; i < len; i++) {
	      url = srcs[i];
	      results.push($.post("/grabImage" + currentDir, JSON.stringify({
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
	    return results;
	  };
	
	  FileUploadManager.prototype.handleDragFiles = function(currentDir, files) {
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
	          return _this.uploadFile(currentDir, f);
	        });
	      };
	    })(this));
	    return p.then((function(_this) {
	      return function(e) {
	        console.log("finished");
	        return _this.emit("fileUploaded");
	      };
	    })(this))["catch"](function(e) {
	      console.error(e.stack);
	      return console.error("upload error");
	    });
	  };
	
	  FileUploadManager.prototype.uploadFile = function(currentDir, file) {
	    return new Promise(function(resolve, reject) {
	      var uploader;
	      console.log("start upload " + file.name);
	      uploader = new Uploader();
	      uploader.upload(currentDir, file);
	      return uploader.on("complete", function() {
	        return resolve();
	      });
	    });
	  };
	
	  return FileUploadManager;
	
	})(EventEmitter);


/***/ },
/* 23 */
/*!************************************!*\
  !*** ./client/src/Uploader.coffee ***!
  \************************************/
/***/ function(module, exports) {

	var EventEmitter, Uploader, size,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	EventEmitter = Suzaku.EventEmitter;
	
	size = {
	  kb: 1024,
	  mb: 1024 * 1024
	};
	
	module.exports = Uploader = (function(superClass) {
	  extend(Uploader, superClass);
	
	  function Uploader() {
	    Uploader.__super__.constructor.apply(this, arguments);
	    this.sliceSize = 3 * size.mb;
	    this.maxThreads = 2;
	    this.file = null;
	    this.availThreads = 0;
	    this.sliceCount = 0;
	    this.apiPath = null;
	    this.currentSlice = 0;
	    this.currentDir = "/";
	  }
	
	  Uploader.prototype.upload = function(currentDir, file) {
	    var xhr;
	    this.currentDir = currentDir;
	    this.file = file;
	    xhr = new XMLHttpRequest();
	    xhr.open("GET", "/check" + this.currentDir + "?filename=" + this.file.name + "&size=" + this.file.size);
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
	
	  Uploader.prototype.doUpload = function() {
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
	    url = "/upload" + this.currentDir + "?start=" + start + "&stop=" + stop + "&filename=" + name;
	    return xhr.open("POST", url);
	  };
	
	  Uploader.prototype.sendAsBinary = function(xhr, data) {
	    var i, j, parts, ref;
	    this.xhr = new XMLHttpRequest();
	    parts = new Uint8Array(data.length);
	    for (i = j = 0, ref = data.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
	      parts[i] = data[i].charCodeAt(0);
	    }
	    return xhr.send(parts.buffer);
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map