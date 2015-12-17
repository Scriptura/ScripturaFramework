// -----------------------------------------------------------------------------
// @title       Gulpfile.js
// @description Tasks runner for the project
// @link        http://gulpjs.com/
// -----------------------------------------------------------------------------

'use strict';


// -----------------------------------------------------------------------------
// @section Commandes
// -----------------------------------------------------------------------------

// Commandes pour le projet :
// `gulp` commande globale
// `gulp images` optimisation des images
// `gulp glyphicons` pour la refonte de la police d'icônes GlyphIcons
// Les autres commandes sont lancées automatiquement arpès la surveillance des fichiers (watcher).


// -----------------------------------------------------------------------------
// @section Variables
// -----------------------------------------------------------------------------

// @subsection Dependencies
// -----------------------------------------------------------------------------

var gulp = require('gulp'),
    gulpsync = require('gulp-sync')(gulp),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    //changed = require('gulp-changed'),
    ftp = require('vinyl-ftp'),
    consolidate = require("gulp-consolidate"),
    lodash = require('lodash'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    header = require('gulp-header'),
    imagemin = require('gulp-imagemin'),
    jade = require('gulp-jade'),
    markdown = require('gulp-markdown'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    stylus = require('gulp-stylus'),
    //sass = require('gulp-sass'),
    //sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    iconfont = require('gulp-iconfont'),
    //fs = require('fs'),
    //pkgSync = JSON.parse(fs.readFileSync('./package.json')),
    pkg = require('./package.json');


// @subsection Global variables
// -----------------------------------------------------------------------------

var source = './Root', // Dossier sur lequel s'effectue les tâches Gulp
    input = source + '/**/*'; // Tous les fichiers du dossier

var consoleLog = function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    };

// -----------------------------------------------------------------------------
// @section Browser Sync
// -----------------------------------------------------------------------------

// @link https://www.browsersync.io/docs/gulp/
// @documentation https://www.browsersync.io/docs/options/

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: source
    },
    port: 9000,
    open: true, // Ouverture automatique du navigateur ('false', 'local', 'external', 'ui', 'tunnel')
    logLevel: 'debug', // Informations essentielles seulement
    reloadDebounce: 2000, // Temps mini entre deux réactualisations de page
    logFileChanges: false, // Information sur les fichiers traités (désactivé car verbeux...)
    notify: false // Fenêtre popin de Browser Sync
  });
});


// -----------------------------------------------------------------------------
// @section FTP
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/vinyl-ftp

// gulp.task( 'deploy', function() {
//     var conn = ftp.create( {
//         host:     'localhost',
//         user:     'admin',
//         password: 'mypass',
//         parallel: 10,
//         log:      gutil.log
//     });
//     var globs = [
//         source
//     ];
//     // using base = '.' will transfer everything to /public_html correctly 
//     // turn off buffering in gulp.src for best performance 
//     return gulp.src( globs, {
//         base: '.', // Spécifie la base pour éviter les erreurs de transfert
//         buffer: false // Désactive le buffer de gulp.src pour de meilleures performance
//     })
//         .pipe( conn.newer( '/public_html' ) ) // only upload newer files 
//         .pipe( conn.dest( '/public_html' ) );
// });


// -----------------------------------------------------------------------------
// @section Jade
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-jade
// @documentation Jade @see http://jade-lang.com/api/

var inputHtmlJade = source + '/**/*.html.jade',
    inputPhpJade = source + '/**/*.php.jade';

