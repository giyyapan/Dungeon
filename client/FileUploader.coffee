EventEmitter = Suzaku.EventEmitter

module.exports =
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
