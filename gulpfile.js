var gulp			= require("gulp")
	,	gutil			= require("gulp-util")
	,	coffee		= require("gulp-coffee")
	,	browserify= require("gulp-browserify")
	,	concat		= require("gulp-concat");

var coffeeSources = ["components/coffee/tagline.coffee"];
var jsSources			=
		[	"components/scripts/rclick.js"
		,	"components/scripts/pixgrid.js"
		,	"components/scripts/tagline.js"
		,	"components/scripts/template.js"
		];

gulp.task("coffee", function() {
	gutil.log("- I transpile coffee scripts into JavaScript files.");
	gulp.src(coffeeSources)
		.pipe(coffee({"bare": true})
			.on("error", gutil.log))
		.pipe(gulp.dest("components/scripts"))
});

gulp.task("js", function() {
	gutil.log("- I concatenate all JavaScript files.");
	gulp.src(jsSources) // The order of jsSources list controls the processing order.
		.pipe(concat("script.js"))
		.pipe(browserify())
		.pipe(gulp.dest("builds/development/js"))
});