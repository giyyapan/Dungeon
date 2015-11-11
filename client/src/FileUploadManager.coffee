EventEmitter = Suzaku.EventEmitter

Uploader = require './Uploader'
StatusMachine = require './StatusMachine'

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
      @completeFileCount = 0
      items = Array::map.call items,(i)-> i.webkitGetAsEntry()

      new StatusMachine()
      .status "initItems",(data,status)->
        status.next [items,null]

      .status "readDataTransferItems",([_items,unfinishedData],status)=>
        status.nextTo @_readDataTransferItems(_items,unfinishedData)

      .status "uploadFiles",([files,emptyFolderPaths,unfinishedData],status)=>
        console.log files,emptyFolderPaths
        totalSize = 0
        totalSize += f.size for f in files
        console.log "total file size is #{totalSize/1024/1024}MB"
        p = Promise.resolve()
        console.log "#{files.length} files to go"
        @fileCount += files.length
        files.forEach (file)=>
          p = p.then =>
            relativeDir = file.relativeDir[1..]
            console.log relativeDir
            dir = "#{currentDir}#{relativeDir}"
            @uploadFile dir,file
        for path in emptyFolderPaths
          p = p.then =>
            @_createEmptyFolder path
        p.then (e)->
          console.log "finished"
          if unfinishedData
            status.goto "readDataTransferItems",[null,unfinishedData]
          else
            status.goto "allFileUploaded"

      .status "allFileUploaded",(data,status)=>
        @emit "allFileUploaded"
        status.complete()

      .catch (e)=>
        console.error e.stack
        console.error "upload error"
        @emit "uploadError",e

    uploadFile:(currentDir,file)->
      new Promise (resolve, reject)=>
        console.log "start upload #{file.name}"
        uploader = new Uploader()
        uploader.upload(currentDir,file)
        uploader.on "sliceComplete",(slice,completedSlices,sliceCount)=>
          @emit "sliceComplete",
            file.name,
            completedSlices,
            sliceCount,
            @completeFileCount,
            @fileCount
        uploader.on "complete",=>
          @emit "fileUploaded"
          @completeFileCount += 1
          resolve()
        uploader.on "error",(e)->
          reject e

    _createEmptyFolder:(path)->
      new Promise (resolve,reject)=>
        console.log "/newFolder#{path}"
        $.get "/newFolder#{path}"
        .done (res)=>
          @emit "fileUploaded"
          resolve()
        .fail (e)->
          reject e

    _readDataTransferItems:(items,unfinishedData)->
      new StatusMachine()
      .status "start",->
        if unfinishedData
          @goto "continueReadFolderEntries",unfinishedData
        else
          files = items.filter (i)-> i and i.isFile
          files.forEach (i)-> i.relativeDir = '/' #'/' or '/movie' or '/movie/sf'
          @set
            files:files
            folders:items.filter (i)-> i and i.isDirectory
            emptyFolders:[]
            entries:[]
          @goto "handleNextFolder"

      .status "continueReadFolderEntries",(unfinishedData)->
        @set
          files:[]
          folders:unfinishedData.folders
          emptyFolders:[]
          entries:[]
          folder:unfinishedData.folder
          gatherCounter:unfinishedData.gatherCounter
          reader:unfinishedData.reader
        @goto "readFolderEntries"

      .status "handleNextFolder",()->
        folders = @get "folders"
        folder = folders.pop()
        if not folder
          console.log 1
          @goto "getOutput"
        else
          @set folder:folder
          @goto "travalseFolder"

      .status "travalseFolder",()->
        folder = @get 'folder'
        console.log "for folder #{folder.fullPath}"
        @set
          reader:folder.createReader()
          entries:[]
          gatherCounter:0
        @next()

      .status "readFolderEntries",(data,status)->
        folder = @get "folder"
        reader = @get "reader"
        entries = @get "entries"
        emptyFolders = @get "emptyFolders"
        gatherCounter = @get("gatherCounter") + 1
        @set gatherCounter:gatherCounter
        reader.readEntries (results)=>
          #console.warn "result:",(i for i in results)
          MAX_COUNT = 30
          if results.length > 0
            entries.push entry for entry in results
            if results.length > MAX_COUNT
              @goto "getFileAndFoldersFromEntries",false
            else
              @goto "readFolderEntries"
          else
            if gatherCounter is 1 #folder is empty
              emptyFolders.push folder
            #console.warn "set empty folders",@get "emptyFolders"
            @goto "getFileAndFoldersFromEntries"
        ,(err)=>
          console.error err
          @throw err

      .status "getFileAndFoldersFromEntries",(finished = true)->
        #console.error "~~~ get file and folders from entries. finished?",finished
        folder = @get "folder"
        files = @get "files"
        folders = @get "folders"
        entries = @get "entries"
        for i in entries when i
          if i.isFile
            i.relativeDir = folder.fullPath
            files.push i
          if i.isDirectory
            folders.push i
        if not finished
          @goto "getOutput",false
        else
          @goto "handleNextFolder"

      .status "getOutput",(finished = true)->
        Promise.all @get("files").map (f)->
          new Promise (resolve, reject)->
            f.file (file)->
              file.relativeDir = f.relativeDir
              resolve file
            ,(err)->
              console.error err
              resolve null
        .then (fileObjects)=>
          fileObjects = fileObjects.filter (f)-> f
          emptyFolderPaths = @get("emptyFolders").map (f)->f.fullPath
          #console.warn "fileObjects",fileObjects,"emptyFolderPaths",emptyFolderPaths
          if not finished
            unfinishedData =
              reader:@get("reader")
              folder:@get("folder")
              folders:@get("folders")
              gatherCounter:@get("gatherCounter")
            @complete [fileObjects,emptyFolderPaths,unfinishedData]
          else
            @complete [fileObjects,emptyFolderPaths]
          #free
          data = @getAll()
          for k,v in data
            data[k] = null
        .catch (e)=>
          console.error e
          @throw e

      .catch (err)->
        console.error err.stack

      .toPromise()
