require '../styles/filesPanel.less'

DirItem = require './DirItem'
FileItem = require './FileItem'
ImageItem = require './ImageItem'
DetailPanel = require './DetailPanel'
ContextMenu = require './ContextMenu'
MessageHolder = require './MessageHolder'
utils = require '../clientUtils'

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
        currentDir:"/" # .e.g : "/" "/movie" "/movie/sf"
        items:[]
        error:false
        dirStack:[]
        message:'loading'
      @props.client.on "uploading",=>
        @setState message:"uploading"

    listDir:(showMessage = true)->
      if @_isLoading then return
      @_isLoading = true
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
        @_isLoading = false
        if showMessage
          @setState {items:data.items, message:message}
          setTimeout =>
            @setState message:null
          ,3000
        else
          @setState {items:data.items}
      .fail (e)=>
        @_isLoading = false
        console.log "error",e
        if showMessage
          @setState {error:true, message:'error'}

    enterDir:({newDir})->
      dirStack = @state.dirStack.map (d)-> d
      dirStack.push @state.currentDir
      @changeDir newDir,dirStack

    changeDir:(dir,dirStack)->
      state = {currentDir:dir}
      showMessage = if @state.message then false else true
      if showMessage
        state.message = 'loading'
      if dirStack
        state.dirStack = dirStack
      @setState state,=>
        @listDir showMessage

    goBack:->
      # go back
      dirStack = @state.dirStack.map (d)-> d
      return if dirStack.length is 0
      dir = dirStack.pop()
      @changeDir dir,dirStack

    refresh:->
      @setState {message:"loading"}
      @listDir()

    componentDidMount:->
      @listDir()

    showMessage:(msg,data,timeout)->
      msgId = utils.getTimeBasedId()
      @setState message:msg,messageData:data,messageId:msgId
      if timeout
        setTimeout =>
          @setState(message:null) if @state.messageId is msgId
        ,timeout

    _showItemDetail:({itemType,itemData})->
      @refs.detailPanel.showDetail itemType,itemData

    createNewFolder:->
      name = window.prompt "请输入名称："
      if name.indexOf("/") > -1
        return alert "文件名不能含有'/'"
      return if not name
      $.get "/newFolder#{@state.currentDir}/#{name}"
      .done (res)=>
        @listDir()
      .fail (e)->
        console.error e

    handleMenuItemClick:({key,itemData})->
      action = key
      if itemData
        @refs[itemData.relativePath].doFileAction action
      else
        switch action
          when 'newFolder'
            @createNewFolder()
          when 'refresh'
            @refresh()

    handleContextMenu:(evt)->
      console.log "contextMenu"
      evt.stopPropagation()
      evt.preventDefault()
      @refs.contextMenu.show
        menuItems:['newFolder','refresh']
        itemData: null
        position:
          x:evt.pageX
          y:evt.pageY - window.scrollY

    handleItemEvent:(event,data)->
      if data.itemData
        data.itemType = @getItemType data.itemData
      switch event
        when 'enterDir'
          @enterDir data
        when 'showDetail'
          @_showItemDetail data
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
        <ContextMenu ref="contextMenu" onItemClick={@handleMenuItemClick.bind(@)}/>
        <header className="main-header">
          <button onClick={@refresh.bind(@)}>刷新</button>
          <button onClick={@goBack.bind(@)}>后退</button>
          <span className="current-path">{@state.currentDir}</span>
        </header>
        <div className="files-holder" onContextMenu={@handleContextMenu.bind(@)}>
          <MessageHolder message={@state.message} messageData={@state.messageData}/>
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
          <div className="clearfix"></div>
        </div>
      </section>
