express = require 'express'
cson = require 'cson'

UploadHandler = require './handlers/UploadHandler.coffee'
FilesHandler = require './handlers/FilesHandler.coffee'
PreviewHandler = require './handlers/PreviewHandler.coffee'
ImageGraber = require './handlers/ImageGraber.coffee'

class Dungeon
  constructor:()->
    @configs = cson.load '../configs.cson'
    @dataPath = @configs.dataPath
    @uploadHandler = new UploadHandler this
    @filesHandler = new FilesHandler this
    @previewHandler = new PreviewHandler this
    @imageGraber = new ImageGraber this

    @initServer()

  initServer:->
    @server = express()

    @server.use (req,res,next)->
      console.log "-",req.method,req.url
      next()

    @server.get "/listDir/*?",@filesHandler.list.bind(@filesHandler)

    @server.get "/imgPreview/*",@previewHandler.previewImg.bind(@previewHandler)

    @server.get "/check/*?",@uploadHandler.preCheck.bind(@uploadHandler)

    @server.post "/upload/*?",@uploadHandler.uploadFileSlice.bind(@uploadHandler)

    @server.post "/grabImage/*?",@imageGraber.grabImage.bind(@imageGraber)

    @server.get "/viewImage/*",@filesHandler.viewImage.bind(@filesHandler)

    @server.get "/newFolder/*",@filesHandler.newFolder.bind(@filesHandler)

    @server.get "/rename/*",@filesHandler.rename.bind(@filesHandler)

    @server.get "/get/*",(req, res, next)->
      console.log "get",req.params[0]

    @server.get "/download/*",(req, res, next)->
      console.log "download",req.params[0]

    @server.get "/delete/*",@filesHandler.remove.bind(@filesHandler)

    @server.use express.static("../client")

    @server.listen @configs.port,=>
      console.log """
         ____
        |  _ \\ _   _ _ __   __ _  ___  ___  _ __
        | | | | | | | '_ \\ / _` |/ _ \\/ _ \\| '_ \\
        | |_| | |_| | | | | (_| |  __/ (_) | | | |
        |____/ \\__,_|_| |_|\\__, |\\___|\\___/|_| |_|
                           |___/
        ======= server start at port #{@configs.port} =======
      """

new Dungeon()
