var gulp = require('gulp');
var connect = require('gulp-connect');
var gulpOpen = require('gulp-open');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
// var sass = require('gulp-sass');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var os = require('os');

//mac chrome: "Google chrome",
var browser = os.platform() === 'linux' ? 'Google chrome' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));
var pkg = require('./package.json');

gulp.task('connect', function(){
  connect.server({
    host: 'localhost',
    port: 3000,
    livereload: true
  });
});

//js处理任务
gulp.task('js', function(){
  gulp.src('src/js/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify({
      mangle: true,    //是否修改变量名
      compress: true  //是否完全压缩
    }))
    .pipe(gulp.dest('dist/js/'));  //处理完后输出
});

//css处理任务
gulp.task('css', function(){
  gulp.src('src/css/less/*.css')
    .pipe(less())  //sass一样的语法
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css/'));
  gulp.src('src/css/*.css')
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('img', function(){
  gulp.src('src/img/')
    .pipe(gulp.dest('dist/img/'));
});

gulp.task('open', function (done) {
    gulp.src('dist/')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:3000/dist/app'
        }))
        .on('end', done);
});

gulp.task('open-server', function (done) {
    gulp.src('src/')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:3000/src/app'
        }))
        .on('end', done);
});

gulp.task('html', function(){
  gulp.src('src/app/*.html')
    .pipe(gulp.dest('dist/app/'))
    .pipe(connect.reload());
});

gulp.task('clean', function (done) {
  gulp.src(['dist'])
    .pipe(clean())
    .on('end', done);
});

gulp.task('watch', function(){
  gulp.watch('src/css/*.css', ['html']);
  gulp.watch('src/js/*.js', ['html']);
  gulp.watch('src/app/*.html', ['html']);
});

//发布
gulp.task('dev', ['connect','js','css','html', 'watch','open']);

//开发
gulp.task('server', ['connect', 'watch','open-server']);
