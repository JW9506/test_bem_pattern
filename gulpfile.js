const { watch, src, dest, series } = require("gulp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssvars = require("postcss-simple-vars");
const nested = require("postcss-nested");
const cssImport = require("postcss-import");
const browserSync = require("browser-sync").create();
const mixins = require("postcss-mixins");

function html(cb) {
  browserSync.reload();
  cb();
}

function cssInject() {
  return src("./app/temp/styles/styles.css").pipe(browserSync.stream());
}

function styles() {
  return src("./app/assets/styles/styles.css")
    .pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
    .on("CssSyntaxError", function(msg) {
      console.log(msg.toString());
      this.emit("end");
    })
    .pipe(dest("./app/temp/styles"));
}

exports.watch = function() {
  browserSync.init({ notify: false, server: { baseDir: "app" } });
  watch(["./app/index.html"], html);
  watch(["./app/assets/styles/**/*.css"], series(styles, cssInject));
};
