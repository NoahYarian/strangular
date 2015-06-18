var gulp = require('gulp'),
    $    = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'del', 'wiredep', 'main-bower-files', 'browser-sync']
    });

gulp.task('clean', function () {
  $.del('public');
});

gulp.task('bower', function () {
  gulp
    .src($.mainBowerFiles('**/*.js'))
    .pipe($.concat('build.js'))
    .pipe(gulp.dest('public/lib'));
  gulp
    .src($.mainBowerFiles('**/*.css'))
    .pipe($.concat('build.css'))
    .pipe(gulp.dest('public/lib'));
});

gulp.task('jade:dev', function () {
  gulp
    .src(['src/**/*.jade', '!src/**/_*.jade'])
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('jade:prod', function () {
  gulp
    .src(['src/**/*.jade', '!src/**/_*.jade'])
    .pipe($.jade())
    .pipe(gulp.dest('public'));
});

gulp.task('sass:dev', function () {
  gulp
    .src('src/_styles/main.scss')
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:prod', function () {
  gulp
    .src('src/_styles/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'compressed'
      })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['> 1%'],
      cascade: true
    }))
    //.pipe($.minifyCss({compatibility: 'ie8'}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

gulp.task('js:dev', function () {
  gulp.src('src/**/*.js')
    .pipe($.babel())
    .pipe(gulp.dest('public'));
});

gulp.task('js:prod', function () {
  gulp.src('src/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.uglify())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public'));
});

// gulp.task('uglify', function() {
//   gulp.src('src/**/*.js')
//     .pipe(uglify())
//     .pipe(gulp.dest('public'));
// });

// gulp.task('autoprefixer', function () {
//   gulp.src('public/css/main.css')
//     .pipe($.autoprefixer({
//       browsers: ['> 1%'],
//       cascade: false
//     }))
//     .pipe(gulp.dest('public/css'));
// });

// gulp.task('concatcss', function() {
//   var cssFiles = ['/bower_components/**/*'];
//   gulp.src($.mainBowerFiles().concat(cssFiles))
//     .pipe($.filter('*.css'))
//     .pipe($.concat('build.css'))
//     //.pipe($.uglify())
//     .pipe(gulp.dest('public/lib'));
// });

gulp.task('browser-sync', function() {
    $.browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
});

gulp.task('build:prod', ['jade:prod', 'sass:prod', 'js:prod', 'bower']);


gulp.task('build:dev', ['jade:dev', 'sass:dev', 'js:dev', 'bower']);

gulp.task('serve', ['build:dev'], function () {

    // gulp.watch(['src/**/*.jade'], ['jade:dev'])
    // gulp.watch(['src/**/*.scss'], ['sass:dev'])
    // gulp.watch(['src/**/*.js'], ['js:dev'])

    gulp.watch(['src/**/*'], ['build:dev']).on('change', $.browserSync.reload);
});

gulp.task('cleana', ['clean'], function() {
  gulp.start('build:dev');
});

gulp.task('default', ['clean'], function () {
  gulp.start('serve');
});
