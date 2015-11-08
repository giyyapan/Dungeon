require '../styles/detailPanel.less'

module.exports =
  class DetailPanel extends React.Component
    constructor:()->
      super
      @state = {itemData:null}

    showDetail:(type,itemData)->
      console.log "showDetail",type,itemData
      @setState {itemType:type, itemData:itemData}

    handleInnerClick:(evt)->
      evt.stopPropagation()
      evt.preventDefault()

    dissmiss:(evt)->
      @setState {itemData:null}

    render:->
      itemData = @state.itemData
      if not itemData
        return <section className="hidden"></section>
      <section className="detail-panel popup-layer" onClick={@dissmiss.bind(@)}>
        <button className="close-btn" onClick={@dissmiss.bind(@)}>×</button>
        {
          ft = require('./FilesPanel').FileTypes
          switch @state.itemType
            when ft.image
              src = "/viewImage#{itemData.relativePath}"
              <img className="content" src={src} onClick={@handleInnerClick.bind(@)}/>
            when ft.others
              <div className="content" onClick={@handleInnerClick.bind(@)}>
                <p >{"no preview for this file"}</p>
              </div>
        }
        <span className="name">{@state.itemData.name}</span>
      </section>
