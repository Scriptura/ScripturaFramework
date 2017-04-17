// -----------------------------------------------------------------------------
// @title       Gulpfile.js
// @description Tasks runner for the project
// @link        http://gulpjs.com/
// -----------------------------------------------------------------------------

'use strict';


// -----------------------------------------------------------------------------
// @section Commandes
// -----------------------------------------------------------------------------

// Commandes principales pour le projet :
// `gulp` : commande globale
// `gulp images` : traitement des images
// `gulp glyphmin` : minification des svg de la police d'icônes GlyphIcons
// `gulp icons` : refonte de la police d'icônes GlyphIcons avec ses styles et le html de démonstration
// Les autres commandes sont lancées automatiquement après la surveillance des fichiers (watcher) initialisée par la commande globale.


// -----------------------------------------------------------------------------
// @section Ongoing project
// -----------------------------------------------------------------------------

// @todo Source différente en fonction de la commande gulp :
// @link http://stackoverflow.com/questions/23023650/is-it-possible-to-pass-a-flag-to-gulp-to-have-it-run-tasks-in-different-ways
// @link https://www.npmjs.com/package/yargs
// @link https://www.npmjs.com/package/gulp-if/


// -----------------------------------------------------------------------------
// @section Variables
// -----------------------------------------------------------------------------

// @subsection Dependencies
// -----------------------------------------------------------------------------

// @note `npm i -D gulp-*` == `npm install --save-dev gulp-*`

const gulp = require( 'gulp' ),
      del = require( 'del' ),
      ftp = require( 'vinyl-ftp' ),
      lodash = require( 'lodash' ),
      bs = require( 'browser-sync' ).create(),
      gulpsync = require( 'gulp-sync' )( gulp ),
      gutil = require( 'gulp-util' ),
      plumber = require( 'gulp-plumber' ),
      consolidate = require( 'gulp-consolidate' ),
      concat = require( 'gulp-concat' ),
      rename = require( 'gulp-rename' ),
      replace = require( 'gulp-replace' ),
      header = require( 'gulp-header' ),
      imageResize = require( 'gulp-image-resize' ),
      imagemin = require( 'gulp-imagemin' ),
      pug = require( 'gulp-pug' ),
      markdown = require( 'gulp-markdown' ),
      coffee = require( 'gulp-coffee' ),
      jshint = require( 'gulp-jshint' ),
      uglify = require( 'gulp-uglify' ),
      stylus = require( 'gulp-stylus' ),
      //sass = require( 'gulp-sass' ),
      //sass = require( 'gulp-ruby-sass' ),
      autoprefixer = require( 'gulp-autoprefixer' ),
      sourcemaps = require( 'gulp-sourcemaps' ),
      iconfont = require( 'gulp-iconfont' ),
      //fs = require( 'fs' ),
      //pkgSync = JSON.parse( fs.readFileSync( './package.json' ) ),
      pkg = require( './package.json' );


// @subsection Global variables
// -----------------------------------------------------------------------------

var source = './Root', // Dossier sur lequel s'effectue les tâches Gulp
    input = source + '/**/*'; // Tous les fichiers du dossier

var consoleLog = function( event ) {
    console.log( 'File ' + event.path + ' was ' + event.type + ', running tasks...' );
};


// -----------------------------------------------------------------------------
// @section Browser Sync
// -----------------------------------------------------------------------------

// @link https://www.browsersync.io/docs/gulp/
// @documentation https://www.browsersync.io/docs/options/

gulp.task( 'bs', function() {
  bs.init( {
    server : {
      baseDir : source
    },
    port : 9000, // http://localhost:9000/ or http://192.168.0.10:9000/
    open : 'external', // Ouverture automatique du navigateur (true, false, 'local', 'external', 'ui', 'tunnel')
    logLevel : 'debug', // Informations essentielles seulement
    reloadDebounce : 2000, // Temps mini entre deux réactualisations de page
    logFileChanges : false, // Information sur les fichiers traités (désactivé car verbeux...)
    notify : false // Fenêtre popin de Browser Sync
  } );
} );


// -----------------------------------------------------------------------------
// @section Pug
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-pug
// @documentation :
// @link https://pugjs.org/api/getting-started.html
// @link https://pugjs.org/api/reference.html#options

