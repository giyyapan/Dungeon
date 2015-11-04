express = require 'express'
cson = require 'cson'

UploadHandler = require './handlers/UploadHandler.coffee'
FileViewHandler = require './handlers/FileViewHandler.coffee'

class Dungeon
  constructor:()->
    @configs = cson.load '../configs.cson'
    @dataPath = @configs.dataPath
    @uploadHandler = new UploadHandler this
    @fileViewHandler = new FileViewHandler this
    @initServer()

  initServer:->
    @server = express()

    @server.post "/upload",(req, res, next)=>
      @uploadHandler.uploadFileSlice req,res

    @server.get "/check",(req, res, next)=>
      @uploadHandler.preCheck req,res

    @server.get "/list",(req, res, next)=>
      @fileViewHandler.list req,res

    @server.get "/list/:path",(req, res, next)=>
      @fileViewHandler.list req,res

    @server.use express.static("../client")

    @server.listen @configs.port,=>
      console.log "Server started at #{@configs.port}"

new Dungeon()
