gulp = require('gulp')
less = require('gulp-less')
coffee = require('gulp-coffee')
watch = require('gulp-watch')
path = require('path')

gulp.task 'less', ->
  return gulp.src('client/*.less')
    .pipe(less())
    .pipe(gulp.dest('client/'))

gulp.task 'coffee',->
  return gulp.src("client/*.coffee")
    .pipe(coffee())
    .pipe(gulp.dest("client/"))

gulp.task 'watch', ->
  gulp.watch 'client/*.less', ['less']
  gulp.watch 'client/*.coffee', ['coffee']

gulp.task 'default', ['less','coffee','watch']
