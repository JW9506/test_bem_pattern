const { watch, src, dest, series } = require("gulp");
const postcss = require("gulp-postcss");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const autoprefixer = require("autoprefixer");
const cssvars = require("postcss-simple-vars");
const nested = require("postcss-nested");
const cssImport = require("postcss-import");
const mixins = require("postcss-mixins");
const hexrgba = require("postcss-hexrgba");
const browserSync = require("browser-sync").create();
const del = require("del");
const webpack = require("webpack");

function html(cb) {
  browserSync.reload();
  cb();
}

function cssInject() {
  return src("./app/temp/styles/styles.css").pipe(browserSync.stream());
}

function styles() {
  return src("./app/assets/styles/styles.css")
    .pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
    .on("CssSyntaxError", function(msg) {
      console.log(msg.toString());
      this.emit("end");
    })
    .pipe(dest("./app/temp/styles"));
}

function beginClean() {
  return del(["./app/assets/images/sprites"]);
} 

function endClean() {
  return del(["./app/temp/sprite"]);
} 

function createSprite() {
  return src("./app/assets/images/icons/**/*.svg")
    .pipe(
      svgSprite({
        mode: {
          css: {
            sprite: "sprite.svg",
            render: {
              css: { template: "./app/assets/styles/sprite-template.css" }
            }
          }
        }
      })
    )
    .pipe(dest("./app/temp/sprite/"));
}

function copySpriteGraphic() {
  return src("./app/temp/sprite/css/**/*.svg")
    .pipe(dest("./app/assets/images/sprites"));
}

function copySpriteCSS() {
  return src("./app/temp/sprite/css/*.css")
    .pipe(rename("_sprite.css"))
    .pipe(dest("./app/assets/styles/modules"));
}

function compileScript(cb) {
  webpack(require("./webpack.config.js"), function(err, stats) {
    if (err) console.error(err.toString());
    console.log(stats.toString());
  });
  cb();
}

function scriptRefresh() {
  return src("./app/temp/scripts/App.js").pipe(browserSync.stream());
}

exports.watch = function() {
  browserSync.init({ notify: false, open: false, server: { baseDir: "app" } });
  watch(["./app/assets/images/icons/*"], series(beginClean, createSprite, copySpriteGraphic, copySpriteCSS, endClean));
  watch(["./app/index.html"], html);
  watch(["./app/assets/styles/**/*.css"], series(styles, cssInject));
  watch(["./app/assets/scripts/**/*.js"], series(compileScript, scriptRefresh));
};

