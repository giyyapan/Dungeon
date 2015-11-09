require '../styles/filesPanel.less'
FileItem = require './FileItem'
FileNameItem = require './FileNameItem'

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

        <FileNameItem ref="fileName"
          name={@props.data.name}
          onChange={@handleRename.bind(@)} />
      </div>