var inputPug = source + '/**/*.pug',
    inputHtmlPug = source + '/**/*.html.pug',
    inputPhpPug = source + '/**/*.php.pug';

gulp.task( 'pug', function() {
  return gulp
    .src( [ inputHtmlPug, inputPhpPug ] )
    //.pipe( changed( source ) ) // Traitement pour les fichiers changé uniquement @todo En test...
    .pipe( plumber() )
    .pipe( pug( {
      pretty : true // Indendation du code
    } ) )
    .pipe( rename( function( path ) {
      path.extname = '' // Enlève l'extention '.pug' sur le fichier créé
    } ) )
    .pipe( replace( /@@pkg.version/g, pkg.version ) ) // Récupération de la version du build
    // BEGIN PHP
    .pipe( replace( /(<_php>)(\$\S*)(<\/_php>)/g, '<?php echo $2; ?>' ) ) // Si instruction $ suivit de caractères sans espaces blancs, alors il s'agit d'une variable php isolée à afficher. Ex : _php $name => <?php echo $name; ?>
    .pipe( replace( /(<_php>)((.|\r|\n|\t)*?)(<\/_php>)/g, '<?php $2; ?>' ) ) // _php => balises php d'ouverture et de fermeture avec point virgule final)
    .pipe( replace( /(<\?php )((.|\r|\n|\t)*?)(\/\/.*)(\n)?(; \?>)/g, '<?php $2$4 ?>' ) ) // Si commentaire php monoligne en fin de code alors pas de point virgule final
    .pipe( replace( /(\*\/)(\n)?(; \?>)/g, '*/ ?>' ) ) // Idem pour commantaires multilignes
    .pipe( replace( /(<_if>)(.*)(<\/_if>)/g, '<?php if ($2): ?>' ) ) // _if => if(string):
    .pipe( replace( /<_else><\/_else>/g, '<?php else: ?>' ) ) // _else => else:
    .pipe( replace( /(<_elseif>)(.*)(<\/_elseif>)/g, '<?php elseif ($2): ?>' ) ) // _elseif => elseif(string):
    .pipe( replace( /<_endif><\/_endif>/g, '<?php endif; ?>' ) ) // _endif => endif;
    .pipe( replace( /(<_require>)(.*)(<\/_require>)/g, '<?php require \'$2.php\'; ?>' ) ) // _require => require 'string.php';
    .pipe( replace( /(<_require_once>)(.*)(<\/_require_once>)/g, '<?php require_once \'$2.php\'; ?>' ) ) // _require => require 'string.php';
    .pipe( replace( /<_require_wp>/g, '<?php require locate_template(\'' ) ) // `require` lié à WordPress
    .pipe( replace( /<\/_require_wp>/g, '.php\'); ?>' ) )
    .pipe( replace( /<_require_once_wp>/g, '<?php require_once locate_template(\'' ) ) // `require_once` lié à WordPress
    .pipe( replace( /<\/_require_once_wp>/g, '.php\'); ?>' ) )
    .pipe( replace( /( \?>)(\n.*)(<\?php )/g, '$2      ' ) ) // Suppression des balises d'ouverture et de fermeture si saut de ligne. @note Cette regex doit être placée après toutes les autres traitant des balises php block.
    .pipe( replace( /({% )(\$\S*)( %})/g, '<?php echo $2; ?>' ) ) // Si instruction $ suivit de caractères sans espaces blancs, alors il s'agit d'une variable php isolée à afficher. Ex : {% $name %} => <?php echo $name; ?>
    .pipe( replace( /({% )(.*)( %})/g, '<?php $2; ?>' ) ) // Sinon il s'agit de balises php d'ouverture et de fermeture en ligne
    .pipe( replace( /;; ?>/g, '; ?>' ) ) // Suppression points virgules doublés
    // END PHP
    // BEGIN Pug
    //.pipe( replace( /<!DOCTYPE html>/, '<!DOCTYPE html>\n' ) ) // Saut de ligne après le doctype
    //.pipe( replace( /(\n)(<)/, '$2' ) ) // Enlève le premier saut de ligne en début de fichier
    .pipe( replace( /(-->)/g, ' $1' ) ) // Ajout d'un espace en fin de commentaire
    // END Pug
    .pipe( gulp.dest( source ) )
    .pipe( bs.stream( { match : '**/*.html' } ) );
} );


