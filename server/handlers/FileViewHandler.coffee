{EventEmitter} = require 'events'
fs = require 'fs'
path = require 'path'

module.exports =
  class FileViewHandler extends EventEmitter
    constructor:({@dataPath})->

    list:(req, res)->
      #get /list/:path
      childDir = req.params.path or ""
      dir = path.normalize(@dataPath + childDir)
      console.log "read dir #{dir}"
      fs.readdir dir,(e,files)=>
        if e
          console.error e.stack
          return res.status(500).send "cannot read file"
        Promise.all files.map (file)=>
          @getFileData path.normalize "#{dir}/#{file}"
        .then (fileDataList)->
          res.send files:fileDataList
        .catch (e)->
          console.error e.stack
          res.status(500).send "error reading stats"

    getFileData:(filepath)->
      new Promise (resolve, reject)->
        fs.stat filepath,(e, stats)->
          if e then return reject e
          stats.isDirectory = stats.isDirectory()
          resolve stats
