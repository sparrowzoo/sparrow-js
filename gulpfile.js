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
    images:{
        src:'src/images/**/*.*',
        dest:'assets/images'
    },
    medias:{
        src:'src/media/**/*.*',
        dest:'assets/media'
    },
    scripts_dev: {
        src: [
            'src/scripts/extend.js',
            'src/scripts/header.js',
            'src/scripts/selector.js',
            'src/scripts/browser.js',
            'src/scripts/container.js',
            'src/scripts/ready.js',
            'src/scripts/constant.js',
            //'src/scripts/ajax.js',
            //'src/scripts/validator.js',
            //'src/scripts/pager.js',
            'src/scripts/sparrow.js',
            //'src/scripts/tooltip.js',
            //'src/scripts/tabs.js',
            'src/scripts/windows.js',
            //'src/scripts/grid-view.js',
            'src/scripts/file.js',
            'src/scripts/events.js',
            'src/scripts/mouse-wheel.js',
            'src/scripts/select.js',
            'src/scripts/message.js',
            'src/scripts/animation.js',
            'src/scripts/progressbar.js',
            'src/scripts/tail.js',
            'src/scripts/menu.js',
            //'src/scripts/image-switch.js',
            //'src/scripts/ImageCopper.js',
            //'src/scripts/marquee.js',
            //'src/scripts/sparrowDatePicker.js',
            //'src/scripts/sparrowEditor.js',
            //'src/scripts/sparrowTree.js'
            ],
        dest: 'assets/scripts/'
    },
    scripts_min:{
        src:['assets/scripts/sparrow-all.js'],
        dest:'assets/scripts'
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
            suffix: '-min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts_min.src)
        .pipe(plugins.concat('sparrow-min.js'))
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.scripts_min.dest));
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

function medias() {
    return gulp.src(paths.medias.src)
        .pipe(gulp.dest(paths.medias.dest));
}

function scripts_dev() {
    return gulp.src(paths.scripts_dev.src,{base:'src/script'})
        .pipe(plugins.concat('sparrow-all.js'))
        .pipe(gulp.dest(paths.scripts_dev.dest));
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
exports.scripts_dev = plugins.scripts_dev;
exports.scripts = plugins.scripts;
exports.images=plugins.images;
exports.medias=plugins.medias;
exports.watch = plugins.watch;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build_dev = gulp.series(gulp.parallel(clean,styles,scripts_dev,images,medias));

var build = gulp.series(gulp.parallel(scripts));

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('dev', build_dev);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);