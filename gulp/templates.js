var gulp = require('gulp'),
	path = require('path'),
	handlebars = require('gulp-handlebars'),
	wrap = require('gulp-declare'),
	declare = require('gulp-declare'),
	concat = require('gulp-concat'),
	merge = require('merge-stream');

module.exports = function() {
	//partials stream
	var partials = gulp.src('./templates/_*.hbs')
		//handlebars
		.pipe(handlebars())
		//wrap inline javascript
		.pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
			imports: {
				processPartialName: function(fileName) {
					return JSON.stringify(path.basename(fileName, '.js').subStr(1));
				}
			}
		}));

	//templates stream
	var templates = gulp.src('./templates/[^_]*.hbs')
		//handlebars
		.pipe(handlebars())
		//wrap
		.pipe(wrap('Handlebars.template(<%= contents %>'))
		//namespace
		.pipe(declare({
			namespace: 'App.templates',
			noRedeclare: true
		}));

	//return merge
	return merge(partials, templates)
		//concat
		.pipe(concat('templates.js'))
		//build
		.pipe(gulp.dest('./build/js'));
};