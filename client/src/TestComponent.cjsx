require './styles/testComponent.less'

module.exports =
  class TestComponent extends React.Component
    constructor:()->
      @state = {text:"!!!!"}
    render:->
      <div className="test-component">
        Test Component
        <p>props:{JSON.stringify @props}</p>
        <p>state:{JSON.stringify @state}</p>
        {<p key={n}>This line has been printed {n} times</p> for n in [1..5]}
      </div>
