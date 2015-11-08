{EventEmitter} = require 'events'
path = require 'path'
fs = require 'fs'
lwip = require 'lwip'
crypto = require 'crypto'

module.exports =
  class PreviewHandler extends EventEmitter
    constructor:({configs})->
      super
      {@dataPath, @thumbnailPath} = configs
      @enabled = false
      if not @thumbnailPath
        return console.error "need thumbnailPath in config.cson"
      fs.mkdir @thumbnailPath, (e,stats)=>
        if not e or e.code is "EEXIST"
          @enabled = true
        else
          console.error e

    previewImg:(req, res, next)->
      return next() unless @enabled
      filePath = req.params[0]
      md5 = crypto.createHash "md5"
      md5.update(filePath)
      hash = md5.digest('hex')
      realPath = path.normalize("#{@thumbnailPath}/#{hash}.jpg")
      fs.stat realPath,(e,stats)=>
        if not e
          res.sendFile realPath
        else if e.code is "ENOENT"
          @_createThumbnail filePath,hash
          .then =>
            res.sendFile realPath
          .catch (e)->
            console.error e
            res.status(500).end()
        else
          console.error e
          res.status(500).end()

    _createThumbnail:(filePath, hash)->
      console.log "create thumbnail for : #{filePath} hash is #{hash}"
      targetPath = path.normalize "#{@thumbnailPath}/#{hash}.jpg"
      new Promise (resolve, reject)=>
        lwip.open path.normalize("#{@dataPath}/#{filePath}"),(e,img)=>
          if e then return reject e
          width = 120
          img.batch()
            .resize(width,width*img.height()/img.width())
            .writeFile targetPath,(err)->
              if err
                fs.unlink targetPath,(e)->
                  reject e or err
              else
                resolve()