// -----------------------------------------------------------------------------
// @section Markdown
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-markdown
// @documentation Markdown @see https://github.com/chjj/marked#options-1

gulp.task( 'markdown', function() {
    return gulp.src( source + '/*.md' )
        .pipe( markdown() )
        .pipe( gulp.dest( source ) );
} );


// -----------------------------------------------------------------------------
// @section Scripts
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-jshint
// @link https://www.npmjs.com/package/gulp-uglify

var inputScripts = source + '/Scripts/Sources/**/*.js',
    outputScripts = source + '/Public/Scripts';

gulp.task( 'scripts', function() {
  return gulp
    .src( inputScripts )
    .pipe( plumber() )
    .pipe( jshint() )
    .pipe( jshint.reporter( 'default' ) )
    //.pipe( concat( 'Main.js' ) ) // @todo Concat n'est pas nécessaire pour l'instant, juste en prévision de...
    .pipe( uglify() )
    .pipe( bs.stream( { match : '**/*.js' } ) )
    .pipe( gulp.dest( outputScripts ) );
} );


// -----------------------------------------------------------------------------
// @section Styles
// -----------------------------------------------------------------------------

// @note Compilation des Styles via un préprocesseur. Choix possible entre Stylus, Ruby Sass ou LibSass.
// @important Ne pas oublier de charger la dépendance adéquate, les 3 dépendances ne peuvent être chargées en même temps.
// @note libSass, porté sous C++, est plus rapide que Ruby Sass, mais limité dans sa compatibilité des fonctionnalités Sass.


// @subsection Stylus
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-stylus

var inputStyles = source + '/Styles/*.styl',
    outputStyles = source + '/Public/Styles',
    outputStylesExpanded = source + '/Public/Styles/Expanded',
    autoprefixerOptions = { browsers : [ 'last 2 versions', '> 5%' ] };

// gulp.task( 'deletstyles', function() { // Suppression des anciens fichiers de styles
//     del( [ outputStyles, outputStylesExpanded ] );
// } );

gulp.task( 'styles', function() { // Version de production
  return gulp
    .src( inputStyles )
    .pipe( plumber() )
    .pipe( sourcemaps.init() )
    .pipe( stylus( {
        compress : true,
        linenos : false // Commentaires indiquant la ligne du fichier Stylus impliqué
    } ) )
    .on('error', function( err ) {
        console.error( 'Error!', err.message );
    } )
    .pipe( autoprefixer( autoprefixerOptions ) )
    .pipe( sourcemaps.write( '../Styles/Maps', { addComment : true } ) )
    .pipe( gulp.dest( outputStyles ) )
    .pipe( bs.stream( { match : '**/*.css' } ) );
} );

gulp.task( 'stylesexp', function() { // Version non compressée permettant un contrôle du code généré en sortie
  return gulp
    .src( inputStyles )
    .pipe( plumber() )
    //.pipe( sourcemaps.init() )
    .pipe( stylus( {
        compress : false,
        linenos : false
    } ) )
    .on( 'error', function( err ) {
        console.error( 'Error!', err.message );
    } )
    .pipe( autoprefixer( autoprefixerOptions ) )
    //.pipe( sourcemaps.write( '../Styles/Maps', {addComment: true } ) )
    .pipe( gulp.dest( outputStylesExpanded ) );
} );


// @subsection Ruby Sass
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-ruby-sass

// var inputStyles = source + '/Styles/*.scss',
//     autoprefixerOptions = { browsers : [ 'last 2 versions', '> 5%' ] };

// Options :
// [1] Évite la colision des fichiers avec les autres tâches Ruby Sass
// [2] Mode de compression du fichier
// [3] Précision après la virgule pour les nombres décimaux
// [4] Pas de sourcemap via le plugin 'gulp-ruby-sass', les sourcemaps sont générées préférentiellement via le plugin 'gulp-sourcemaps' dédié à cette tâche

