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
const svg2png = require("gulp-svg2png");
const modernizr = require("gulp-modernizr");
const imagemin = require("gulp-imagemin");
const usemin = require("gulp-usemin");
const rev = require("gulp-rev");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");

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

function createPngCopy() {
  return src("./app/temp/sprite/css/*.svg")
    .pipe(svg2png())
    .pipe(dest("./app/temp/sprite/css"));
}

function endClean() {
  return del(["./app/temp/sprite"]);
}

function createSprite() {
  return src("./app/assets/images/icons/**/*.svg")
    .pipe(
      svgSprite({
        shape: {
          spacing: {
            padding: 5
          }
        },
        mode: {
          css: {
            variables: {
              replaceSvgWithPng: function() {
                return function(sprite, render) {
                  return render(sprite)
                    .split(".svg")
                    .join(".png");
                };
              }
            },
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
  return src("./app/temp/sprite/css/**/*.{svg,png}").pipe(
    dest("./app/assets/images/sprites")
  );
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

exports.modernizr = function() {
  return src(["./app/assets/styles/**/*.css", "./app/assets/scripts/**/*.js"])
    .pipe(
      modernizr({
        options: ["setClasses"]
      })
    )
    .pipe(dest("./app/temp/scripts/"));
};

function deleteDocsFolder() {
  return del("./docs");
}

function optimizeImages() {
  return src([
    "./app/assets/images/**/*",
    "!./app/assets/images/icons",
    "!./app/assets/images/icons/**/*"
  ])
    .pipe(
      imagemin({
        progressive: true,
        interlaced: true,
        multipass: true
      })
    )
    .pipe(dest("./docs/assets/images"));
}

function compressStatics() {
  return src("./app/index.html")
    .pipe(
      usemin({
        css: [
          function() {
            return rev();
          },
          function() {
            return cssnano();
          }
        ],
        js: [
          function() {
            return rev();
          },
          function() {
            return uglify();
          }
        ]
      })
    )
    .pipe(dest("./docs"));
}

exports.icon = series(
  beginClean,
  createSprite,
  createPngCopy,
  copySpriteGraphic,
  copySpriteCSS,
  endClean
);
exports.compile = series(
  exports.icon,
  styles,
  cssInject,
  exports.modernizr,
  compileScript,
  scriptRefresh
);
exports.build = series(deleteDocsFolder, optimizeImages, compressStatics);
exports.previewDocs = function() {
  browserSync.init({ notify: false, open: false, server: { baseDir: "docs" } });
};

exports.watch = function() {
  browserSync.init({ notify: false, open: false, server: { baseDir: "app" } });
  watch(["./app/assets/images/icons/*"], exports.icon);
  watch(["./app/index.html"], html);
  watch(["./app/assets/styles/**/*.css"], series(styles, cssInject));
  watch(
    ["./app/assets/scripts/**/*.js"],
    series(exports.modernizr, compileScript, scriptRefresh)
  );
};
