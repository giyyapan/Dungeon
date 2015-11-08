{EventEmitter} = require 'events'
fs = require 'fs'
path = require 'path'
rimraf = require 'rimraf'

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
      fs.stat realPath,(e,stats)=>
        if e then return @_handleError e,res
        if stats.isDirectory()
          rimraf realPath,(e)=>
            if e then return @_handleError e,res
            res.send('ok')
        else
          fs.unlink realPath,(e)=>
            if e then return @_handleError e,res
            res.send('ok')

    _handleError:(e,res)->
      console.error e
      res.status(500).end()

    _getFileStats:(filepath)->
      new Promise (resolve, reject)->
        fs.stat filepath,(e, stats)->
          if e then return reject e
          stats.isDirectory = stats.isDirectory()
          resolve stats