// var inputStyles = source + '/Styles/*.scss';
//
// gulp.task( 'styles', function() {
//   return sass( inputStyles, {
//         container : 'Styles',   // [1]
//         style : 'compressed',   // [2]
//         precision : 2,          // [3]
//         sourcemap : false       // [4]
//     } )
//     .pipe( plumber() )
//     .pipe( sourcemaps.init() )
//     .on( 'error', function( err ) {
//         console.error( 'Error!', err.message );
//     } )
//     .pipe( autoprefixer( autoprefixerOptions ) )
//     .pipe( sourcemaps.write( '../Styles/Maps', { addComment : true } ) )
//     .pipe( gulp.dest( source + '/Public/Styles' ) );
// } );
// 
// gulp.task( 'stylesexp', function() {
//   return sass( inputStyles, {
//         container : 'Expanded', // [1]
//         style : 'expanded',     // [2]
//         precision : 2,          // [3]
//         sourcemap : false       // [4]
//     } )
//     .pipe( plumber() )
//     .on( 'error', function( err ) {
//         console.error( 'Error!', err.message );
//     } )
//     .pipe( autoprefixer( autoprefixerOptions ) )
//     .pipe( gulp.dest( source + '/Public/Styles/Expanded' ) );
// } );


// @subsection LibSass
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-sass

// var inputStyles = source + '/Styles/*.scss',
//    autoprefixerOptions = { browsers : [ 'last 2 versions', '> 5%' ] };
//
// gulp.task( 'styles', function() {
//   return gulp
//     .src( inputStyles )
//     .pipe( plumber() )
//     .pipe( sourcemaps.init() )
//     .pipe( sass( { outputStyle : 'compressed' } ).on( 'error', sass.logError ) )
//     .pipe( sourcemaps.write( '../Styles/Maps', { addComment: true } ) )
//     .pipe( autoprefixer( autoprefixerOptions ) )
//     .pipe( gulp.dest( source + '/Public/Styles' ) );
// } );
// gulp.task( 'stylesexp', function() {
//   return gulp
//     .src( inputStyles )
//     .pipe( plumber() )
//     .pipe( sass( { outputStyle : 'expanded' } ).on( 'error', sass.logError ) )
//     .pipe( autoprefixer( autoprefixerOptions ) )
//     .pipe( gulp.dest( source + '/Public/Styles/Expanded' ) );
// } );


// -----------------------------------------------------------------------------
// @section Banner Replace
// -----------------------------------------------------------------------------

// @description Modification des entêtes JS et CSS pour chaque modification des Styles

var dateY = new Date().getFullYear(),
    dateM = ( '0' + ( new Date().getMonth() + 1 ) ).slice( -2 ), // Janvier = 0
    dateD = ( '0' + ( new Date().getDate() ) ).slice( -2 ),
    dateH = new Date().toLocaleTimeString(),
    versionDate = dateY + '-' + dateM + '-' + dateD + ' ' + dateH;

gulp.task( 'metastyles', function() {
  return gulp
    .src( source + '/Styles/Partial/Header.styl' )
    .pipe( replace( /@name .*\n/, '@name         ' + pkg.name + '\n' ) )
    .pipe( replace( /@description .*\n/, '@description  ' + pkg.description + '\n' ) )
    .pipe( replace( /@version .*\n/, '@version      ' + pkg.version + '\n' ) )
    .pipe( replace( /@lastmodified .*\n/, '@lastmodified ' + versionDate + '\n' ) )
    .pipe( replace( /@author .*\n/, '@author       ' + pkg.author + '\n' ) )
    .pipe( replace( /@homepage .*\n/, '@homepage     ' + pkg.homepage + '\n' ) )
    .pipe( replace( /@license .*\n/, '@license      ' + pkg.license + '\n' ) )
    .pipe( gulp.dest( source + '/Styles/Partial' ) );
} );

gulp.task( 'metascripts', function() {
  return gulp
    .src( source + '/Scripts/Sources/Main.js' )
    .pipe( replace( /@name .*\n/, '@name         ' + pkg.name + '\n' ) )
    .pipe( replace( /@description .*\n/, '@description  ' + pkg.description + '\n' ) )
    .pipe( replace( /@version .*\n/, '@version      ' + pkg.version + '\n' ) )
    .pipe( replace( /@lastmodified .*\n/, '@lastmodified ' + versionDate + '\n' ) )
    .pipe( replace( /@author .*\n/, '@author       ' + pkg.author + '\n' ) )
    .pipe( replace( /@homepage .*\n/, '@homepage     ' + pkg.homepage + '\n' ) )
    .pipe( replace( /@license .*\n/, '@license      ' + pkg.license + '\n' ) )
    .pipe( gulp.dest( source + '/Scripts/Sources' ) );
} );


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
// gulp.task( 'header', function() {
//   return gulp
//     .src( source + '/Styles/Test.styl' )
//     //.pipe( header( 'Un message...' ) )
//     .pipe( header( banner, { pkg : pkg } ) )
//     .pipe( gulp.dest( source + '/Styles' ) );
// } );


