require '../styles/filesPanel.less'

module.exports =
  class FileNameItem extends React.Component
    constructor:()->
      super
      @state = {editing:false}
    edit:->
      @setState editing:true,=>
        @refs.input.focus()
        @refs.input.select()

    handleKeyDown:(evt)->
      switch evt.keyCode
        when Suzaku.Key.enter
          console.log evt.target.value
          @props.onChange newName:evt.target.value
          @setState editing:false

    handleClick:(evt)->
      evt.stopPropagation()

    handleBlur:(evt)->
      @setState editing:false

    render:->
      if @state.editing
        <input ref="input" className="file-name-input" type="text"
          onClick={@handleClick.bind(@)}
          onKeyDown={@handleKeyDown.bind(@)}
          onBlur={@handleBlur.bind(@)}
          defaultValue={@props.name} />
      else
        <p className="name">{@props.name}</p>
