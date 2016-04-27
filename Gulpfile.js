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
    ftp = require('vinyl-ftp'),
    consolidate = require('gulp-consolidate'),
    lodash = require('lodash'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    header = require('gulp-header'),
    imagemin = require('gulp-imagemin'),
    jade = require('gulp-jade'),
    markdown = require('gulp-markdown'),
    coffee = require('gulp-coffee'),
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
// @section Jade
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-jade
// @documentation Jade @see http://jade-lang.com/api/

var inputJade = source + '/**/*.jade',
    inputHtmlJade = source + '/**/*.html.jade',
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
    // BEGIN PHP
    .pipe(replace(/(<_php>)(\$\S*)(<\/_php>)/g, '<?php echo $2; ?>')) // Si instruction $ suivit de caractères sans espaces blancs, alors il s'agit d'une variable php isolée à afficher. Ex : _php $name => <?php echo $name; ?>
    .pipe(replace(/(<_php>)((.|\r|\n|\t)*?)(<\/_php>)/g, '<?php $2; ?>')) // _php => balises php d'ouverture et de fermeture avec point virgule final)
    .pipe(replace(/(<\?php )((.|\r|\n|\t)*?)(\/\/.*)(\n)?(; \?>)/g, '<?php $2$4 ?>')) // Si commentaire php monoligne en fin de code alors pas de point virgule final
    .pipe(replace(/(\*\/)(\n)?(; \?>)/g, '*/ ?>')) // Idem pour commantaires multilignes
    .pipe(replace(/(<_if>)(.*)(<\/_if>)/g, '<?php if ($2): ?>')) // _if => if(string):
    .pipe(replace(/<_else><\/_else>/g, '<?php else: ?>')) // _else => else:
    .pipe(replace(/(<_elseif>)(.*)(<\/_elseif>)/g, '<?php elseif ($2): ?>')) // _elseif => elseif(string):
    .pipe(replace(/<_endif><\/_endif>/g, '<?php endif; ?>')) // _endif => endif;
    .pipe(replace(/(<_require>)(.*)(<\/_require>)/g, '<?php require \'$2.php\'; ?>')) // _require => require 'string.php';
    .pipe(replace(/<_require_wp>/g, '<?php require locate_template(\'')) // Require de WordPress
    .pipe(replace(/<\/_require_wp>/g, '.php\'); ?>'))
    .pipe(replace(/( \?>)(\n.*)(<\?php )/g, '$2      ')) // Suppression des balises d'ouverture et de fermeture si saut de ligne. @note Cette regex doit être placée après toutes les autres traitant des balises php block.
    .pipe(replace(/({% )(\$\S*)( %})/g, '<?php echo $2; ?>')) // Si instruction $ suivit de caractères sans espaces blancs, alors il s'agit d'une variable php isolée à afficher. Ex : {% $name %} => <?php echo $name; ?>
    .pipe(replace(/({% )(.*)( %})/g, '<?php $2; ?>')) // Sinon il s'agit de balises php d'ouverture et de fermeture en ligne
    .pipe(replace(/;; ?>/g, '; ?>')) // Suppression points virgules doublés
    // END PHP
    .pipe(replace(/(\n)(<)/, '$2')) // Correction pour Jade : enlève le premier saut de ligne en début de fichier
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
// @section Banner Replace
// -----------------------------------------------------------------------------

// @description Modification des entêtes JS et CSS pour chaque modification des Styles

var dateY = new Date().getFullYear(),
    dateM = new Date().getMonth(),
    dateD = new Date().getDate(),
    dateH = new Date().toLocaleTimeString(),
    versionDate = dateY + '-' + dateM + '-' + dateD + ' ' + dateH;

gulp.task('metastyles', function() {
  return gulp
    .src(source + '/Styles/Partial/Header.styl')
    .pipe(replace(/@name .*\n/, '@name         ' + pkg.name + '\n'))
    .pipe(replace(/@description .*\n/, '@description  ' + pkg.description + '\n'))
    .pipe(replace(/@version .*\n/, '@version      ' + pkg.version + '\n'))
    .pipe(replace(/@lastmodified .*\n/, '@lastmodified ' + versionDate + '\n'))
    .pipe(replace(/@author .*\n/, '@author       ' + pkg.author + '\n'))
    .pipe(replace(/@homepage .*\n/, '@homepage     ' + pkg.homepage + '\n'))
    .pipe(replace(/@license .*\n/, '@license      ' + pkg.license + '\n'))
    .pipe(gulp.dest(source + '/Styles/Partial'));
});

gulp.task('metascripts', function() {
  return gulp
    .src(source + '/Scripts/Sources/Main.js')
    .pipe(replace(/@name .*\n/, '@name         ' + pkg.name + '\n'))
    .pipe(replace(/@description .*\n/, '@description  ' + pkg.description + '\n'))
    .pipe(replace(/@version .*\n/, '@version      ' + pkg.version + '\n'))
    .pipe(replace(/@lastmodified .*\n/, '@lastmodified ' + versionDate + '\n'))
    .pipe(replace(/@author .*\n/, '@author       ' + pkg.author + '\n'))
    .pipe(replace(/@homepage .*\n/, '@homepage     ' + pkg.homepage + '\n'))
    .pipe(replace(/@license .*\n/, '@license      ' + pkg.license + '\n'))
    .pipe(gulp.dest(source + '/Scripts/Sources'));
});


// -----------------------------------------------------------------------------
// @section Banner
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

// @note 'gulp-consolidate' permet de soutenir un moteur de template, 'lodash' est un moteur de template
// @documentation https://lodash.com/docs

gulp.task('glyphicons', function() {
  return gulp
    .src(source + '/Fonts/GlyphIconsSources/*.svg')
    .pipe(iconfont({
      fontName: 'GlyphIcons', // required
      appendUnicode: true, // recommended option
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'], // default : .ttf, .eot, .woff
      fontHeight: 1024, // Retaille des icônes en 1024X1024
      round: 10e3, // Trois décimales (default value: 10e12)
      timestamp: Math.round(Date.now()/1024), // Recommandé pour obtenir une construction cohérente
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
        inputJade,
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
        gulpsync.sync(['metascripts', 'scripts'])
    )
    .on('change', consoleLog);
});

gulp.task('watchstyles', function() {
  return gulp.watch(
        source + '/Styles/**/*.styl',
        gulpsync.sync(['metastyles', ['styles', 'stylesexp']])
    )
    .on('change', consoleLog);
});


// -----------------------------------------------------------------------------
// @section Default task
// -----------------------------------------------------------------------------

gulp.task('default', gulpsync.sync(['browserSync', ['images', 'imagesfont', 'watchjade', 'watchscripts', 'watchstyles']])); // pas de tâche glyphicons lancée par défaut. Si celle-ci est souhaitée la mettre en synchronisation après imagesfont.

