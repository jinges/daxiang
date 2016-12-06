var gulp = require('gulp'),
    concat = require('gulp-concat'),
    contentIncluder = require('gulp-content-includer'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    fs = require('fs'),
    babel = require('gulp-babel'),
    ejs = require('gulp-ejs'),
    opn = require('opn');

var paths = {
    origin:{
        html: ['app/*.html',
                'app/channel/*.html'],
        sass: 'app/sass/*.scss',
        template: 'app/template/*.ejs',
        images: 'ap/img/*.*',
        js: [
            'app/js/libs/zepto.js',
            'app/js/libs/ejs.js',
            'app/js/config.js',
            'app/js/fetch.js', 
            'app/js/alert.js',
            'app/js/wxcode.js',
            'app/js/render.js',
            'app/js/storage.js',
            'app/js/search.js',
            'app/js/order.js',
            'app/js/channel.js',
            'app/js/updaterebatephone.js',
            'app/js/registchannel.js',
            'app/js/withdrawals.js'
            ]
    },
    tmp_root: 'build'
}

var origin_root = paths.origin.root;

function logError(err) {
    console.log(err.toString());
    this.emit('end');
}

var validateResources = function (resources) {
    resources.forEach(function (resource) {
        if(!resource.match(/\*/) && !fs.existsSync(resource)) {
            throw resource + "not found !";
        }
    });
}

gulp.task('clean', function (cb) {
    del( paths.tmp_root, cb);
});

gulp.task('concat', function(){
    gulp.src(paths.origin.html)
        .pipe(contentIncluder({
            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g,
            deepConcat: true,
            baseSrc: './'
        }))
        // .pipe(rename('index.html'))
        .pipe(minifyHtml())
        .pipe(gulp.dest(paths.tmp_root+'/'))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src(paths.origin.sass)
        .pipe(sass())
        // .on('error', logError)
        // .pipe(gulp.dest(paths.tmp_root+'/assets/css'))
        .pipe(minifyCss())
        .pipe(rename({
          extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.tmp_root+'/assets/css'))
        .pipe(livereload());
        console.log(33333);
});

gulp.task('script', function () {
    return gulp.src(paths.origin.js)
        .pipe(concat('app.js'))
        // .pipe(uglify())
        .pipe(rename({
          extname: '.min.js'
        }))
        .pipe(gulp.dest(paths.tmp_root +'/assets/js'))
        .pipe(livereload());
});

gulp.task('template', function(){
    return gulp.src(paths.origin.template)
        //.pipe(ejs())
        .pipe(gulp.dest(paths.tmp_root+'/template/'))
        .pipe(livereload());
})

gulp.task('images', function() {
    return gulp.src(paths.origin.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.tmp_root+'/assets/images/'))
        .pipe(livereload());
});


gulp.task('connect', ['concat', 'sass', 'script', 'template', 'images'], function () {
    connect.server({
        livereload:true,
        root: paths.tmp_root,
        port: 8080
    });

    livereload.listen();
})

gulp.task('watch', function () {
    gulp.watch(paths.origin.html, ['concat']);
    gulp.watch(paths.origin.sass, ['sass']);
    gulp.watch(paths.origin.js, ['script']);
    gulp.watch(paths.origin.template, ['template']);
    livereload.listen();
});

gulp.task('default', ['connect', 'watch'], function(){
    opn('http://localhost:8080');
})

