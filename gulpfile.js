// Cannot find module 'babel-core'
// https://github.com/babel/gulp-babel/issues/124

var gulp = require('gulp');
//because plugin name is del without "gulp" prefix
var del = require('del');
var plugins = require('gulp-load-plugins')();

var paths = {
    styles: {
        src: 'source/styles/**/*.*',
        dest: 'src/main/webapp/assets/styles/'
    },
    purecss: {
        src: 'node_modules/purecss/build/*.*',
        dest: 'src/main/webapp/assets/styles/pure-css'
    },
    images: {
        src: 'source/images/**/*.*',
        dest: 'src/main/webapp/assets/images'
    },
    medias: {
        src: 'source/media/**/*.*',
        dest: 'src/main/webapp/assets/media'
    },
    scripts_dev: {
        src: [
            // 'source/scripts/header.js',
            'source/scripts/extend.js',
            'source/scripts/selector.js',
            'source/scripts/browser.js',
            'source/scripts/container.js',
            'source/scripts/ready.js',
            'source/scripts/constant.js',
            'source/scripts/ajax.js',
            'source/scripts/validator.js',
            //'src/scripts/pager.js',
            'source/scripts/sparrow.js',
            // 'src/scripts/tooltip.js',
            'source/scripts/tabs.js',
            'source/scripts/windows.js',
            //'src/scripts/grid-view.js',
            'source/scripts/file.js',
            'source/scripts/events.js',
            'source/scripts/mouse-wheel.js',
            'source/scripts/select.js',
            'source/scripts/message.js',
            'source/scripts/animation.js',
            'source/scripts/progressbar.js',
            'source/scripts/menu.js',
            //'src/scripts/image-switch.js',
            //'src/scripts/ImageCopper.js',
            //'src/scripts/marquee.js',
            'source/scripts/sparrowDatePicker.js',
            'source/scripts/sparrowEditor.js',
            'source/scripts/sparrowTree.js',
            'source/scripts/sparrowDispatcher.js',
            // 'source/scripts/tail.js'
        ],
        dest: 'src/main/webapp/assets/scripts-all/'
    },
    scripts_min: {
        src: ['src/main/webapp/assets/scripts-all/sparrow.js'],
        dest: 'src/main/webapp/assets/scripts'
    },
    requirejs: {
        src: ['node_modules/requirejs/require.js','node_modules/requirejs-domready/domReady.js'],
        dest: 'src/main/webapp/assets/scripts-all'
    }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del(['src/main/webapp/assets']);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(plugins.less())
        .pipe(plugins.cleanCss())
        // pass in options to the stream
        // .pipe(plugins.rename({
        //     basename: 'sparrow',
        //     suffix: '-min'
        // }))
        .pipe(gulp.dest(paths.styles.dest));
}


function purecss() {
    return gulp.src(paths.purecss.src)
        .pipe(gulp.dest(paths.purecss.dest));
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

function requirejs() {
    return gulp.src(paths.requirejs.src)
        .pipe(gulp.dest(paths.requirejs.dest));
}


function medias() {
    return gulp.src(paths.medias.src)
        .pipe(gulp.dest(paths.medias.dest));
}

function scripts_dev() {
    return gulp.src(paths.scripts_dev.src, {base: 'source/script-all'})
        .pipe(plugins.concat('sparrow.js'))
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
exports.images = plugins.images;
exports.medias = plugins.medias;
exports.purecss = plugins.purecss;
exports.watch = plugins.watch;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 *  The following tasks did not complete: dev, <anonymous>
 *  [10:21:42] Did you forget to signal async completion?
 *  use gulp.series is ok
 */
var build_dev = gulp.series(clean, styles, purecss, scripts_dev,requirejs,images, medias);

var build = gulp.series(scripts);

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('dev', build_dev);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);