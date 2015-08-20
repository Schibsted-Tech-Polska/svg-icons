var fs = require('fs'),
  path = require('path'),
  cfg = require('./config'),
  parseEndFile = require('./helpers/parseEndFile');

function getFiles(srcpath) {
  return fs.readdirSync(srcpath)
    .filter(function (file) {
      return file.indexOf('.svg') > -1;
    });
}

module.exports = function (grunt) {
  var colors = cfg.colors;
  var colorKeys = Object.keys(colors);
  var SVGToolkit = function () {
    var config = {};
    colorKeys.forEach(function (color) {
      config[color] = {
        options: {
          generatePNGs: false,
          colorize: colors[color]
        },
        files: [
          {
            expand: true,
            cwd: 'src/images',
            src: '*.svg',
            dest: '.tmp/images/' + color.replace('#', '')
          }
        ]
      }
    });
    return config;
  };

  var SVGSprite = function () {
    var config = {};
    var icons = getFiles('src/images');
    icons.forEach(function (icon) {
      icon = icon.replace(/\.svg$/, '');
      config[icon] = {
        expand: true,
        cwd: '.tmp/all-images',
        src: [icon + '/*.svg'],
        dest: '.tmp/combined-colors/' + icon,
        options: {
          shape: {
            dimension: {
              maxWidth: 100,
              maxHeight: 100
            }
          },
          mode: {
            css: {
              layout: 'vertical',
              bust: false,
              render: {
                css: false
              }
            }
          }
        }
      };
    });

    return config;
  };


  grunt.initConfig({
    watch: {
      files: ['src/*'],
      tasks: ['grunticon']
    },
    svgtoolkit: SVGToolkit(),
    copy: {
      first_step: {
        files: [
          {
            expand: true,
            cwd: '.tmp/images',
            src: ['*/svg/*.svg'],
            dest: '.tmp/all-images',
            rename: function (dest, src) {
              var parts = src.split('/'),
                color = parts[0],
                name = parts[2].replace('.svg', '');
              return path.join(dest, name, name + '-' + color) + '.svg';
            }
          }
        ]
      },
      second_step: {
        files: [
          {
            expand: true,
            cwd: '.tmp/combined-colors',
            src: ['**/*.svg'],
            dest: '.tmp/color-sprites',
            rename: function (dest, src) {
              return path.join(dest, src.split('/')[0]) + ".svg";
            }
          }
        ]
      }
    },
    svg_sprite: SVGSprite(),
    grunticon: {
      icons: {
        files: [{
          expand: true,
          cwd: '.tmp/color-sprites',
          src: ['*.svg'],
          dest: "dist"
        }],
        options: {
          cssprefix: '.bt-ico-',
          customselectors: {
            "*": [".icon-$1::before"]
          }
        }
      }
    },
    concat: {
      sass: {
        options: {
          process: function (src, filePath) {
            var out = src;
            if (filePath === 'dist/icons.data.svg.css') {
              out = parseEndFile(src);
            }
            return out;
          }
        },
        src: ['dist/icons.data.svg.css', 'src/styles.scss'],
        dest: 'dist/svg-icons.scss'
      }
    },
    clean: {
      prepare: ['.tmp', 'dist'],
      tidy: ["dist/*.*", "!dist/svg-icons.scss", "dist/png", '.tmp']
    }
  });


  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-svg-toolkit');
  grunt.loadNpmTasks('grunt-svg-sprite');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [
    'clean:prepare',
    'svgtoolkit',
    'copy:first_step',
    'svg_sprite',
    'copy:second_step',
    'grunticon',
    'concat',
    'clean:tidy'
  ]);

};