const { src, dest, parallel } = require('gulp');
var sass = require("gulp-sass");
const imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');

function style() {
    return (
        src("src/scss/*.scss")
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(dest("./dist/css/"))
    );
}
function OptimizeImage() {
    return (
        src('src/img/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(dest('dist/img'))
    )
}
function html() {
    return(
        gulp.src('index.html')
        .pipe(gulp.dest('./dist'))
    );
}

exports.style = style;
exports.html = html;
exports.OptimizeImage = OptimizeImage;
