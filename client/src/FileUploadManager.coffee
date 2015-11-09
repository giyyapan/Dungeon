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

    handleDragFiles:(currentDir,items)->
      @_readDataTransferItems items
      .then ([files,emptyFolderPaths])=>
        console.log files,emptyFolderPaths
        totalSize = 0
        totalSize += f.size for f in files
        console.log "total file size is #{totalSize/1024/1024}MB"
        p = Promise.resolve()
        console.log "#{files.length} files to go"
        files.forEach (file)=>
          p = p.then =>
            relativeDir = file.relativeDir[1..]
            console.log relativeDir
            dir = "#{currentDir}#{relativeDir}"
            @uploadFile dir,file
        for path in emptyFolderPaths
          p = p.then =>
            @_createEmptyFolder path
        p.then (e)=>
          console.log "finished"
          @emit "fileUploaded"
      .catch (e)=>
        console.error e.stack
        console.error "upload error"
        @emit "uploadError",e

    uploadFile:(currentDir,file)->
      new Promise (resolve, reject)->
        console.log "start upload #{file.name}"
        uploader = new Uploader()
        uploader.upload(currentDir,file)
        uploader.on "complete",->
          resolve()
        uploader.on "error",(e)->
          reject e

    _createEmptyFolder:(path)->
      new Promise (resolve,reject)->
        console.log "/newFolder#{path}"
        $.get "/newFolder#{path}"
        .done (res)=>
          resolve()
        .fail (e)->
          reject e

    _readDataTransferItems:(items)->
      console.log items.length
      items = Array::map.call items,(i)-> i.webkitGetAsEntry()
      files = items.filter (i)-> i.isFile
      files.forEach (i)-> i.relativeDir = '/' #'/' or '/movie' or '/movie/sf'
      folders = items.filter (i)-> i.isDirectory
      emptyFolders = []

      new Promise (resolve, reject)->
        iter = ()->
          # get one folder
          folder = folders.pop()
          if not folder
            #resolve when theres no more folder remain
            return resolve()
          reader = folder.createReader()
          console.log "for folder #{folder.fullPath}"
          new Promise (_resolve)->
            # get all entries from the folder
            entries = []
            gatherCounter = 0
            gatherEntriesFromFolder = ->
              gatherCounter += 1
              reader.readEntries (results)->
                console.log "result:",results
                if results.length > 0
                  entries.push entry for entry in results
                  gatherEntriesFromFolder()
                else
                  if gatherCounter is 1 #folder is empty
                    emptyFolders.push folder
                  _resolve entries
              ,(err)->
                reject err
            gatherEntriesFromFolder()
          .then (entries)->
            # travalse the entries and get files and folders
            for i in entries
              if i.isFile
                i.relativeDir = folder.fullPath
                files.push i
              if i.isDirectory
                folders.push i
            iter() # go with next folder
        iter() #start

      .then ->
        #change all files object
        Promise.all files.map (f)->
          new Promise (resolve, reject)->
            f.file (file)->
              file.relativeDir = f.relativeDir
              resolve file
            ,(err)->
              reject err
      .then (fileObjects)->
        emptyFolderPaths = emptyFolders.map (f)->f.fullPath
        Promise.resolve [fileObjects,emptyFolderPaths]
