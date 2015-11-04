require './styles/global.less'

FileUploader = require './FileUploader'
TestComponent = require './TestComponent'

class MainContainer extends React.Component
  constructor:()->
    console.log "run container constructor"
  render:->
    <div >
      <TestComponent text={"111"} text2="222" obj={{key:"val"}}/>
    </div>

class DungeonClient
  constructor:()->
    @fileUploader = new FileUploader
    console.log "inited"
    window.addEventListener "dragover",(e)=>
      console.log "over"
      e.preventDefault()
    window.addEventListener "dragleave",(e)=>
      console.log "leave"
      e.preventDefault()
    window.addEventListener "drop",(e)=>
      e.stopPropagation()
      e.preventDefault()
      files = e.dataTransfer.files
      @handleUploadFiles files
    @listFiles()
    ReactDOM.render <MainContainer />,$("#main-container")[0]

  listFiles:(dir = "")->
    $.get "/list/#{dir}",(data)->
      console.log "got list data",data
    .fail (e)->
      console.log "error",e

  handleUploadFiles:(files)->
    totalSize = 0
    totalSize += f.size for f in files
    console.log "total file size is #{totalSize/1024/1024}MB"
    p = Promise.resolve()
    Array::forEach.call files,(f)=>
      p = p.then =>
        @uploadFile(f)
    p.then (e)->
      console.log "finished"
    .catch (e)->
      console.error e.stack
      console.error "upload error"

  uploadFile:(file)->
    new Promise (resolve, reject)->
      console.log "start upload #{file.name}"
      uploader = new FileUploader()
      uploader.on "complete",->
        resolve()
      uploader.upload(file)

new DungeonClient()
