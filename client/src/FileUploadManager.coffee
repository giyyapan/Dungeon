EventEmitter = Suzaku.EventEmitter

Uploader = require './Uploader'

module.exports =
  class FileUploadManager extends EventEmitter
    constructor:(client)->
      super

    handleDragHtml:(currentDir,html)->
      rootElem = $("<div>" + html.replace(/<script/g,'<_script') + "</div>")
      srcs = (img.src for img in rootElem.find("img"))
      console.log srcs
      if srcs.length is 0 then return false
      for url in srcs
        $.post "/grabImage#{currentDir}",JSON.stringify {url:url}
        .done (data)=>
          @emit "fileUploaded"
        .fail (e)=>
          console.log "error",e

    handleDragFiles:(currentDir,files)->
      totalSize = 0
      totalSize += f.size for f in files
      console.log "total file size is #{totalSize/1024/1024}MB"
      p = Promise.resolve()
      Array::forEach.call files,(f)=>
        p = p.then =>
          @uploadFile(currentDir,f)
      p.then (e)=>
        console.log "finished"
        @emit "fileUploaded"
      .catch (e)->
        console.error e.stack
        console.error "upload error"

    uploadFile:(currentDir,file)->
      new Promise (resolve, reject)->
        console.log "start upload #{file.name}"
        uploader = new Uploader()
        uploader.upload(currentDir,file)
        uploader.on "complete",->
          resolve()
