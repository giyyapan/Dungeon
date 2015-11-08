require '../styles/filesPanel.less'
FileItem = require './FileItem'

module.exports =
  class DirItem extends FileItem
    handleClick:(e)->
      @props.onEvent "enterDir",{newDir:@props.data.relativePath}

    render:->
      <div className="file-panel-item dir-item"
        onClick={@handleClick.bind(@)}
        onContextMenu={@handleContextMenu.bind(@)}>

        <div className="icon">
          <span className="preview"></span>
        </div>
        <p className="name" tilte={@props.data.name}>{@props.data.name}</p>

      </div>
