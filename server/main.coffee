express = require 'express'
cson = require 'cson'
fs = require 'fs'

class DungeonTreasure
  constructor:()->
    @configs = cson.load '../configs.cson'
    @dataPath = @configs.dataPath
    console.log @configs

    @server = express()

    @server.post "/upload",(req, res, next)=>
      stream = fs.createWriteStream "/home/giyya/Storage/#{Date.now()}.jpg"
      totalSize = 0
      chunks = []
      req.on "data",(chunk)->
        totalSize += chunk.length
        chunks.push chunk
      req.on "end",->
        console.log "upload complete"
        console.log totalSize
        body = new Buffer(totalSize)
        index = 0
        for c in chunks
          c.copy body,index
          index += c.length
        stream.write new Buffer body.toString(),"base64"
        res.end()
      stream.on "error",(e)->
        console.log e.stack
        res.status(500).end()


    @server.use express.static("../client")

    @server.listen @configs.port,=>
      console.log "Server started at #{@configs.port}"

new DungeonTreasure()
