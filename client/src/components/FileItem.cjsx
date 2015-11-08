require '../styles/filesPanel.less'

module.exports =
  class FileItem extends React.Component
    contextMenuItems:['download','saveAs','rename','delete']

    doFileAction:(action)->
      switch action
        when 'download'
          console.log "download"
        when 'saveAs'
          console.log "saveAs"
        when 'rename'
          console.log "rename"
        when 'delete'
          console.log "delete"
          if @props.data.isDirectory
            msg = "确定要删除文件夹 #{@props.data.name} 及其所有文件吗？"
          else
            msg = "确定要删除文件 #{@props.data.name} 吗？"
          return if not window.confirm msg
          url = "/delete#{@props.data.relativePath}"
          @_callApi "get",url,@props.onEvent.bind(null,'update')
        else
          console.error "unsupported action type:",action

    _callApi:(method="get",url,callback)->
      method = method.toUpperCase()
      $.ajax
        method:method
        url:url
      .done (res)->
        callback res
      .fail (e)->
        console.error e

    handleClick:(e)->
      @props.onEvent "showDetail",{itemData:@props.data}

    handleContextMenu:(evt)->
      evt.preventDefault()
      evt.stopPropagation()
      rect = ReactDOM.findDOMNode(@).getBoundingClientRect()
      console.log evt.pageX,evt.pageY
      @props.onEvent "showContextMenu",
        menuItems: @contextMenuItems
        itemData: @props.data
        position: x:evt.pageX,y:evt.pageY

    render:->
      <div className="file-panel-item file-item"
        onClick={@handleClick.bind(@)}
        onContextMenu={@handleContextMenu.bind(@)} >

        <div className="icon">
          <div className="preview">File:</div>
        </div>
        <p className="name" tilte={@props.data.name}>{@props.data.name}</p>

      </div>