gulp.task('jade', function() {
  return gulp
    .src([inputHtmlJade, inputPhpJade])
    //.pipe(changed(source)) // Traitement pour les fichiers changé uniquement @todo En test...
    .pipe(plumber())
    .pipe(jade({
      pretty: true // Idendation du code
    }))
    .pipe(rename(function(path) {
      path.extname = '' // Enlève l'extention '.jade' sur le fichier créé
    }))
    .pipe(replace(/@@pkg.version/g, pkg.version)) // récupération de la version du build
    // BEGIN traitement des balises php sélectionnées
    .pipe(replace(/<_php>/g, '<?php ')) // Balises d'ouverture
    .pipe(replace(/<\/_php>/g, '; ?>')) // Balises de fermeture
    .pipe(replace(/<_var>/g, '<?php echo ')) // Traitement des variables php ($ ou $$)
    .pipe(replace(/<\/_var>/g, '; ?>'))
    .pipe(replace(/<_if>/g, '<?php if (')) // _if => if(string):
    .pipe(replace(/<\/_if>/g, '): ?>'))
    .pipe(replace(/<_else>/g, '<?php else: ?>')) // _else => else:
    .pipe(replace(/<\/_else>/g, ''))
    .pipe(replace(/<_elseif>/g, '<?php elseif (')) // _elseif => elseif(string):
    .pipe(replace(/<\/_elseif>/g, '): ?>'))
    .pipe(replace(/<_endif>/g, '<?php endif; ?>')) // _endif => endif;
    .pipe(replace(/<\/_endif>/g, ''))
    .pipe(replace(/<_require>/g, '<?php require \'')) // _require => require 'string.php';
    .pipe(replace(/<\/_require>/g, '.php\'; ?>'))
    .pipe(replace(/<_require_wp>/g, '<?php require locate_template(\'')) // require de WordPress
    .pipe(replace(/<\/_require_wp>/g, '.php\'); ?>'))
    .pipe(replace(/(\?>)(\n.*)(<\?php )/g, '$2      ')) // Suppression des balises d'ouverture et de fermeture si saut de ligne. @note Cette regex doit être placée après toutes les autres.
    // END traitement des balises php
    .pipe(gulp.dest(source))
    .pipe(browserSync.stream({match: '**/*.html'}));
});


// -----------------------------------------------------------------------------
// @section Markdown
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-markdown
// @documentation Markdown @see https://github.com/chjj/marked#options-1

gulp.task('markdown', function() {
    return gulp.src(source + '/*.md')
        .pipe(markdown())
        .pipe(gulp.dest(source));
});


// -----------------------------------------------------------------------------
// @section Scripts
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-jshint
// @link https://www.npmjs.com/package/gulp-uglify

var inputScripts = source + '/Scripts/Sources/**/*.js';

