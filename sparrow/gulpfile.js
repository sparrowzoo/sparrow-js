// Cannot find module 'babel-core'
// https://github.com/babel/gulp-babel/issues/124
var gulp = require("gulp");
//because plugin name is del without "gulp" prefix
var del = require("del");
var plugins = require("gulp-load-plugins")();

var paths = {
  styles: {
    src: ["source/styles/*.css"],
    dest: "assets/styles/",
    code_pretty_src: [
      "node_modules/code-prettify/styles/*.css",
      "node_modules/code-prettify/src/*.css",
    ],
    code_pretty_dest: "source/styles/code-prettify/skins",
    code_pretty_assets_dest: "assets/styles/code-prettify/skins",

    purecss_src: "node_modules/purecss/build/*.*",
    purecss_dest: "source/styles/pure-css",
    purecss_assets_dest: "assets/styles/pure-css",
  },

  images: {
    src: "source/images/**/*.*",
    dest: "assets/images",
  },
  medias: {
    src: "source/media/**/*.*",
    dest: "assets/media",
  },
  scripts_prod: {
    src: [
      "source/scripts/extend.js",
      "source/scripts/selector.js",
      "source/scripts/browser.js",
      "source/scripts/container.js",
      "source/scripts/constant.js",
      "source/scripts/indexedDB.js",
      "source/scripts/ajax.js",
      "source/scripts/HttpClient.js",
      "source/scripts/validator.js",
      "source/scripts/pager.js",
      "source/scripts/sparrow-core.js",
      // 'src/scripts/tooltip.js',
      // 'source/scripts/tabs.js',
      // 'source/scripts/windows.js',
      "source/scripts/grid-view.js",
      "source/scripts/file.js",
      "source/scripts/events.js",
      // 'source/scripts/mouse-wheel.js',
      // 'source/scripts/select.js',
      // 'source/scripts/message.js',
      // 'source/scripts/animation.js',
      "source/scripts/progressbar.js",
      // 'source/scripts/menu.js',
      // 'source/scripts/date-picker.js',
      // 'source/scripts/sparrowEditor.js',
      "source/scripts/tree.js",
      "source/scripts/dispatcher.js",
      "source/scripts/user.js",
      "source/scripts/share.js",
      "source/scripts/websocket.js",
      "source/scripts/es_tail.js",
    ],
    dest: "source/scripts/",
  },
  scripts_dev: {
    src: [
      "source/scripts/header.js",
      "source/scripts/extend.js",
      "source/scripts/selector.js",
      "source/scripts/browser.js",
      "source/scripts/container.js",
      "source/scripts/ready.js",
      "source/scripts/constant.js",
      "source/scripts/indexedDB.js",
      "source/scripts/ajax.js",
      "source/scripts/HttpClient.js",
      "source/scripts/validator.js",
      "source/scripts/pager.js",
      "source/scripts/sparrow-core.js",
      // 'src/scripts/tooltip.js',
      "source/scripts/tabs.js",
      "source/scripts/windows.js",
      "source/scripts/grid-view.js",
      "source/scripts/file.js",
      "source/scripts/events.js",
      "source/scripts/mouse-wheel.js",
      "source/scripts/select.js",
      "source/scripts/message.js",
      "source/scripts/animation.js",
      "source/scripts/progressbar.js",
      "source/scripts/menu.js",
      //'src/scripts/image-switch.js',
      "source/scripts/image-cropper.js",
      //'src/scripts/marquee.js',
      "source/scripts/date-picker.js",
      "source/scripts/sparrowEditor.js",
      "source/scripts/tree.js",
      "source/scripts/dispatcher.js",
      "source/scripts/metricChart.js",
      "source/scripts/user.js",
      "source/scripts/share.js",
      "source/scripts/websocket.js",
      "source/scripts/tail.js",
    ],
    dest: "source/scripts/",
  },

  ext: {
    src: ["source/ext/**/*.*"],
    dest: "assets/ext/",
  },
  scripts_min: {
    src: [
      "source/scripts/sparrow.js",
      "source/scripts/require.js",
      "source/scripts/dom-ready.js",
      "source/scripts/echarts.js",
      "source/scripts/*-prettify/*.*",
    ],
    dest: "assets/scripts",
  },
  dependency: {
    src: [
      "node_modules/requirejs/require.js",
      "node_modules/requirejs-domready/domReady.js",
      "node_modules/echarts/dist/echarts.js",
    ],
    dest: "source/scripts",
    code_pretty_src: ["node_modules/code-prettify/src/*.js"],
    code_pretty_dest: "source/scripts/code-prettify",
    code_pretty_run_src: "source/scripts/sparrow-prettify.js",
    code_pretty_run_desc: "source/scripts/code-prettify",
  },
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(["assets/ext"]);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  gulp
    .src(paths.styles.code_pretty_src)
    .pipe(gulp.dest(paths.styles.code_pretty_assets_dest));

  gulp
    .src(paths.styles.purecss_src)
    .pipe(gulp.dest(paths.styles.purecss_assets_dest));

  return (
    gulp
      .src(paths.styles.src)
      .pipe(plugins.less())
      .pipe(plugins.cleanCss())
      // pass in options to the stream
      .pipe(gulp.dest(paths.styles.dest))
  );
}

function styles_dev() {
  gulp
    .src(paths.styles.code_pretty_src)
    .pipe(gulp.dest(paths.styles.code_pretty_dest));

  return gulp
    .src(paths.styles.purecss_src)
    .pipe(gulp.dest(paths.styles.purecss_dest));
}

function scripts() {
  return (
    gulp
      .src(paths.scripts_min.src)
      //babel 配置presets 为 @babel/preset-env 时，会自动根据配置的目标浏览器环境，生成代码
      // npm update caniuse-lite browserslist
      .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
      .pipe(plugins.uglify())
      // .pipe(plugins.rename({
      //     suffix: '-min'
      // }))
      .pipe(gulp.dest(paths.scripts_min.dest))
  );
}

function images() {
  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
}

function ext() {
  return gulp.src(paths.ext.src).pipe(gulp.dest(paths.ext.dest));
}

function dependency() {
  gulp.src(paths.dependency.src).pipe(gulp.dest(paths.dependency.dest));

  gulp
    .src(paths.dependency.code_pretty_src)
    .pipe(gulp.dest(paths.dependency.code_pretty_dest));

  return gulp
    .src(paths.dependency.code_pretty_run_src)
    .pipe(gulp.dest(paths.dependency.code_pretty_run_desc));
}

function medias() {
  return gulp.src(paths.medias.src).pipe(gulp.dest(paths.medias.dest));
}

function scripts_dev() {
  return gulp
    .src(paths.scripts_dev.src, { base: "source/script" })
    .pipe(plugins.concat("sparrow.js"))
    .pipe(gulp.dest(paths.scripts_dev.dest));
}

/**
 * es6 支持export 导出 语法
 * @returns {*}
 */
function scripts_es() {
  return gulp
    .src(paths.scripts_prod.src, { base: "source/script" })
    .pipe(plugins.concat("sparrow_es.js"))
    .pipe(gulp.dest(paths.scripts_prod.dest));
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
var build_dev = gulp.series(
  clean,
  scripts_dev,
  scripts_es,
  styles_dev,
  dependency
);

//var build_dev = gulp.series(clean, styles, scripts_dev,dependency,images, medias,ext);

var build = gulp.series(clean, scripts, images, medias, ext, styles);

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task("dev", build_dev);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task("default", build);
