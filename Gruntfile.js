module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jslint: {
      all: {
        src: ['bot-mate.js', 'page-content.js'],
        directives: {
          nomen: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jslint');

  // Default task(s).
  grunt.registerTask('default', ['jslint']);
};
