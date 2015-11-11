class Status extends Suzaku.EventEmitter
  constructor:(@name,@handler)->
    super
    @data = null
    @isErrorStatus = false
    @name = @name.toString()
    @nextStatus = null
  run:(data)->
    console.log "run status",@name
    @emit "start"
    try
      @handler.apply this,[data,this]
    catch e
      @panic e
  nextTo:(promise)->
    promise
    .then (data)=>
      @next data
    .catch (e)=>
      @throw e,{fromPromise:promise}
      Promise.reject()
  queryData:(promise,dataName = "#{@name}Data",notEmpty = false)->
    promise
    .then (data)=>
      if notEmpty and (not data or data.length) is 0
        @throw new Error "cannot find data #{dataName}"
      else
        @set dataName,data
        @next data
    .catch (e)=>
      @throw e,{fromPromise:promise,fromQueryData:true}
      Promise.reject()
  next:(data)->
    @emit "next",data
  goto:(name,data)-> @emit "goto",name,data
  throw:(error,data)-> @emit "throw",error,data
  panic:(error,data)-> @emit "panic",error,data
  complete:(data)-> @emit "complete",data
  set:(key,value)->
    console.log "set",key,value
    if key is undefined and value is undefined
      console.error "[Status] wrong arguments in Status.set key:'#{key}',value:'#{value}'"
    if typeof key is "object" and value is undefined
      for k,v of key
        @data[k] = v
    else
      @data[key] = value
  save:(key,value)->
    @set key,value
  get:(key)->
    if @data[key] is undefined
      console.error "[Status] try to get an not defined key:'#{key}' in #{@name}"
    @data[key]
  getAll:->
    @data
  load:(key)->
    @get key

module.exports =
  class StatusMachine extends Suzaku.EventEmitter
    @Status = Status
    constructor:(autoStart = true)->
      super
      @isActive = true
      @dataStorage = {}
      @statusCount = 0
      @statusDict = {}
      @statusList = []
      @lastStatus = null
      @lastNormalStatus = null
      @lastErrorStatus = null
      @errorHandlers = {}
      if autoStart
        process.nextTick =>
          @start()
    start:(data)->
      if not @statusList[0]
        return console.error "[StatusMachine] no vailid status"
      @statusList[0].run(data)
    status:(args...)->
      name = null
      if typeof args[0] is "function"
        [handler] = args
      else
        [name,handler] = args
      if not name
        name = @statusList.length + 1
      s = new Status name,handler
      s.data = @dataStorage
      @statusDict[s.name] = s
      if @statusList[@statusList.length - 1]
        @statusList[@statusList.length - 1].nextStatus = s
      @statusList.push s
      @statusCount = @statusList.length
      @_bindStatusEvents s
      this
    catch:(args...)->
      if typeof args[0] is "function"
        [handler] = args
        statusName = "_all"
      else
        [statusName, handler] = args
        if not @statusDict[statusName]
          console.error "[StatusMachine] can't catch error for not exists status #{statusName}"
          return false
      if @errorHandlers[statusName]
        console.error "[StatusMachine] already has a error handler for status #{statusName}"
        return false
      s = new Status "errorHandler:#{statusName}",handler
      s.isErrorStatus = true
      s.data = @dataStorage
      @errorHandlers[statusName] = s
      @_bindStatusEvents s
      if statusName is "_all"
        s.next = null
      else
        s.next = (data)=>
          if @errorHandlers["_all"]
            @errorHandlers["_all"].run data,@lastNormalStatus.name
          else
            console.error "[StatusMachine] no next error handler for #{s.name}"
      s.nextTo = null
      this
    complete:(data)->
      return if not @isActive
      @isActive = false
      @emit "complete",data
      this
    toPromise:->
      new Promise (resolve,reject)=>
        @on "complete",(data)->
          resolve data
        @on "panic",(e)->
          reject e
    panic:(e)->
      @emit "error",e
      @emit "panic",e
      this
    _bindStatusEvents:(status)->
      status.on "start",=>
        @lastStatus = status
        if status.isErrorStatus
          @lastErrorStatus = status
        else
          @lastNormalStatus = status
      status.on "next",(data)=>
        if not @isActive
          return console.error "[StatusMachine] try to call next for #{status.name} after complete"
        #console.log "nextStatus",status.nextStatus
        if status.nextStatus
          status.nextStatus.run data
        else
          @complete data
      status.on "goto",(name,data)=>
        if not @isActive
          return console.error "[StatusMachine] try to goto #{name} for #{status.name} after complete"
        s = @statusDict[name]
        if not s
          console.error "[StatusMachine] no status named #{name}"
          e = new Error "invailid status name #{name} to go from #{status.name}",500
          e.status = status
          @panic e
        else
          s.run data
      status.on "throw",(error,data)=>
        if not @isActive
          return console.error "[StatusMachine] try to true #{error} for #{status.name} after complete"
        handlerStatus = @errorHandlers[status.name] or @errorHandlers["_all"]
        if not handlerStatus
          e = new Error "unhandled error from status #{status.name}",500
          e.status = status
          @panic e
        else
          handlerStatus.run error,status.name,(data or {})
      status.on "panic",(e)=>
        @panic e
      status.on "complete",(data)=>
        @complete data
    onComplete:(handler)->
      @on "complete",handler
      this
    onPanic:(handler)->
      @on "panic",handler
      this

#==========================
# expamples:
#==========================
# new StatusMachine()
# .status "s1",->
#   console.log 1
#   setTimeout =>
#     @next 'im data'
#   ,1
# .status "s2",(data)->
#   console.log 1,arguments
#   console.log data,2
#   @goto 4
# .status "s3",->
#   console.log 3
#   @complete()
# .status ->
#   console.log 4
#   @throw new Error "test error"
# .catch (e,statusName,data)->
#   console.log "error"
#   console.log statusName,e,data
#   @goto "s3"
# .catch "4",->
#   console.log "4 status error handler",arguments
# .on "complete",->
#   console.log "complete"
