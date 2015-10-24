gulp = require('gulp')
less = require('gulp-less')
coffee = require('gulp-coffee')
watch = require('gulp-watch')
path = require('path')

gulp.task 'less', ->
  l = less()
  l.on "error",(e)->
    console.error "[Error] compiling less:"
    console.error e.stack
    l.end()
  return gulp.src 'client/*.less'
    .pipe l
    .pipe gulp.dest('client/')

gulp.task 'coffee',->
  c = coffee()
  c.on "error",(e)->
    console.error "[Error] compiling coffee:"
    console.error e.stack
    c.end()
  return gulp.src "client/*.coffee"
    .pipe c
    .pipe gulp.dest("client/")

gulp.task 'watch', ->
  gulp.watch 'client/*.less', ['less']
  gulp.watch 'client/*.coffee', ['coffee']

gulp.task 'default', ['less','coffee','watch']