// -----------------------------------------------------------------------------
// @section Images
// -----------------------------------------------------------------------------


// @subsection  Image Resize
// @description Redimensionnement des images
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-image-resize
// @note Nécessitée d'installer ImageMagick et GraphicsMagick pour exécuter la fonction.
// @note Utilisation de GraphicsMagick par défaut.

var inputImagesSources = source + '/Images/DemoSources/*.{jpg,jpeg,png}', // @note Ne traiter que le fichier 'Public/Images/', ne surtout pas traiter les fonts SVG.
    outputImagesSources = source + '/Images/Demo';

gulp.task( 'deletimages', function() { // Suppression des images
    del( outputImagesSources );
} );

gulp.task( 'copyimages', function() { // Copie de l'image source
  return gulp
    .src( inputImagesSources )
    .pipe( gulp.dest( outputImagesSources ) );
} );

let arr = [ 300, 400, 600, 800, 1000, 1500, 2000 ];

for ( let val of arr ) {
    gulp.task( 'imagesresize' + val, function() { // Landscape
      return gulp
        .src( inputImagesSources )
        .pipe( plumber() )
        .pipe( imageResize( {
            width : val,
            upscale : false
            //imageMagick : true // @note Si 'false' : utilisation de GraphicsMagick
        } ) )
        .pipe( rename( function( path ) {
            path.basename += val
        } ) )
        .pipe( gulp.dest( outputImagesSources ) );
    } );
}

for ( let val of arr ) {
    gulp.task( 'imagesresizeP' + val, function() { // Portrait
      return gulp
        .src( inputImagesSources )
        .pipe( plumber() )
        .pipe( imageResize( {
            width : val / 1.8, // Aspect ratio
            height : val,
            crop : true,
            upscale : true
        } ) )
        .pipe( rename( function( path ) {
            path.basename += 'P' + val
        } ) )
        .pipe( gulp.dest( outputImagesSources ) );
    } );
}

for ( let val of arr ) {
    gulp.task( 'imagesresizeS' + val, function() { // Square
      return gulp
        .src( inputImagesSources )
        .pipe( plumber() )
        .pipe( imageResize( {
            width : val,
            height : val,
            crop : true,
            upscale : true
        } ) )
        .pipe( rename( function( path ) {
            path.basename += 'S' + val
        } ) )
        .pipe( gulp.dest( outputImagesSources ) );
    } );
}


// @subsection  Image Min
// @description Minification des images
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-imagemin
// @note Ne surtout pas traiter directement les fonts SVG car corruption des fichiers.

var inputImages = source + '/Images/**/*.{ jpg, jpeg, png, gif, svg }'; // @note Ne traiter que le fichier 'Public/Images/'

// @note Traitement des images du thème
gulp.task( 'imagesmin', function() {
  return gulp
    .src( inputImages )
    .pipe( plumber() )
    .pipe( imagemin( { // Allègement des images
        progressive : true
    } ) )
    .pipe( gulp.dest( source + '/Images' ) );
} );


// @subsection  Fonts
// @description Minification des svg de la police GlyphIcons
// -----------------------------------------------------------------------------

gulp.task( 'glyphmin', function() {
  return gulp
    .src( source + '/Fonts/GlyphIconsSources/*.svg' )
    .pipe( plumber() )
    .pipe( imagemin( { // Allègement des images
        progressive : true
    } ) )
    .pipe( gulp.dest( source + '/Fonts/GlyphIconsSources' ) );
} );


// -----------------------------------------------------------------------------
// @section     Glyph Icons
// @description Refonte de la police d'icônes GlyphIcons
// -----------------------------------------------------------------------------

// @link https://www.npmjs.com/package/gulp-iconfont
// @link https://www.npmjs.com/package/gulp-consolidate
// @link https://www.npmjs.com/package/lodash
// @note 'gulp-consolidate' permet de soutenir un moteur de template, 'lodash' est un moteur de template
// @documentation https://lodash.com/docs

