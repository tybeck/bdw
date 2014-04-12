/**
 * Babydealswatcher Gruntfile
 * @url http://www.babydealswatcher.com
 * @author Tyler Beck
 */
 
'use strict';
 
/**
 * Grunt Module
 */

module.exports = function(grunt) {
 
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		project: {
		  assets: 'www/assets',
		  src: '<%= project.assets %>/src',
		  css: [
		    '<%= project.src %>/scss/style.scss'
		  ],
		  js: [
		    '<%= project.assets %>/js/*.js'
		  ]
		},

		tag: {
		  banner: '/*!\n' +
		          ' * <%= pkg.name %>\n' +
		          ' * <%= pkg.title %>\n' +
		          ' * <%= pkg.url %>\n' +
		          ' * @author <%= pkg.author %>\n' +
		          ' * @version <%= pkg.version %>\n' +
		          ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
		          ' */\n'
		},

		sass: {
		  dev: {
		    options: {
		      style: 'expanded',
		      banner: '<%= tag.banner %>',
		      //compass: true
		    },
		    files: {
		      '<%= project.assets %>/css/style.css': '<%= project.css %>'
		    }
		  },
		  dist: {
		    options: {
		      style: 'compressed',
		      //compass: true
		    },
		    files: {
		      '<%= project.assets %>/css/style.css': '<%= project.css %>'
		    }
		  }
		},

		watch: {
		  sass: {
		    files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
		    tasks: ['sass:dev']
		  }
		}

	});

	require('matchdep').filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);

	grunt.registerTask('default', [
		'sass:dev',
		'watch'
	]);

	grunt.registerTask('dist', [
		'sass:dist',
		'watch'
	]);

};