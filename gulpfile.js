var gulp			= require("gulp")
	,	gutil			= require("gulp-util")
	,	coffee		= require("gulp-coffee")
	,	browserify= require("gulp-browserify")
	,	compass		= require("gulp-compass")
	, connect		= require("gulp-connect")
	,	concat		= require("gulp-concat");

var coffeeSources = ["components/coffee/tagline.coffee"];
var jsSources			=
		[	"components/scripts/rclick.js"
		,	"components/scripts/pixgrid.js"
		,	"components/scripts/tagline.js"
		,	"components/scripts/template.js"
		];
var	sassSources	= ["components/sass/style.scss"];
var htmlSources	= ["builds/development/*.html"];
var jsonSources = ["builds/development/js/*.json"]

gulp.task("html", function() {
	gutil.log("- I handle HTML files");
	gulp.src(htmlSources)
		.pipe(connect.reload());
});

gulp.task("json", function() {
	gutil.log("- I handle JSON files");
	gulp.src(jsonSources)
		.pipe(connect.reload());
});

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
		.pipe(connect.reload())
});

gulp.task("compass", function() {
	gutil.log("- I transpile SCSS files using gulp-compass");
	gulp.src(sassSources)
		.pipe(compass(
			{	"sass":	"components/sass"
			,	"image":	"builds/development/images"
			,	"style":	"expanded"
			,	"comments":	true
			})
			.on("error", gutil.log)
		)
		.pipe(gulp.dest("builds/development/css"))
		.pipe(connect.reload())
});

gulp.task("watch", function() {
	gutil.log("- I sit here and watch for changes...");
	gulp.watch(coffeeSources, ["coffee"]);
	gulp.watch(jsSources, ["js"]);
	gulp.watch("components/sass/*.scss", ["compass"]);
	gulp.watch(htmlSources, ["html"])
	gulp.watch(jsonSources, ["json"])
});

gulp.task("connect", function() {
	gutil.log("- I create a server and reload when something changes");
	connect.server(
		{	"root":	"builds/development/"
		,	"livereload":	true
		})
});

gulp.task("default", ["html", "json", "coffee", "js", "compass", "connect", "watch"], function() {
	gutil.log("- I am the default task and I run the preceding tasks in sequence");
});