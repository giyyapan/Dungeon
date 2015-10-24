EventEmitter = Suzaku.EventEmitter

class FileUploader extends EventEmitter
  upload:(apiPath, file)->
    xhr = new XMLHttpRequest()
    console.log xhr
    reader = new FileReader()
    xhr.upload.addEventListener "progress",(e)=>
      if e.lengthCompulatable
        percentage = Math.round((e.loaded * 100) / e.total);
        console.log "upload #{percentage}/100%"
        @emit "onProgress",percentage
    xhr.upload.addEventListener "load",(e)=>
      console.log "upload complete"
      @emit "complete"
    xhr.open "POST",apiPath
    console.log file
    reader.readAsBinaryString file
    reader.onload = (e)=>
      console.log "reader onload"
      @emit "onload"
      console.log e.target.result.length
      #base64 编码
      xhr.send btoa(e.target.result)
    this

class DungeonClient
  constructor:()->
    @fileUploader = new FileUploader
    console.log "inited"
    window.addEventListener "dragover",(e)=>
      console.log "over"
      e.preventDefault()
    window.addEventListener "dragleave",(e)=>
      console.log "leave"
      e.preventDefault()
    window.addEventListener "drop",(e)=>
      e.stopPropagation()
      e.preventDefault()
      files = e.dataTransfer.files
      @handleUploadFiles files

  handleUploadFiles:(files)->
    totalSize = 0
    totalSize += f.size for f in files
    console.log "total file size is #{totalSize/1024/1024}MB"
    p = Promise.resolve()
    for f in files
      p = p.then =>
        @uploadFile(f)
    p.then (e)->
      console.log "finished"
    .catch (e)->
      console.error e.stack
      console.error "upload error"

  uploadFile:(file)->
    new Promise (resolve, reject)->
      console.log "start upload #{file.name}"
      new FileUploader().upload("/upload",file)
      .on "complete",->
        resolve()

window.onload = ->
  new DungeonClient()
