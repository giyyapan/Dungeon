require '../styles/filesPanel.less'
FileItem = require './FileItem'
FileNameItem = require './FileNameItem'

module.exports =
  class ImageItem extends FileItem
    render:->
      src = "/imgPreview#{@props.data.relativePath}"
      <div className="file-panel-item image-item"
        onClick={@handleClick.bind(@)}
        onContextMenu={@handleContextMenu.bind(@)} >

        <div className="icon">
          <img src={src} className="preview"/>
        </div>

        <FileNameItem ref="fileName"
          name={@props.data.name}
          onChange={@handleRename.bind(@)} />
      </div>
