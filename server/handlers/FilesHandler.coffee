{EventEmitter} = require 'events'
fs = require 'fs'
path = require 'path'
rimraf = require 'rimraf'

utils = require '../utils'

module.exports =
  class FilesHandler extends EventEmitter
    constructor:({configs})->
      super
      {@dataPath, @thumbnailPath} = configs

    viewImage:(req, res)->
      #get /viewImage/*
      relativePath = req.params[0]
      realPath = path.normalize "#{@dataPath}/#{relativePath}"
      res.sendFile realPath

    list:(req, res)->
      #get /list/*
      childDir = req.params[0] or "/"
      if childDir is path.normalize("/#{@thumbnailPath}")
        return res.status(403).end "thumbnailPath can not be visited by client"
      dir = path.normalize "#{@dataPath}/#{childDir}"
      #console.log "read dir #{dir}"
      fs.readdir dir,(e,items)=>
        if e
          console.error e.stack
          return res.status(500).send "cannot read file"
        Promise.all items.map (name)=>
          @_getFileStats path.normalize "#{dir}/#{name}"
          .then (stats)->
            itemData = stats
            itemData.name = name
            itemData.relativePath = path.normalize "/#{childDir}/#{name}"
            Promise.resolve itemData
        .then (fileDataList)->
          #remove .thumbnails dir
          fileDataList = fileDataList.filter (item)->
            item.relativePath isnt "/.thumbnails"
          res.send items:fileDataList
        .catch (e)->
          console.error e.stack
          res.status(500).send "error reading stats"

    remove:(req, res, next)->
      #get /remvoe/*
      relativePath = req.params[0]
      realPath = path.normalize "#{@dataPath}/#{relativePath}"
      new Promise (resolve, reject)->
        fs.stat realPath,(e,stats)->
          if e then return reject e
          if stats.isDirectory()
            rimraf realPath,(e)->
              if e then return reject e
              resolve()
          else
            fs.unlink realPath,(e)->
              if e then return reject e
              resolve()
      .then ()=>
        hash = utils.getFilePathHash(relativePath)
        _path = path.normalize "#{@thumbnailPath}/#{hash}.jpg"
        fs.unlink _path,(e)->
          if e and e.code isnt "ENOENT" then console.error(e)
          res.send "ok"
      .catch (e)->
        console.error e
        res.status(500).end()

    _getFileStats:(filepath)->
      new Promise (resolve, reject)->
        fs.stat filepath,(e, stats)->
          if e then return reject e
          stats.isDirectory = stats.isDirectory()
          resolve stats
