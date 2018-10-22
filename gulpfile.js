var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var babel = require('gulp-babel')
var cached = require('gulp-cached')
var remember = require('gulp-remember')
var browserSync = require('browser-sync').create()
var webpack = require('webpack-stream')
var named = require('vinyl-named')

/*gulp.task('say',function () {
    console.log("hi")
})*/


var sassGlob = 'src/sass/*.scss';
var jsGlob = 'src/es6/*.js'


gulp.task('sass', function() {
  return gulp.src(sassGlob)
    .pipe(cached('sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(remember('sass'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream())
})

gulp.task('js', function() {
  return gulp.src(jsGlob)
    .pipe(named())
    /*.pipe(webpack({
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'stage-0'],
              plugins: [require('@babel/polyfill'), 'transform-runtime']
            }
          }
        }]
      }
    }))*/
    .pipe(babel())
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream())
})

// gulp.task('default','sass',function () {
    /*browserSync.init({
        server:'./src'
    })*/

    gulp.task('kava',['sass','js'])

    var watcher = gulp.watch(sassGlob, ['sass'])

    watcher.on('change', function(event) {
      if (event.type === 'delete') {
        delete cached.caches.sass[event.path]
        remember.forget('sass', event.path)
      }
    })

    var watcherJS = gulp.watch(jsGlob, ['js'])

    watcherJS.on('change', function(event) {
      if (event.type === 'delete') {
        delete cached.caches.js[event.path]
        remember.forget('js', event.path)
      }
    })

    //gulp.watch('src/html/*.html').on('change', browserSync.reload)
// })




