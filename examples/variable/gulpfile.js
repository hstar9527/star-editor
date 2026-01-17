const { src, dest, watch } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const scss = require("gulp-sass")(require("sass"));

function build() {
  try {
    return src(["./src/index.scss"])
      .pipe(scss())
      .pipe(concat("index.css"))
      .pipe(cleanCSS({ compatibility: "*" }))
      .pipe(dest("dist/style"));
  } catch (error) {
    console.log("Compile Error :", error);
  }
}

function watchFiles() {
  build();
  watch("./src/**/*.scss", build);
}

const { argv } = require("process");
const isWatchMode = argv.includes("--watch") || argv.includes("-w");
exports.default = isWatchMode ? watchFiles : build;
