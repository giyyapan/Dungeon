fs = require 'fs'
path = require 'path'
{EventEmitter} = require 'events'

class UploadingFile extends EventEmitter
  constructor:(@relativePath,@size,@checksum,@fileDescriptor)->
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
      dir = req.params[0] or "/"
      realDir = path.normalize "#{@dataPath}/#{dir}"
      relativePath = path.normalize "/#{dir}/#{filename}"
      realPath = path.normalize "#{@dataPath}#{relativePath}"
      fs.mkdir realDir,(e)=>
        if e and e.code isnt "EEXIST"
          console.error e
          return res.status(500).end()
        fs.open realPath ,"w",(e,fileDescriptor)=>
          if e
            console.error e
            return res.status(500).end()
          @_addUploadingFile relativePath,size,checksum,fileDescriptor
          console.log "preCheck success, waiting for file upload ..."
          res.end()

    uploadFileSlice:(req, res)->
      #post /upload
      {filename, start, stop} = req.query
      start = parseInt(start)
      stop = parseInt(stop)
      dir = req.params[0] or "/"
      relativePath = path.normalize "/#{dir}/#{filename}"
      unless @uploadingFiles[relativePath]
        return res.status(403).end "need check first"
      uf = @uploadingFiles[relativePath]
      cachedChunks = []
      offset = 0
      reportFinish = false
      req.on "data",(chunk)=>
        uf.activate()
        fs.write uf.fileDescriptor,chunk,0,chunk.length,start + offset,(e)=>
          if e
            console.log e.stack
            res.status(500).end()
            @_removeUploadingFile(relativePath)
            return
          uf.updateReceivedSize chunk.length
          if stop is (uf.size - 1) and reportFinish
            totalTime = ((Date.now() - uf.startTime)/1000).toFixed(1)
            console.log "File upload Completed! - totalSize #{uf.size} upload used #{totalTime}s"
            @_removeUploadingFile relativePath
            reportFinish = false
        offset += chunk.length
      req.on "end",->
        #console.log "upload complete #{start}~#{stop}"
        reportFinish = true
        res.end()

    _addUploadingFile:(relativePath, size, checksum, fileDescriptor)->
      if @uploadingFiles[relativePath]
        @uploadingFiles[relativePath].close()
      uf = new UploadingFile relativePath,size,checksum,fileDescriptor
      @uploadingFiles[relativePath] = uf
      @_startAutoCloseTimeout uf

    _startAutoCloseTimeout:(uf)->
      relativePath = uf.relativePath
      uf.checkCloseTimeout = setTimeout =>
        uf = @uploadingFiles[relativePath]
        return unless uf?
        console.log "checking auto close uploadingFile ..."
        if uf.shouldClose()
          console.log "- closed"
          @_removeUploadingFile relativePath
        else
          console.log "- shouldn't close now, keep waiting"
          @_startAutoCloseTimeout uf
      , 30 * 1000

    _removeUploadingFile:(relativePath)->
      return unless @uploadingFiles[relativePath]
      @uploadingFiles[relativePath].close()
      delete @uploadingFiles[relativePath]
