module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    dirs:
      root: 'src/main'
      webapp: '<%= dirs.root %>/webapp'
      jssrc: '<%= dirs.webapp %>/jssrc'
      js: '<%= dirs.webapp %>/js'

    connect:
      server:
        options:
          port: 8000
          hostname: '*'
    uglify:
      dev:
        files:
          '<%= dirs.js %>/jquery.file-type-icon.min.js': '<%= dirs.jssrc %>/jquery.file-type-icon.js'
        options:
          sourceMap: true
          sourceMapName: '<%= dirs.js %>/jquery.file-type-icon.min.js.map'
#          sourceMapIncludeSources: true
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
    watch:
      scripts:
        files: ['<%= dirs.jssc %>/*.js']
        tasks: ['uglify']
        options:
          interrupt: true
    karma:
      unit:
        configFile: 'karma.conf.js'
      options:
        client:
          mocha:
            ui: 'tdd'
    clean:
      all: [
        '.sass-cache'
        'bower_components'
        'node_modules'
        '<%= dirs.js %>'
      ]
      dev: [
        '<%= dirs.js %>'
      ]

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-karma')

  grunt.registerTask('default', ['uglify'])
