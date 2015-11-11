module.exports =
  class MessageHolder extends React.Component
    render:->
      content = do =>
        switch @props.message
          when "loading" then "载入中"
          when "error" then "载入错误"
          when "empty" then "没有文件"
          when "uploadError"
            <span className="error">上传错误 QAQ</span>
          when "uploadComplete"
            <span className="success">上传成功 =w=</span>
          when "uploading"
            md = @props.messageData
            if not md
              <span>上传中...</span>
            else
              <span>
                正在上传文件
                <b className="filename">{md.filename}</b>
                <b className="percentage">{md.percentage}%</b>
                完成文件数
                <b>{md.completeFileCount}/{md.fileCount}</b>
              </span>

      <p className={
        if not @props.message then "message-holder hidden"
        else "message-holder"} >
        {content}
      </p>
