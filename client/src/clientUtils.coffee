module.exports =
  SIZE:
    KB:1024
    MB:1024 * 1024

  getTimeBasedId:->
    time = Date.now().toString(36)
    rand = parseInt(Math.random() * 1000).toString(36)
    time + rand

  normalize:(path)->
    regexp = /\//g
    path.replace regexp,"/"
