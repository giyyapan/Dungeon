{EventEmitter} = require 'events'
fs = require 'fs'
http = require 'http'
Url = require 'url'
path = require 'path'

userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/45.0.2454.101 Chrome/45.0.2454.101 Safari/537.36'
headers =
  'test.net':
    Referer:'http://test.net/'
    Cookie:''

module.exports =
  class ImageGraber extends EventEmitter
    constructor:({configs})->
      super
      {@dataPath} = configs

    grabImage:(req, res, next)->
      #post /grabImage/:path
      targetDir = req.params[0] or "/"
      body = ''
      req.on "data",(chunk)->
        body += chunk
      req.on "end",=>
        try
          data = JSON.parse body
        catch e
          return res.status(400).end()
        @_downloadImage data.url,targetDir,data
        .then ->
          res.send "ok"
        .catch (e)->
          console.error e
          res.status(500).end()

    _downloadImage:(imageUrl,targetDir,{filename,cookie,referer})->
      new Promise (resolve, reject)=>
        urlData = Url.parse imageUrl
        urlData.headers =
          'User-Agent':userAgent
          'Referer':referer or "#{urlData.protocol}//#{urlData.hostname}"
          'Cookie':cookie or ''
        if headers[urlData.hostname]
          for k,v of headers[urlData.hostname]
            urlData.headers[k] = v
        console.log "grab image:",imageUrl
        req = http.get urlData,(res)=>
          console.log res.statusCode
          filename = imageUrl.split("/").pop() or "image"
          parts = filename.split(".")
          if parts.length is 0
            baseName = parts[0]
            extName = "jpg"
          else
            extName = parts.pop()
            baseName = parts.join("_")
          name = "#{baseName}_#{Date.now().toString(36)}.#{extName}"
          realPath = path.normalize "#{@dataPath}/#{targetDir}/#{name}"
          res.pipe fs.createWriteStream realPath
          res.on 'end',->
            console.log "end"
            resolve()
        req.on "error",(e)->
          console.log "error"
          console.error e
          reject e
