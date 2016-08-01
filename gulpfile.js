'use strict'

var gulp = require('gulp'),
  del = require('gulp-rimraf');

gulp.task('cleanStatic', function() {
  return gulp.src('../bsyweb/static/web/', {read: false})
    .pipe(del({force: true}));
})

gulp.task('cleanTemplate', function () {
  return gulp.src('../bsyweb/templates/web/', {read: false})
    .pipe(del({force: true}));
});

gulp.task('copyAssets', function () {
  return gulp.src(['./dist/static/**/*', '!./dist/static/**/*.map'])
    .pipe(gulp.dest('../bsyweb/static/web/static'));
});

gulp.task('copyHtml', function () {
  return gulp.src(['./dist/*.html'])
    .pipe(gulp.dest('../bsyweb/static/web/'));
});

gulp.task('copyDjangoTemplate', function () {
  return gulp.src(['./dist/template/*.html'])
    .pipe(gulp.dest('../bsyweb/templates/web/'));
});

gulp.task('default', ['cleanStatic', 'cleanTemplate'],function () {
  gulp.start(['copyAssets', 'copyHtml', 'copyDjangoTemplate']);
});
