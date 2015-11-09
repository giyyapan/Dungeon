EventEmitter = Suzaku.EventEmitter

size =
  kb:1024
  mb:1024 * 1024

module.exports =
  class Uploader extends EventEmitter
    constructor:()->
      super
      @sliceSize = 3 * size.mb
      #maxThreads = 3
      @maxThreads = 2
      @file = null
      @availThreads = 0
      @sliceCount = 0
      @apiPath = null
      @currentSlice = 0
      @currentDir = "/"

    upload:(@currentDir,@file)->
      #check
      xhr = new XMLHttpRequest()
      xhr.open "GET","/check#{@currentDir}?filename=#{@file.name}&size=#{@file.size}"
      xhr.send()
      xhr.onreadystatechange = (evt)=>
        if xhr.readyState is 4
          if xhr.status is 200
            @doUpload()
          else
            console.error "preCheck error for file:",@file
            @emit "error",xhr.responseText

    doUpload:->
      # r = new FileReader()
      # r.readAsBinaryString @file
      # r.onload = (e)=>
      #   console.log r.result
      #   @showResult r.result
      #   r = null
      if @file.size > 0
        @sliceCount = Math.ceil(@file.size/@sliceSize)
      else
        @sliceCount = 1
      @availThreads = @maxThreads
      console.log "sliceCount is #{@sliceCount}"
      @currentSlice = 0
      console.log "got file #{@file.name} total size #{@file.size}"
      console.log "uploading using sliceSize #{@sliceSize} and #{@maxThreads} threads"

      @on "sliceProgress",(slice,percentage)=>
        #TODO calculate total progress
        @emit "progress"

      @on "sliceComplete",(slice)=>
        @availThreads += 1
        if slice < (@sliceCount - 1)
          #still has slice to upload
          @uploadNextSlice()
        else if @availThreads is @maxThreads
          #all slice has been uploaded
          @emit "complete"

      @uploadNextSlice()

    uploadNextSlice:()->
      return unless @currentSlice < @sliceCount and @availThreads > 0
      @availThreads -= 1
      @uploadSlice @currentSlice
      @currentSlice += 1
      @uploadNextSlice()

    uploadSlice:(slice)->
      return unless slice < @sliceCount
      name = @file.name
      if @file.size > 0
        start = slice * @sliceSize
        stop = (slice + 1) * @sliceSize - 1
        if stop > (@file.size - 1) then stop = @file.size - 1
      else
        start = stop = 0
      #console.log "upload slice",slice,start,"~",stop,"availThreads #{@availThreads}"
      bolb = @file.slice start,stop + 1

      reader = new FileReader()
      reader.readAsBinaryString bolb
      reader.onloadend = (e)=>
        if reader.readyState is FileReader.DONE
          @emit "onload"
          #@showResult reader.result
          @sendAsBinary xhr,reader.result
          #@showResult reader.result
          reader = null

      xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (evt)=>
        if evt.lengthComputable
          percentage = Math.round((evt.loaded * 100) / evt.total);
          @emit "sliceProgress",slice,percentage
      xhr.onreadystatechange = (evt)=>
        if xhr.readyState is 4
          if xhr.status is 200
            @emit "sliceComplete",slice
          else
            @emit "error",xhr.responseText
      url = "/upload#{@currentDir}?start=#{start}&stop=#{stop}&filename=#{name}"
      xhr.open "POST",url

    sendAsBinary:(xhr, data)->
      @xhr = new XMLHttpRequest()
      parts = new Uint8Array(data.length)
      if data.length > 0
        parts = new Uint8Array(data.length)
        for i in [0..data.length-1]
          parts[i] = data[i].charCodeAt(0)
        xhr.send(parts.buffer)
      else
        xhr.send('')

    showResult:(res, label)->
      markup = []
      for n in [0..(res.length-1)]
        aByte = res.charCodeAt(n)
        byteStr = aByte.toString(16)
        if byteStr.length < 2
          byteStr = "0" + byteStr
        markup.push(byteStr)
      console.log markup.join(" ")
