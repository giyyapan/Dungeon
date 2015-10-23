class DungeonClient
  constructor:()->
    console.log "inited"
    $("#drag-section").on "mouseup",->
      alert "mouse up"

document.onload = -> new DungeonClient
