module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        node: true
      },
      all: ['Gruntfile.js', 'lib/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default tasks
  grunt.registerTask('default', ['jshint']);
};
