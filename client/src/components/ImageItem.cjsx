require '../styles/filesPanel.less'
FileItem = require './FileItem'

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
        <p className="name" tilte={@props.data.name}>{@props.data.name}</p>

      </div>
