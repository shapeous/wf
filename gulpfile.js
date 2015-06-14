var gulp			= require("gulp")
	,	gutil			= require("gulp-util")
	,	gulpif		= require("gulp-if")
	,	uglify		= require("gulp-uglify")
	,	minifyHTML= require("gulp-minify-html")
	,	coffee		= require("gulp-coffee")
	,	browserify= require("gulp-browserify")
	,	compass		= require("gulp-compass")
	,	cleanDest	= require("gulp-clean-dest")
	, connect		= require("gulp-connect")
	,	concat		= require("gulp-concat");

var env
	,	coffeeSources
	,	jsSources
	,	sassSources
	,	htmlSources
	,	jsonSources
	,	outputDir
	,	sassStyle
	;

env = process.env.NODE_ENV || "DEV";

if (env === "DEV") {
	outputDir	= "builds/development/";
	sassStyle	= "expanded";
} else {
	outputDir	= "builds/production/";
	sassStyle	= "compressed"
}

coffeeSources = ["components/coffee/tagline.coffee"];
jsSources			=
		[	"components/scripts/rclick.js"
		,	"components/scripts/pixgrid.js"
		,	"components/scripts/tagline.js"
		,	"components/scripts/template.js"
		];
sassSources	= ["components/sass/style.scss"];
htmlSources	= ["builds/development/*.html"];
jsonSources = [outputDir + "js/*.json"]

gulp.task("html", function() {
	gutil.log("- I handle HTML files");
	gulp.src(htmlSources)
		.pipe(gulpif(env === "PRD", minifyHTML()))
		.pipe(gulpif(env === "PRD", gulp.dest(outputDir)))
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
		.pipe(gulpif(env === "PRD", uglify()))
		.pipe(gulp.dest(outputDir + "js"))
		.pipe(connect.reload())
});

gulp.task("compass", function() {
	gutil.log("- I transpile SCSS files using gulp-compass");
	gulp.src(sassSources)
		.pipe(compass(
			{	"sass":	"components/sass"
			,	"image":	outputDir + "images"
			,	"style":	sassStyle
			,	"comments":	true
			})
			.on("error", gutil.log)
		)
		.pipe(gulp.dest(outputDir +"css"))
		.pipe(connect.reload())
		.pipe(cleanDest("css"))	// Deleting "css/style.css" allows style to be changed from one run to the next
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
		{	"root":	outputDir
		,	"livereload":	true
		})
});

gulp.task("default", ["html", "json", "coffee", "js", "compass", "connect", "watch"], function() {
	gutil.log("- I am the default task and I run the preceding tasks in sequence");
});