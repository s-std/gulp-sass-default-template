var syntax 			= 'scss' // Syntax: sass or scss;
var public 			= 'dist' // Path user files
var resources		= 'assets' // Path sources files

var gulp          = require('gulp'),
	gutil         = require('gulp-util' ),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require('gulp-notify');

gulp.task('browser-sync', function() {
	browserSync({
		// proxy: 'domain.com', if use your domain
		server: {
			baseDir: './',
			index: '/index.html',
			// directory: true
		},
		notify: true,
	})
})

gulp.task('styles', function() {
	return gulp.src(resources+'/'+syntax+'/**/*.'+syntax)
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest(public+'/css'))
	.pipe(browserSync.stream())
})

gulp.task('js', function() {
	return gulp.src([
			// resources+'/js/plugin/plugin.js', // add plugins
			resources+'/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest(public+'/js'))
	.pipe(browserSync.reload({ stream: true }))
})

gulp.task('watch', ['styles', 'js', 'browser-sync'], function() {
	gulp.watch(resources+'/'+syntax+'/**/*.'+syntax, ['styles'])
	gulp.watch([resources+'/js/**/*.js', resources+'/js/common.js'], ['js'])
	gulp.watch('/*.html', browserSync.reload)
	gulp.watch('*.html', browserSync.reload)
	gulp.watch('/*.php', browserSync.reload)
})

gulp.task('default', ['watch'])
