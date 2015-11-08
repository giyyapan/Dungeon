require '../styles/menus.less'

module.exports =
  class ContextMenu extends React.Component
    @NameDict:
      'rename':'重命名'
      'download':'下载'
      'saveAs':'另存为'
      'delete':'删除'
      'newDir':'创建文件夹'

    constructor:()->
      super
      @state = {}

    show:({menuItems,itemData,position})->
      @setState items:menuItems,itemData:itemData,position:position

    handleListItemClick:(key,evt)->
      evt.stopPropagation()
      console.log "menu item clicked:",key
      @props.onItemClick itemData:@state.itemData,key:key
      @dismiss()

    dismiss:(evt)->
      @setState items:null

    render:->
      if not @state.items or @state.items.length is 0
        return <section className="hidden"></section>

      pos = @state.position

      <section className="menu-wrapper popup-layer" onClick={@dismiss.bind(@)}>
        <ul className="menu item-context-menu" style={left:pos.x,top:pos.y}>
          {
            for key in @state.items
              <li key={key} onClick={@handleListItemClick.bind(@,key)}>
                {ContextMenu.NameDict[key]}
              </li>
          }
        </ul>
      </section>
