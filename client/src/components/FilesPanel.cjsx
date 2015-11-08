require '../styles/filesPanel.less'

DirItem = require './DirItem'
FileItem = require './FileItem'
ImageItem = require './ImageItem'
DetailPanel = require './DetailPanel'
ContextMenu = require './ContextMenu'

module.exports =
  class FilesPanel extends React.Component
    @FileTypes:
      dir:"directory"
      image:"image"
      video:"video"
      compressed:"compressed"
      others:"others"

    constructor:()->
      super
      @state =
        currentDir:"/"
        items:[]
        error:false
        dirStack:[]
        message:'loading'
      @props.client.on "uploading",=>
        @setState message:"uploading"

    listDir:->
      $.get "/listDir#{@state.currentDir}",(data)=>
        console.log "got list data",data
        data.items.sort (a,b)->
          #sort with name, dirs before files
          (b.isDirectory - a.isDirectory) ||
          (a.name.charCodeAt(0) - b.name.charCodeAt(0))
        if data.items.length is 0
          message = 'empty'
        else
          message = null
        @setState {items:data.items, message:message}
      .fail (e)=>
        console.log "error",e
        @setState {error:true, message:'error'}

    changeDir:({newDir})->
      dirStack = @state.dirStack.map (d)-> d
      dirStack.push @state.currentDir
      @setState {currentDir:newDir,dirStack:dirStack,message:'loading'},=>
        @listDir()

    goBack:->
      # go back
      dirStack = @state.dirStack.map (d)-> d
      return if dirStack.length is 0
      dir = dirStack.pop()
      @setState {currentDir:dir,dirStack:dirStack,message:"loading"},=>
        @listDir()

    refresh:->
      @setState {message:"loading"}
      @listDir()

    componentDidMount:->
      @listDir()

    showDetail:({itemType,itemData})->
      @refs.detailPanel.showDetail itemType,itemData

    onMenuItemClick:({key,itemData})->
      action = key
      @refs[itemData.relativePath].doFileAction action

    handleItemEvent:(event,data)->
      if data.itemData
        data.itemType = @getItemType data.itemData
      switch event
        when 'enterDir'
          @changeDir data
        when 'showDetail'
          @showDetail data
        when 'showContextMenu'
          @refs.contextMenu.show data
        when 'update'
          @refresh()
        else
          console.error "unsupported event type!",event

    getItemType:(itemData)->
      ft = FilesPanel.FileTypes
      if itemData.isDirectory
        return ft.dir
      extName = itemData.name.split(".").pop()
      switch extName
        when "jpg","jpeg","png"
          ft.image
        else
          ft.others

    render:->
      <section className="files-panel">
        <DetailPanel ref="detailPanel"/>
        <ContextMenu ref="contextMenu" onItemClick={@onMenuItemClick.bind(@)}/>
        <header className="main-header">
          <button onClick={@refresh.bind(@)}>刷新</button>
          <button onClick={@goBack.bind(@)}>后退</button>
          <span className="current-path">{@state.currentDir}</span>
        </header>
        <div className="files-holder">
          {
            if @state.message
              <span className="message-holder">{
                switch @state.message
                  when "loading"
                    "载入中"
                  when "error"
                    "载入错误"
                  when "empty"
                    "没有文件"
                  when "uploading"
                    "上传中..."
              }</span>
          }
          {
            ft = FilesPanel.FileTypes
            for item in @state.items
              switch @getItemType item
                when ft.dir
                  <DirItem key={item.relativePath}
                    ref={item.relativePath} data={item}
                    onEvent={@handleItemEvent.bind(@)} />
                when ft.image
                  <ImageItem key={item.relativePath}
                    ref={item.relativePath} data={item}
                    onEvent={@handleItemEvent.bind(@)} />
                else
                  <FileItem key={item.relativePath}
                    ref={item.relativePath} data={item}
                    onEvent={@handleItemEvent.bind(@)} />
          }
        </div>
      </section>
