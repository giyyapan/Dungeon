express = require('express')
cson = require 'cson'

class DungeonTreasure
  constructor:()->
    @configs = cson.load '../configs.cson'
    console.log @configs

    @server = express()

    @server.use express.static("../client")

    @server.listen @configs.port,=>
      console.log "Server started at #{@configs.port}"

new DungeonTreasure()