gulp.task('scripts', function() {
  return gulp
    .src(inputScripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    //.pipe(concat('Main.js')) // @todo Concat n'est pas nécessaire pour l'instant, juste en prévision de...
    .pipe(uglify())
    .pipe(browserSync.stream({match: '**/*.js'}))
    .pipe(gulp.dest(source + '/Public/Scripts'));
});


// -----------------------------------------------------------------------------
// @section Styles
// -----------------------------------------------------------------------------

// @note Compilation des Styles via un préprocesseur. Choix possible entre Stylus, Ruby Sass ou LibSass.
// @important Ne pas oublier de charger la dépendance adéquate, les 3 dépendances ne peuvent être chargées en même temps.
// @note Pour Sass : libSass (en C++) est plus rapide que Ruby, mais limitée dans sa compatibilité des fonctionnalités Sass.


// @subsection Stylus
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-stylus

var inputStyles = source + '/Styles/*.styl',
    autoprefixerOptions = { browsers: ['last 2 versions', '> 5%'] };

// Version de production :
gulp.task('styles', function() {
  return gulp
    .src(inputStyles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus({
        compress: true,
        linenos: false // Commentaires indiquant la ligne du fichier Stylus impliqué
    }))
    .on('error', function(err) {
        console.error('Error!', err.message);
    })
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write('../Styles/Maps', {addComment: true}))
    .pipe(gulp.dest(source + '/Public/Styles'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Version non compressée pour la vérification du code généré en sortie :
gulp.task('stylesexp', function() {
  return gulp
    .src(inputStyles)
    .pipe(plumber())
    //.pipe(sourcemaps.init())
    .pipe(stylus({
        compress: false,
        linenos: true
    }))
    .on('error', function(err) {
        console.error('Error!', err.message);
    })
    .pipe(autoprefixer(autoprefixerOptions))
    //.pipe(sourcemaps.write('../Styles/Maps', {addComment: true}))
    .pipe(gulp.dest(source + '/Public/Styles/Expanded'));
});


// @subsection Ruby Sass
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-ruby-sass

//var inputStyles = source + '/Styles/*.scss',
//    autoprefixerOptions = { browsers: ['last 2 versions', '> 5%'] };

// Options :
// [1] Évite la colision des fichiers avec les autres tâches Ruby Sass
// [2] Mode de compression du fichier
// [3] Précision après la virgule pour les nombres décimaux
// [4] Pas de sourcemap via le plugin 'gulp-ruby-sass', les sourcemaps sont générées préférentiellement via le plugin 'gulp-sourcemaps' dédié à cette tâche

// var inputStyles = source + '/Styles/*.scss';
//
// gulp.task('styles', function() {
//   return sass(inputStyles, {
//         container: 'Styles',   // [1]
//         style: 'compressed',   // [2]
//         precision: 2,          // [3]
//         sourcemap: false       // [4]
//     })
//     .pipe(plumber())
//     .pipe(sourcemaps.init())
//     .on('error', function(err) {
//         console.error('Error!', err.message);
//     })
//     .pipe(autoprefixer(autoprefixerOptions))
//     .pipe(sourcemaps.write('../Styles/Maps', {addComment: true}))
//     .pipe(gulp.dest(source + '/Public/Styles'));
// });
// 
// gulp.task('stylesexp', function() {
//   return sass(inputStyles, {
//         container: 'Expanded', // [1]
//         style: 'expanded',     // [2]
//         precision: 2,          // [3]
//         sourcemap: false       // [4]
//     })
//     .pipe(plumber())
//     .on('error', function(err) {
//         console.error('Error!', err.message);
//     })
//     .pipe(autoprefixer(autoprefixerOptions))
//     .pipe(gulp.dest(source + '/Public/Styles/Expanded'));
// });


// @subsection LibSass
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-sass

// var inputStyles = source + '/Styles/*.scss',
//    autoprefixerOptions = { browsers: ['last 2 versions', '> 5%'] };
//
// gulp.task('styles', function() {
//   return gulp
//     .src(inputStyles)
//     .pipe(plumber())
//     .pipe(sourcemaps.init())
//     .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
//     .pipe(sourcemaps.write('../Styles/Maps', {addComment: true}))
//     .pipe(autoprefixer(autoprefixerOptions))
//     .pipe(gulp.dest(source + '/Public/Styles'));
// });
// gulp.task('stylesexp', function() {
//   return gulp
//     .src(inputStyles)
//     .pipe(plumber())
//     .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
//     .pipe(autoprefixer(autoprefixerOptions))
//     .pipe(gulp.dest(source + '/Public/Styles/Expanded'));
// });


// -----------------------------------------------------------------------------
// @section Header CSS
// -----------------------------------------------------------------------------


// @subsection Replace
// -----------------------------------------------------------------------------

// @note Modification de l'entête CSS pour chaque modification des Styles

var dateY = new Date().getFullYear(),
    dateM = new Date().getMonth(),
    dateD = new Date().getDate(),
    dateH = new Date().toLocaleTimeString(),
    versionDate = dateY + '-' + dateM + '-' + dateD + ' ' + dateH;

gulp.task('templates', function() {
  return gulp
    .src(source + '/Styles/Partial/Header.styl')
    .pipe(replace(/@name .*\n/g, '@name         ' + pkg.name + '\n'))
    .pipe(replace(/@description .*\n/g, '@description  ' + pkg.description + '\n'))
    .pipe(replace(/@version .*\n/g, '@version      ' + pkg.version + '\n'))
    .pipe(replace(/@lastmodified .*\n/g, '@lastmodified ' + versionDate + '\n'))
    .pipe(replace(/@author .*\n/g, '@author       ' + pkg.author + '\n'))
    .pipe(replace(/@homepage .*\n/g, '@homepage     ' + pkg.homepage + '\n'))
    .pipe(replace(/@license .*\n/g, '@license      ' + pkg.license + '\n'))
    .pipe(gulp.dest(source + '/Styles/Partial'));
});


// @subsection Banner
// -----------------------------------------------------------------------------

// @note Ce plugin ne modifie que le fichier compilé, préférence donné au plugin 'gulp-replace'.

// var banner = ['// -----------------------------------------------------------------------------',
//   '// <%= pkg.name %> - <%= pkg.description %>',
//   '// @version <%= pkg.version %>',
//   '// @link <%= pkg.homepage %>',
//   '// @license <%= pkg.license %>',
//   '// -----------------------------------------------------------------------------',
//   ''].join('\n');
// 
// gulp.task('header', function() {
//   return gulp
//     .src(source + '/Styles/Test.styl')
//     //.pipe(header('Un message...'))
//     .pipe(header(banner, { pkg : pkg } ))
//     .pipe(gulp.dest(source + '/Styles'));
// });


// -----------------------------------------------------------------------------
// @section Images
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-imagemin

var inputImages = source + '/**/*{.jpg,.jpeg,.png,.gif,.svg}';

// @note Traitement des images du thème
gulp.task('images', function() {
  return gulp
    .src(source + '/Images/**/*{.jpg,.jpeg,.png,.gif,.svg}') // @note Ne traiter que le fichier 'Images/', ne surtout pas traiter les fonts SVG.
    .pipe(plumber())
    .pipe(imagemin({ // Allègement des images
        progressive: true
    }))
    .pipe(gulp.dest(source + '/Images'));
});

// @note Préparation des fichiers SVG sources pour la police d'icônes, ne surtout pas traiter directement les fonts SVG car corruption des fichiers.
gulp.task('imagesfont', function() {
  return gulp
    .src(source + '/Fonts/GlyphIconsSources/*.svg')
    .pipe(plumber())
    .pipe(imagemin({ // Allègement des images
        progressive: true
    }))
    .pipe(gulp.dest(source + '/Fonts/GlyphIconsSources'));
});


// -----------------------------------------------------------------------------
// @section Glyph Icons
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-iconfont
// @link https://www.npmjs.com/package/gulp-consolidate
// @link https://www.npmjs.com/package/lodash

// @note gulp-consolidate permet de soutenir un moteur de template, lodash est un moteur de template
// @documentation https://lodash.com/docs

gulp.task('glyphicons', function() {
  return gulp
    .src(source + '/Fonts/GlyphIconsSources/*.svg')
    .pipe(iconfont({
      fontName: 'GlyphIcons', // required
      appendUnicode: true, // recommended option
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'], // default : .ttf, .eot, .woff
      fontHeight: 1024, // Retaille des icônes en 1024X1024
      round: 10e3, // Default value: 10e12
      timestamp: Math.round(Date.now()/1024), // recommended to get consistent builds when watching files
    }))
      .on('glyphs', function(glyphs) {
        var options = {
            glyphs: glyphs.map(function(glyph) {
            return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
            }),
            fontName: 'GlyphIcons',
            fontPath: source + '/Fonts',
            className: 'icon-'
        };
        gulp.src(source + '/Styles/Templates/Icons.styl')
          .pipe(consolidate('lodash', options))
          .pipe(gulp.dest(source + '/Styles/Partial'));
        gulp.src(source + '/Includes/Templates/GlyphIcons.jade')
          .pipe(consolidate('lodash', options))
          .pipe(gulp.dest(source + '/Includes'));
        console.log(glyphs, options);
      })
    .pipe(gulp.dest(source + '/Fonts'));
});


// -----------------------------------------------------------------------------
// @section Watchers
// -----------------------------------------------------------------------------

// @note Fonctionnalité watch native sous Gulp
// @link https://www.npmjs.com/package/gulp-sync

gulp.task('watchjade', function() {
  return gulp.watch(
        source + '/**/*.jade',
        ['jade']
    )
    .on('change', consoleLog);
});

// gulp.task('watchmarkdown', function() {
//   return gulp.watch(
//         source + '/**/*.md',
//         ['markdown']
//     )
//     .on('change', consoleLog);
// });

gulp.task('watchscripts', function() {
  return gulp.watch(
        inputScripts,
        ['scripts']
    )
    .on('change', consoleLog);
});

gulp.task('watchstyles', function() {
  return gulp.watch(
        source + '/Styles/**/*.styl',
        gulpsync.sync(['templates', ['styles', 'stylesexp']])
    )
    .on('change', consoleLog);
});


// -----------------------------------------------------------------------------
// @section Default task
// -----------------------------------------------------------------------------

gulp.task('default', gulpsync.sync(['browserSync', ['images', 'imagesfont', 'watchjade', 'watchscripts', 'watchstyles']])); // pas de tâche glyphicons lancée par défaut. Si celle-ci est souhaitée la mettre en synchronisation après imagesfont.

