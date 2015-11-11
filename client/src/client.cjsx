require './styles/global.less'

#components
FilesPanel = require './components/FilesPanel'
#modules
FileUploadManager = require './FileUploadManager'

#关于components方法的命名
#
# - 用于交付给子组件触发的 props.interface 采用 on 开头的命名
#   如： <ChildItem onEvent={xxx}>
#
# - 用于处理 props.interface 的方法采用 handle 开头的命名
#   如： <ChildItem onEvent={@handleItemEvent}>
#   如果可以直接调用已经存在的, 则允许直接调用公开方法
#   如： <RefreshBtn onClick={@refresh}>
#
# - 其他自定义public方法命名随意, 但是不可以和上面两条冲突
#
# - 其他自定义private方法 (除了上三条之外的private方法) 以下划线开头


class DungeonClient extends Suzaku.EventEmitter
  constructor:()->
    super
    @uploadManager = new FileUploadManager this

    window.addEventListener "dragover",(evt)=>
      console.log "over"
      evt.preventDefault()
    window.addEventListener "dragleave",(evt)=>
      console.log "leave"
      evt.preventDefault()
    window.addEventListener "drop",(evt)=>
      evt.stopPropagation()
      evt.preventDefault()
      currentDir = @filesPanel.state.currentDir
      dt = evt.dataTransfer
      console.log dt.items
      if dt.getData('text/html')
        @uploadManager.handleDragHtml currentDir,dt.getData('text/html')
        @emit "uploading"
      else if dt.items.length > 0
        console.log "length::",dt.items.length
        @uploadManager.handleDragFiles currentDir,dt.items
        @emit "uploading"
      else
        console.log "drop event unhandled"

    @uploadManager.on "fileUploaded",=>
      @filesPanel.listDir false

    @uploadManager.on "allFileUploaded",=>
      setTimeout =>
        @filesPanel.showMessage "uploadComplete",null,3000
      ,1

    _lastPercentage = 0
    @uploadManager.on "sliceComplete",
      (filename,completedSlices,sliceCount,completeFileCount,fileCount)=>
        now = Date.now()
        percentage = Math.round (completedSlices/sliceCount)*100
        if percentage != _lastPercentage
          _lastPercentage = percentage
          @filesPanel.showMessage "uploading",
            filename:filename
            percentage:percentage
            completeFileCount:completeFileCount
            fileCount:fileCount

    @uploadManager.on "uploadError",(e)=>
      @filesPanel.showMessage "uploadError"

    @filesPanel = ReactDOM.render <FilesPanel client={this}/>,$("#main-container")[0]

    console.log "inited Dungeon client"

new DungeonClient()
