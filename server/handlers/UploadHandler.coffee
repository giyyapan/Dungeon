fs = require 'fs'
path = require 'path'
{EventEmitter} = require 'events'

class UploadingFile extends EventEmitter
  fileDescriptor:null
  size:null
  filename:null
  checksum:null
  constructor:(@filename,@size,@checksum,@fileDescriptor)->
    @receivedDataSize = 0
    @lastReportedSize = 0
    @startTime = Date.now()
    @checkCloseTimeout = null
    @lastReportedTime = @startTime
    @lastActiveAt = @startTime
  shouldClose:->
    Date.now() - @lastActiveAt > 60 * 1000
  updateReceivedSize:(delta)->
    @receivedDataSize += delta
    mb = 1024 * 1024
    deltaSize = @receivedDataSize - @lastReportedSize
    if deltaSize > 100 * mb
      secondsPassed = (Date.now() - @lastReportedTime)/1000
      speed = deltaSize/mb/(secondsPassed)
      console.log "received #{(@receivedDataSize/mb).toFixed(2)}mb",
        "average speed is #{speed.toFixed(2)}m/s"
      @lastReportedTime = Date.now()
      @lastReportedSize = @receivedDataSize
  activate:->
    @lastActiveAt = Date.now()
  close:->
    if @checkCloseTimeout
      clearTimeout @checkCloseTimeout
    fs.close @fileDescriptor,(e)=>
      if e then console.error e
      @fileDescriptor = null

module.exports =
  class UploadManager extends EventEmitter
    constructor:({@configs})->
      @dataPath = @configs.dataPath
      @uploadingFiles = {}

    preCheck:(req, res)->
      #get /check
      {filename,size,checksum} = req.query
      dir = path.normalize "#{@dataPath}/#{filename}"
      fs.open dir,"w",(e,fileDescriptor)=>
        if e then return res.status(500).end()
        @addUploadingFile filename,size,checksum,fileDescriptor
        console.log "preCheck success, waiting for file upload ..."
        res.end()

    addUploadingFile:(filename, size, checksum, fileDescriptor)->
      if @uploadingFiles[filename]
        @uploadingFiles[filename].close()
      uf = new UploadingFile filename,size,checksum,fileDescriptor
      @uploadingFiles[filename] = uf
      @startAutoCloseTimeout uf

    startAutoCloseTimeout:(uf)->
      filename = uf.filename
      uf.checkCloseTimeout = setTimeout =>
        uf = @uploadingFiles[filename]
        return unless uf?
        console.log "checking auto close uploadingFile ..."
        if uf.shouldClose()
          console.log "- closed"
          @removeUploadingFile filename
        else
          console.log "- shouldn't close now, keep waiting"
          @startAutoCloseTimeout uf
      , 30 * 1000

    removeUploadingFile:(filename)->
      return unless @uploadingFiles[filename]
      @uploadingFiles[filename].close()
      delete @uploadingFiles[filename]

    uploadFileSlice:(req, res)->
      #post /upload
      {filename, start, stop} = req.query
      start = parseInt(start)
      stop = parseInt(stop)
      dir = path.normalize "#{@dataPath}/#{filename}"
      unless @uploadingFiles[filename]
        return res.status(403).end "need check first"
      uf = @uploadingFiles[filename]
      cachedChunks = []
      offset = 0
      reportFinish = false
      req.on "data",(chunk)=>
        uf.activate()
        fs.write uf.fileDescriptor,chunk,0,chunk.length,start + offset,(e)=>
          if e then return onError e
          uf.updateReceivedSize chunk.length
          if stop is (uf.size - 1) and reportFinish
            totalTime = ((Date.now() - uf.startTime)/1000).toFixed(1)
            console.log "File upload Completed! - totalSize #{uf.size} upload used #{totalTime}s"
            @removeUploadingFile filename
            reportFinish = false
        offset += chunk.length
      req.on "end",->
        #console.log "upload complete #{start}~#{stop}"
        reportFinish = true
        res.end()
      onError = (e)=>
        console.log e.stack
        res.status(500).end()
        @removeUploadingFile(filename)
