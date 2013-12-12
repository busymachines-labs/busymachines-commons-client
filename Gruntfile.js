module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: ';'
            },
            libs: {
                src: [
                    "config/module.js",
                    "directives/*.js",
                    "services/*.js",
                    "filters/*.js",
                    "config.js"
                ],
                dest: "<%= pkg.name %>.js"
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');


    // Default task(s).
    grunt.registerTask('default', ["concat:libs"]);

};