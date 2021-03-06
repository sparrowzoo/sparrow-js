// Cannot find module 'babel-core'
// https://github.com/babel/gulp-babel/issues/124

var gulp = require('gulp');
//because plugin name is del without "gulp" prefix
var del = require('del');
var plugins = require('gulp-load-plugins')();

var paths = {
    styles: {
        src: ['source/styles/**/*.*'],
        dest: 'src/main/webapp/assets/styles/',
        code_pretty_src:['node_modules/code-prettify/styles/*.css','node_modules/code-prettify/src/*.css'],
        code_pretty_dest:'src/main/webapp/assets/scripts-dev/code-prettify/skins',
        purecss_src: 'node_modules/purecss/build/*.*',
        purecss_dest: 'src/main/webapp/assets/styles/pure-css'
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
            'source/scripts/header.js',
            'source/scripts/extend.js',
            'source/scripts/selector.js',
            'source/scripts/browser.js',
            'source/scripts/container.js',
            'source/scripts/ready.js',
            'source/scripts/constant.js',
            'source/scripts/ajax.js',
            'source/scripts/validator.js',
            'source/scripts/pager.js',
            'source/scripts/sparrow.js',
            // 'src/scripts/tooltip.js',
            'source/scripts/tabs.js',
            'source/scripts/windows.js',
            'source/scripts/grid-view.js',
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
            'source/scripts/datePicker.js',
            'source/scripts/sparrowEditor.js',
            'source/scripts/tree.js',
            'source/scripts/dispatcher.js',
            'source/scripts/metricChart.js',
            'source/scripts/user.js',
            'source/scripts/share.js',
            'source/scripts/tail.js'
        ],
        dest: 'src/main/webapp/assets/scripts-dev/'
    },
    scripts_min: {
        src: ['src/main/webapp/assets/scripts-dev/sparrow.js'
            ,'node_modules/requirejs/require.js'
            ,'node_modules/requirejs-domready/domReady.js'
            ,'node_modules/echarts/dist/echarts.js'],
        dest: 'src/main/webapp/assets/scripts'
    },
    dependency: {
        src: ['node_modules/requirejs/require.js',
            'node_modules/requirejs-domready/domReady.js',
            'node_modules/echarts/dist/echarts.js'
        ],
        dest: 'src/main/webapp/assets/scripts-dev',
        code_pretty_src:['node_modules/code-prettify/src/*.js'],
        code_pretty_dest:'src/main/webapp/assets/scripts-dev/code-prettify',
        code_pretty_run_src:'source/scripts/sparrow-prettify.js',
        code_pretty_run_desc:'src/main/webapp/assets/scripts-dev/code-prettify'
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
     gulp.src(paths.styles.src)
        .pipe(plugins.less())
        .pipe(plugins.cleanCss())
        // pass in options to the stream
        .pipe(gulp.dest(paths.styles.dest));

    gulp.src(paths.styles.code_pretty_src)
        .pipe(gulp.dest(paths.styles.code_pretty_dest));

    return gulp.src(paths.styles.purecss_src)
        .pipe(gulp.dest(paths.styles.purecss_dest));
}


function scripts() {
    return gulp.src(paths.scripts_min.src)
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        // .pipe(plugins.rename({
        //     suffix: '-min'
        // }))
        .pipe(gulp.dest(paths.scripts_min.dest));
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

function dependency() {
    gulp.src(paths.dependency.src)
        .pipe(gulp.dest(paths.dependency.dest));

    gulp.src(paths.dependency.code_pretty_src)
        .pipe(gulp.dest(paths.dependency.code_pretty_dest));

  return  gulp.src(paths.dependency.code_pretty_run_src)
        .pipe(gulp.dest(paths.dependency.code_pretty_run_desc));

}


function medias() {
    return gulp.src(paths.medias.src)
        .pipe(gulp.dest(paths.medias.dest));
}

function scripts_dev() {
    return gulp.src(paths.scripts_dev.src, {base: 'source/script-dev'})
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
var build_dev = gulp.series(clean, styles, scripts_dev,dependency,images, medias);

var build = gulp.series(scripts);

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('dev', build_dev);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);