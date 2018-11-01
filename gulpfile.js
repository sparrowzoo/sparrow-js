// Cannot find module 'babel-core'
// https://github.com/babel/gulp-babel/issues/124

var gulp = require('gulp');
//because plugin name is del without "gulp" prefix
var del= require('del');
var plugins = require('gulp-load-plugins')();

var paths = {
    styles: {
        src:'src/styles/*.*' ,
        dest: 'assets/styles/'
    },
    scripts: {
        src: [
            'src/scripts/sparrow.js',
            'src/scripts/ImageCopper.js',
            'src/scripts/marquee.js',
            'src/scripts/sparrowDatePicker.js',
            'src/scripts/sparrowEditor.js',
            'src/scripts/sparrowTree.js'
            ],
        dest: 'assets/scripts/'
    }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del([ 'assets' ]);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(plugins.less())
        .pipe(plugins.cleanCss())
        // pass in options to the stream
        .pipe(plugins.rename({
            basename: 'sparrow',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(plugins.concat('sparrow.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function scripts_dev() {
    return gulp.src(paths.scripts.src,{base:'src/script'})
        .pipe(plugins.babel())
        .pipe(plugins.concat('sparrow-all.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = plugins.clean;
exports.styles = plugins.styles;
exports.scripts = plugins.scripts;
exports.watch = plugins.watch;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts,scripts_dev));

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);