gulp.task( 'glyphicons', function() {
  return gulp
    .src( source + '/Fonts/GlyphIconsSources/*.svg' )
    .pipe( iconfont( {
      fontName : 'GlyphIcons', // required
      prependUnicode : true, // recommended option
      formats : [ 'ttf', 'eot', 'woff', 'woff2', 'svg' ], // default : 'ttf', 'eot', 'woff'
      fontHeight : 1024, // Retaille des icônes en 1024X1024
      round : 10e3, // Trois décimales (default value: 10e12)
      timestamp : Math.round( Date.now() / 1024 ), // Recommandé pour obtenir une construction cohérente
    } ) )
    .on( 'glyphs', function( glyphs ) {
      var options = {
          glyphs : glyphs.map( function( glyph ) {
              return {
                  name : glyph.name,
                  codepoint : glyph.unicode[0].charCodeAt(0)
              }
          } ),
          fontName : 'GlyphIcons',
          fontPath : source + '/Fonts',
          className : 'icon-'
      };
      gulp.src( source + '/Styles/Templates/Icons.styl' )
        .pipe( consolidate( 'lodash', options ) )
        .pipe( gulp.dest( source + '/Styles/Partial' ) );
      gulp.src( source + '/Includes/Templates/GlyphIcons.pug' )
        .pipe( consolidate( 'lodash', options ) )
        .pipe( gulp.dest( source + '/Includes' ) );
      console.log( glyphs, options );
    } )
  .pipe( gulp.dest( source + '/Fonts' ) );
} );


// -----------------------------------------------------------------------------
// @section Watchers
// -----------------------------------------------------------------------------

// @note Fonctionnalité watch native sous Gulp
// @link https://www.npmjs.com/package/gulp-sync

gulp.task( 'watchpug', function() {
  return gulp.watch(
        inputPug,
        [ 'pug' ]
    )
    .on( 'change', consoleLog );
} );

// gulp.task('watchmarkdown', function() {
//   return gulp.watch(
//         source + '/**/*.md',
//         [ 'markdown' ]
//     )
//     .on( 'change', consoleLog );
// } );

gulp.task( 'watchscripts', function() {
  return gulp.watch(
        inputScripts,
        gulpsync.sync( [ 'metascripts', 'scripts' ] )
    )
    .on( 'change', consoleLog );
} );

gulp.task( 'watchstyles', function() {
  return gulp.watch(
        source + '/Styles/**/*.styl',
        gulpsync.sync( [ 'metastyles', [ 'styles', 'stylesexp' ] ] )
    )
    .on( 'change', consoleLog );
} );


// -----------------------------------------------------------------------------
// @section     Tasks
// @description Combiner les tâches
// -----------------------------------------------------------------------------


// @subsection Default tasks
// -----------------------------------------------------------------------------

var tasks = [ 'watchpug', 'watchscripts', 'watchstyles' ]

gulp.task( 'default', gulpsync.sync( [ 'bs', tasks ] ) );


// @subsection  Noserver tasks
// @description Tâche par défaut sans serveur
// -----------------------------------------------------------------------------

gulp.task( 'noserver', tasks );


// @subsection Images tasks
// -----------------------------------------------------------------------------

gulp.task( 'images', gulpsync.sync(
    [ 'deletimages',
        [
            [ 'copyimages',
            'imagesresize300',
            'imagesresize400',
            'imagesresize600',
            'imagesresize800',
            'imagesresize1000',
            'imagesresize1500',
            'imagesresize2000',
            'imagesresizeP300',
            'imagesresizeP400',
            'imagesresizeP600',
            'imagesresizeP800',
            'imagesresizeP1000',
            'imagesresizeP1500',
            'imagesresizeP2000',
            'imagesresizeS300',
            'imagesresizeS400',
            'imagesresizeS600',
            'imagesresizeS800',
            'imagesresizeS1000',
            'imagesresizeS1500',
            'imagesresizeS2000' ],
            'imagesmin' ]
    ]
) );


// @subsection Glyph Icons tasks
// -----------------------------------------------------------------------------

// @note Les tâches de styles sont ajoutées car le style doit être recompilé suite à l'ajout d'icônes

gulp.task( 'icons', gulpsync.sync(
    [ 'glyphmin',
    'glyphicons',
    'styles',
    'stylesexp' ]
) );

