module.exports = function(grunt){
	grunt.initConfig({
		'watch': {
			jade: {
				files: ["views/**"]
				,options: {
					livereload: true
				}
			}
			,js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js']
				// ,tasks: ['jshint']
				,options: {
					livereload: true
				}
			}
		}
		,'nodemon': {
			dev: {
				script: 'app.js'
				,options: {
					args: ['dev']
					,nodeArgs: ["--debug"]
					,ignoredFiles: ['README.md', 'node_modules/**']
					,watchedExtensions: ['js']
					,watchedFolders: ["./"]
					,debug: true
					,delayTime: 1
					,env: {
						PORT: 3000
					}
					,cwd: __dirname
				}
			}
		}
		,'node-inspector': {
			dev: {
				options: {
			      'web-port': 1337,
			      'web-host': 'localhost',
			      'debug-port': 5858,
			      'save-live-edit': true,
			      'no-preload': true,
			      'stack-trace-limit': 4,
			      'hidden': ['node_modules']
			    }
			}
		}
		,concurrent: {
			tasks: ['nodemon', 'watch', "node-inspector"]
			,options: {
				logConcurrentOutput: true
			}
		}
		,mochaTest: {
			options: {
			reporter: 'spec'
			},
			src: ['test/**/*.js']
	    }
	})

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-node-inspector');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.option('force', true);
	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('test', ['mochaTest']);
}