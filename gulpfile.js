const { src, dest, parallel, series, watch } = require('gulp');
// import for scss task
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
// imports for js task
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
// addional imports
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin'); // optimize images
const del = require('del');
// imports for live server browser-sync
const browserSync = require('browser-sync');
const server = browserSync.create();

const files = {
    scssPath: './src/scss/*.scss',
    jsPath: './src/js/**/*.js',
    imgPath: 'src/img/*.+(png|jpg|gif|svg)',
    htmlPath: 'src/index.html'
}

function clean() {
    return(['dist']);
}

function scssTask() {    
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css')
    );
}

function jsTask(){
    return src([files.jsPath])
        // .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        // .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/js')
    );
}

var cbString = new Date().getTime();
function cacheBustTask(){
    return src(['index.html'])
        .pipe(replace(/cb=\d+/, 'cb=' + cbString))
        .pipe(dest('.'));
}

function OptimizeImage() {
    return (
        src(files.imgPath)
        .pipe(imagemin())
        .pipe(dest('dist/img'))
    )
}

function copyHtml() {
    return src(files.htmlPath)
    .pipe(dest('dist'));
}

function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
        baseDir: './dist/'
        }
    });
    done();
}

function watchTask(){
    watch(
        [files.scssPath, files.jsPath, files.htmlPath],
        parallel(scssTask, jsTask, copyHtml, reload)
    );
}

exports.default = series(
    parallel(scssTask, jsTask, OptimizeImage, copyHtml, serve),
    watchTask);

