crypto = require 'crypto'

module.exports =
  getFilePathHash:(filePath)->
    md5 = crypto.createHash "md5"
    md5.update(filePath)
    md5.digest('hex')
