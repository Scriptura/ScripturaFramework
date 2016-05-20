// -----------------------------------------------------------------------------
// @name         Scriptura
// @description  Interface for web apps
// @version      0.0.24
// @lastmodified 2016-05-19 21:26:15
// @author       Olivier Chavarin
// @homepage     http://scriptura.github.io/
// @license      ISC
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// @section     Support
// @description Détecte les supports et ajoute des classes dans le tag html
// -----------------------------------------------------------------------------

// @note Remplace le script Modernizr

( function( $ ) {
	$( 'html' ).addClass( 'js' ).removeClass( 'no-js' ); // Vérification de Javascript
	// Vérification du support de touch ( jQuery )
	//	$(window).one({
	//		tap : function() {
	//			Modernizr.touch = false; // Add this line if you have Modernizr
	//			$( 'html' ).addClass( 'touch' );
	//		}
	//	} );
	// Vérification du support de touch (Vanilla js) :
	var supports = ( function() {
		var html = document.documentElement,
			touch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
		if (touch) {
			html.className += ' touch';
			return {
				touch: true
			};
		}
		else {
			html.className += ' no-touch';
			return {
				touch: false
			};
		}
	} )();
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Media Element JS
// @description Configuration pour MediaElement.js
// -----------------------------------------------------------------------------

( function( $ ) {
	var element = $( 'audio, video' );
	if ( element.length ) {
		// Appel des sripts
		$( 'body' ).append( '<script src="../Scripts/Vendors/MediaElementJS/mediaelement-and-player.min.js"><\/script>' );
		$( 'audio, video' ).mediaelementplayer();
		// Appel des styles
		$( 'head' ).append( '<link rel="stylesheet" href="../Scripts/Vendors/MediaElementJS/mediaelementplayer.css" media="screen">' );
	}
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     External links
// @description Gestion des liens externes au site
// -----------------------------------------------------------------------------

// #note Par défaut, tous les liens externes conduisent à l'ouverture d'un nouvel onglet, sauf les liens de téléchargement

( function( $ ) { // Ajout d'un attribut target_blank sur les liens externes
	$( document ).find( 'a:not(.download-link)' ).filter( function() {
		return this.hostname && this.hostname !== location.hostname;
	} ).attr( 'target', '_blank' );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Main Nav
// @description Menu de navigation principal
// -----------------------------------------------------------------------------

// @note Script remplacé par une solution full CSS
// @see _core.scss
/*
( function( $ ) {
	var nav = $( '.main-nav ul' );
	$( '.brand' ).append( '<button type="button" id="cmd-main-nav" class=""><span></span></button>' );
	$( '#cmd-main-nav' ).on( 'click', function() {
		$( '.main-nav ul' ).slideToggle( 300 ).css( 'display', 'flex' );
		$( this ).toggleClass( 'active' ); // Permet de cibler le bouton si actif
	} );
} )( jQuery );
*/


// -----------------------------------------------------------------------------
// @section     Main Nav Bottom
// @description Menu de navigation principal, position en bas
// -----------------------------------------------------------------------------

// @bugfix @todo La propriété 'overflow:hidden' reste sur le body si redimentionnement de la fenêtre avant fermeture du menu

( function( $ ) {
	var body = $( 'body' );
	var menu = $( '.sizeNav-nav-bottom' );
	var scrollTop = $( '.scroll-top' );
	$( '.sizeNav-nav-bottom button' ).on( 'click touchmove', function() {
		menu.toggleClass( 'active' );
		if (menu.hasClass( 'active' )) {
			body.css( 'overflow', 'hidden' ); // Évite la confusion avec un scrool sur la page
			scrollTop.addClass( 'hidden' );
		} else {
			body.css( 'overflow', 'visible' );
			menu.removeClass( 'active' );
			scrollTop.removeClass( 'hidden' );
		}
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Sections Nav
// @description Navigation entre sections au clavier
// -----------------------------------------------------------------------------

( function( $ ) {
	var doc = $( document ),
		section = $( '.section' ), // Navigation via la classe en paramètre
		menu = $( '.scroll-nav a' ),
		body = $( 'html,body' );
	var topToIndex = function( scrollTop ) {
		var offsetTop = 0,
			indexlastSection;
		section.each( function( i ) {
			offsetTop = $( this ).offset().top;
			if ( scrollTop > offsetTop - 100 ) {
				indexlastSection = i;
			}
		} );
		return indexlastSection;
	};
	var retrieveActive = function() {
		var scrollTop = doc.scrollTop(),
			activeIndex = topToIndex( scrollTop );
		section.removeClass( 'active' ).eq( activeIndex ).addClass( 'active' );
		menu.removeClass( 'active' ).eq( activeIndex ).addClass( 'active' );
		return activeIndex;
	};
	doc.keydown( function( e ) { // raccourci clavier
	var active = $( '.section.active' ), // Navigation via la classe en paramètre + .active
		tag = e.target.tagName.toLowerCase(); // Détecte sur quel élément est exécuté le script
		if (tag != 'input' && tag != 'textarea' ) {
			if ( e.keyCode == 90 ) { // 'z' @bugfix @note Conflit avec arrow left ( '37' )
				body.animate( {
					scrollTop: active.prev().length ? active.prev().offset().top : active.offset().top
				}, 400 );
			}
			if ( e.keyCode == 83 ) { // 's' @bugfix @note Conflit avec arrow right ( '39' )
				body.animate( {
					scrollTop: active.next().length ? active.next().offset().top : active.offset().top
				}, 400 );
			}
		}
	} );
	doc.on( 'scroll', function() {
		retrieveActive();
	} );
	retrieveActive();
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Smooth Scroll
// @description Défilement fluide
// -----------------------------------------------------------------------------

( function( $ ) {
	$( document ).on( 'click', 'a[href*="#"]:not([href="#"])', function() {
		if ( location.pathname.replace( /^\//,'' ) == this.pathname.replace( /^\//,'' ) && location.hostname == this.hostname ) {
			var target = $( this.hash );
			target = target.length ? target : $( '[name=' + this.hash.slice(1) +']' );
			if (target.length) {
				$( 'html, body' ).animate({
					scrollTop: target.offset().top
				}, 400 );
				// @note Pas de 'return false', afin de préserver les ancres
			}
		}
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Body Index
// @description Ajout d'une ID sur le body pour permettre un ciblage de retour en haut
// -----------------------------------------------------------------------------

( function( $ ) {
	$( 'body' ).attr( 'id', 'index' );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Scroll top
// @description Défilement vers le haut
// -----------------------------------------------------------------------------

// @note Vanilla Js de 'scrollTop: 0' : 'window.scrollTo( 0, 0 )'

( function( $ ) {
	$( 'body' ).append( '<a href="" class="scroll-top"><svg xmlns="http://www.w3.org/2000/svg"><path d="M20 32v-16l6 6 6-6-16-16-16 16 6 6 6-6v16z"/></svg></a>' ); // Création de l'élément a.scroll-top
	var scrolltop = $( '.scroll-top' ); // Création de la variable uniquement après création de l'élément dans le DOM
	scrolltop.on( 'click', function() {
		$( 'html, body' ).animate( {scrollTop: 0}, 600 ); // Retour en haut progressif
		return false; // Empêche la génération de l'ancre sur le permalien
	} );
	$( window ).scroll( function() { // Apparition de la flèche 'retour en haut' au scroll de la page
		if ( $( this ).scrollTop() > 100 ) {
			scrolltop.fadeIn();
		} else {
			scrolltop.fadeOut();
		}
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Accordions
// @description Menu accordéon
// -----------------------------------------------------------------------------

( function( $ ) {
	var accordion = $( '[class*="accordion"]' );
	$( '.accordion-js' ).addClass( 'accordion' ); // Ajout d'une class pour le style
	$( '.accordion-js-link' ).addClass( 'accordion-link' ); // Idem
	accordion.attr({ // Ajout d'une id par accordéon (facultatif)
		id: function( index ) {
			return 'accordion-' + index;
		}
	} );
	accordion.find( '> :nth-child(odd)' ).wrap( '<a href=""/>' ); // Ajout de liens permettant l'accessibilité
	accordion.find( '> a *' ).contents().unwrap(); // Nettoyage des balises supperflues
	accordion.find( '> :nth-child(even)' ).hide(); // Cacher le contenu
	accordion.find( '> .active' ).show(); // Montrer le contenu comportant '.active'
	accordion.find( '> .active' ).prev().addClass( 'active' ); // Si élément de contenu comporte '.active', alors élément précédent (titre) comporte '.active'
	accordion.find( '> a' ).click( function( e ) {
		var link = $( this );
		link.toggleClass( 'active' ); // Ajout/suppression de '.active' sur élément cliqué
		link.siblings().removeClass( 'active' ); // Retrait de '.active' sur les élements frères
		link.siblings( '[class*="accordion"] > :nth-child(even)' ).slideUp();
		if (!link.next().is( ':visible' )) {
			link.next().slideDown().addClass( 'active' );
		}
		e.preventDefault();
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Tabs
// @description Menu par onglets
// -----------------------------------------------------------------------------

( function( $ ) { // Construction des onglets et des conteneurs

	// var tab = $( '[class*="tabs-js"]' );
	// tab // Traitement des tableaux
	// 	.each( function( index ) {
	// 		$( this ).attr( 'id', 'tab-' + index); // Ajout d'un id
	// 	} );

	var tabs = $( '[class*="tabs-js"]' );
	tabs.addClass( 'tabs' );
	tabs.find( '> :nth-child(even)' ).hide(); // Cacher le contenu
	tabs.find( '> :nth-child(2)' ).addClass( 'active' ); // Appliquer la class .active au premier enfant du contenu
	tabs.find( '> .active' ).show(); // Montrer le contenu .active
	tabs.find( '> :nth-child(odd)' )
		.each( function( index ) {
			$( this ).wrap( '<li><a href="#tab-' + index + '" id="cmd-tab-' + index + '"></a></li>' ); // Ajout de balises, d'un href et d'une id par onglet
		} );
	tabs.find( '> li a *' )
		.contents().unwrap(); // Supprime les balises contenues dans le texte. Ce code est appliqué seulement après l'ajout des balises liens pour éviter un effet de décalage dû aux noeuds de texte laissés après le retrait des balises
	tabs.find( '> :nth-child(even)' ) // Traitement des contenus
		.each( function( index ) {
			$( this ).attr( 'id', 'content-cmd-tab-' + index); // Ajout d'un id
		} );
	tabs.each( function() {
		$( this ).children( 'li' ).insertBefore( this ).wrapAll( '<ul class="cmd-tabs"/>' ); // Placer les onglets devant le conteneur et les entourer
	} );
	$( '.tabs-js-united' ).addClass( 'tabs-united' );
	var cmdtabs = $( '.cmd-tabs' ); // Création de la variable après création de la classe dans le DOM
	cmdtabs.find( ':first-child a' ).addClass( 'active' ); // Attribuer .active sur le premier onglet
	cmdtabs.on( 'click', 'a', function( e ) {
		var link = $( this );
		link.parent().parent().children().children().removeClass( 'active' ); // Les onglets frères possèdant la classe .active la perdent
		link.addClass( 'active' ); // L'onglet courant récupère la classe .active
		link.parent().parent().next().children().removeClass( 'active' ).hide(); // Traiter l'ancien conteneur actif
		$( '#content-' + this.id).addClass( 'active' ).show(); // Traitement du contenu en rapport avec l'onglet cliqué
		e.preventDefault();
	} );
} )( jQuery );


( function( $ ) { // @note Mémorisation du dernier onglet cliqué
			   // @todo Ne mémorise qu'un unique onglet par page.
	var path = window.location.pathname.replace( /\//g, '' ).replace( /\./g, '' ).toLowerCase();
	var memoTab = 'tab-' + path;
	$( '[id^="cmd-tab-"]' ).on( 'click', function() {
		localStorage.setItem( memoTab, this.id ); // Option mémorisée en Web Storage
	} );
	var tab = localStorage.getItem( memoTab );
	if (tab) {
		var idTab = $( '[id^="' + tab + '"]' );
		idTab.parent().parent().children().children().removeClass( 'active' ); // Les onglets frères possèdant la classe .active la perdent
		idTab.addClass( 'active' ); // Ajout d'une classe .active sur l'onglet si option mémorisée
		idTab.parent().parent().next().children().removeClass( 'active' ).hide(); // Traiter l'ancien conteneur actif
		$( '#content-' + tab).addClass( 'active' ).show(); // Traitement du contenu en rapport avec l'onglet cliqué
	}
	// localStorage.removeItem( 'tab' );
	// localStorage.clear();
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Remove Placeholder
// @description Si focus sur un élément de formulaire alors suppression du ::placeholder
// -----------------------------------------------------------------------------

( function( $ ) {
	$( document ).on( 'focus', 'input, textarea', function() {
		var input = $( this );
		placeholder = input.attr( 'placeholder' );
		input.attr( 'placeholder', '' );
	} );
	$( document ).on( 'focusout', 'input, textarea', function() {
		$( this ).attr( 'placeholder', placeholder ); // Rétablissement du ::placeholder
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Input type range
// @description Affichage de la valeur d'un input
// -----------------------------------------------------------------------------

( function( $ ) {
// Cet ancien code ne fonctionne pas avec Ajax car utilisation de .each() :
	$( '[type="range"]' ).each( function() {
		var range = $( this );
		range.on( 'input', function() {
			range.next().text( range.val() );
		})
		.next().text( range.val() );
	} );
} )( jQuery );

( function( $ ) {
	// @todo Alternative :
	// Cette partie du code, affichant la valeur de départ dans un output, ne fonctionne pas avec Ajax :
	// $( '[type="range"]' ).each( function() {
	// 	var range = $( this );
	// 	range.next().text(range.val());
	// } );
	// Valeur si changement "Ajax ready" :
	// $( document ).on( 'input', '[type="range"]', function() {
	// 	var range = $( this );
	// 	range.next().text(range.val());
	// } );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Progress
// @description Barre de progression
// -----------------------------------------------------------------------------

( function( $ ) {
	// @note Demo :
	var bar = $( '#progress-test' );
	$( '#progress-start' ).on( 'click', function() {
	  var value = bar.data( 'value' );
	  setInterval( frame, 10 );
	  function frame() {
	    if ( value < 100 ) {
	      value++;
	      bar.css( 'width', value + '%' );
	    }
	  }
	} );
} )( jQuery );

( function( $ ) {
	$( '.progress div' ).each( function() {
		var bar = $( this ),
			value = bar.data( 'value' );
		bar.css( 'width', value + '%' );
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Figure focus
// @description Zoom sur les images
// -----------------------------------------------------------------------------

( function( $ ) {
	$( '[class*="-focus"]' ).prepend( '<span class="icon-enlarge"/>' ); // Ajout d'une icône si classe détectée
	$( document ).on( 'click', '[class*="-focus"]', function( e ) { // @note Event si utilisation sur <a>
		$( this )
			.find( 'picture' ) // .find( 'img' )
			.clone()
			.css( 'display', 'inherit' ) // @bugfix @affected Firefox @note Neutralise une déclaration inligne style 'display:inline' induite (via jQuery ?) sous ce navigateur
			.fadeIn( 300 )
			.appendTo( 'body' )
			.wrap( '<div class="focus-off"><div></div></div>' ) // @bugfix @affected All browsers @note Image en flex item n'a pas son ratio préservé si resize ; une div intermédiaire entre le conteneur .focus-off et l'image corrige ce problème
			.before( '<span class="icon-shrink zoom200"/>' );
		$( 'body' ).css( 'overflow', 'hidden' ); // @note Pas de scroll sur la page si photo en focus
		$( document ).find( '.focus-off' ).on( 'click', function( e ) {
			$( '.focus-off' ).fadeOut( 300 );
			setTimeout( function() {
				$( '.focus-off' ).remove();
			}, 300 );
			$( 'body' ).css( 'overflow', 'visible' ); // @note Scroll réactivé
		} );
		e.preventDefault();
	} );
} )( jQuery );

// -----------------------------------------------------------------------------
// @section     Slideshow
// @description Diaporama en full page
// -----------------------------------------------------------------------------

// @note Le diaporama utilise le plugin jQuery 'Cycle 2'
// @link http://jquery.malsup.com/cycle2/
// @documentation http://jquery.malsup.com/cycle2/api/

// @subsection BEGIN Slideshow
// -----------------------------------------------------------------------------

( function( $ ) {
	var slideshow = $( '.slideshow' );
	if ( $( '.slideshow' ).length ) { // Tester présence de la classe


// @subsection Slideshow Progress Bar
// -----------------------------------------------------------------------------

		slideshow
			.append( '<div class="cycle-pager"/>' )
			.append( '<button id="prev"/>' )
			.append( '<button data-cycle-cmd="pause" data-cycle-context="#slideshow1" class="pause"/>' )
			.append( '<button data-cycle-cmd="resume" data-cycle-context="#slideshow1" class="resume"/>' )
			.append( '<button id="next"/>' )
			.append( '<div class="slide-progress"/>' );

		var progress = slideshow.find( '.slide-progress' );

		slideshow.on( 'cycle-initialized cycle-before', function( e, opts ) {
			progress.stop( true ).css( 'width', 0 );
		} );

		slideshow.on( 'cycle-initialized cycle-after', function( e, opts ) {
			if ( ! slideshow.is( '.cycle-paused' ) )
				progress.animate( { width : '100%' }, opts.timeout, 'linear' );
		} );

		slideshow.on( 'cycle-paused', function( e, opts ) {
			progress.stop(); 
		} );

		slideshow.on( 'cycle-resumed', function( e, opts, timeoutRemaining ) {
			progress.animate( { width : '100%' }, timeoutRemaining, 'linear' );
		} );


// @subsection Slideshow switch commands
// -----------------------------------------------------------------------------

		var pause = $( slideshow ).find( '.pause' ),
		    resume = $( slideshow ).find( '.resume' );

		pause.on( 'click', function() {
			$( this ).css( { 'display' : 'none' } );
			resume.css( { 'display' : 'block' } );
		} );
		resume.on( 'click', function() {
			$( this ).css( { 'display' : 'none' } );
			pause.css( { 'display' : 'block' } );
		} );


// @subsection Auto-Initialization
// -----------------------------------------------------------------------------

		var url = '../Scripts/Vendors/Cycle.js';

		$.getScript( url, function() { // Chargement de la librairie 'Cycle 2'
			$( '.slideshow' ).cycle(); // Initialisation du script
		} );

// @subsection END Slideshow
// -----------------------------------------------------------------------------

	} // END if '.slideshow'
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Print
// @description Commande pour l'impression
// -----------------------------------------------------------------------------

( function( $ ) {
	$( document ).on( 'click', '.cmd-print', function() {
		window.print();
		return false;
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Popin
// @description Gestion de l'affichage des fenêtres popin
// -----------------------------------------------------------------------------

( function( $ ) {
	$( document ).on( 'click', '#cmd-popin', function( e ) { // Supprimer ou cacher la popin
		var popin = $( '#popin' );
		var popinUser = $( '#popin-user' );
		if ( popinUser ) {
			$( 'body' ).css( 'overflow', 'visible' ); // @note Scroll réactivé
		}
		popin
			.fadeOut( 300 );
			setTimeout( function() {
				$( '.ajax-window-popin' ).remove(); // Suppression de la fenêtre Ajax et donc de la popin qu'elle contient
				// popin.remove();
				//return false;
			}, 300 );
		popinUser
			.fadeOut( 300 );
			setTimeout( function() {
				popinUser.addClass( 'hidden' );
			}, 300 );
		e.preventDefault();
	} );
	$( document ).on( 'click', '#user', function( e ) { // Afficher la popin #user
		$( 'body' ).css( 'overflow', 'hidden' ); // @note Pas de scroll sur la page si popin visible
		$( '#popin-user' )
			.removeClass( 'hidden' )
			.fadeIn( 300 ); // Afficher les popins 'login' ou 'profil'
	//	e.preventDefault();
		return false;
	} );
	$( document ).on( 'click', 'body', function( e ) { // Si clic en dehors de la popin
		var inside = $( '[id^="popin"]' );
		if (!inside.is(e.target) && inside.has(e.target).length === 0) {
			inside.addClass( 'popin-error' );
			setTimeout( function() {
				inside.removeClass( 'popin-error' );
			}, 300 );
		}
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Drop Cap
// @description Création de lettrines
// -----------------------------------------------------------------------------

// @note Le pseudo-élément ::first-letter ne se comporte pas de la même manière selon tous les navigateurs, cette solution css/js corrige ce problème.
// @note Ajout d'une class .dropcap sur le p:first d'un élément parent comportant .adddropcap

jQuery.fn.dropcap = function() {
	$( '[class*="adddropcap"] p:first-child' ).each( function() {
		var string = $( this ),
			newString = string.html().replace( /(<([^>]+)>|[A-Z0-9«»"]|&amp;)/, '<span class="dropcap">$1</span>' ); // Ajout d'un span + class sur les caractères sélectionnés, filtrage des balises html
		string.html( newString );
	} );
};

jQuery( '.dropcap' ).dropcap();


// -----------------------------------------------------------------------------
// @section     Letter
// @description Visuel des lettres capitales
// -----------------------------------------------------------------------------

// @note Ajout d'un span + class sur les caractères sélectionnés avec filtrage des balises html
// @todo Le parsage des guillemets droits est déconseillé car problématique sur les liens

// jQuery.fn.letter = function() {
// 	$( ':header, legend, .h1, .h2, .h3, .h4, .h5, .h6, .addletter' ).each( function() {
// 		var string = $( this ),
// 			newString = string.html().replace( /([A-Z«»"]|&amp;)(?![^<>]*>)/gm, '<span class="letter">$1</span>' );
// 		string.html( newString );
// 	} );
// };

// jQuery( '.letter' ).letter();


// -----------------------------------------------------------------------------
// @section     Typewriter Js
// @description Effet "machine à écrire"
// -----------------------------------------------------------------------------

jQuery.fn.typewriter = function( options ) {
	var opts = $.extend( true, {}, $.fn.typewriter.defaults, options );
	return this.each( function( i, item ) {
		var interval = parseInt(opts.interval , 10) || 100,
			tabString = $( item ).text().split( '' ),
			length = tabString.length,
			letter = [];
		$( item ).text( '' );
		for( var k = 0; k < length; k++ ) {
			letter.push(
				$( '<span/>', {
					'css' : {
						'display' : 'none'
					},
					'text' : tabString[k]
				} )
			);
		}
		$( item ).queue( function() {
			for( var i = 0; i < length; i++ ) {
				letter.shift().appendTo( item ).delay( interval * i ).fadeIn( 600 );
			}
			$( this ).dequeue();
		} );
	} );
};

( function( $ ) {
	$.fn.typewriter.defaults = {
		'interval' : 50
	};
	$( '.typewriter' ).typewriter();
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Tooltips
// @description Gestion des infobules
// -----------------------------------------------------------------------------

( function( $ ) {
	$( '.addtooltips a' ).each( function() {
		var link = $( this ),
			title = link.attr( 'title' ); // Stockage de tous les titles dans une variable
		link.css( 'position', 'relative' );
		link.on( 'mouseenter', function() {
			if ( title === undefined || title === '' ) return false; // Pas d'infobule si title manquant ou vide
			link.append( '<div class="tooltip">' + title + '</div>' );
			link.attr( 'title', '' ); // Empêche l'affichage des infobules par défaut en vidant les titles
			var tooltip = $( '.tooltip' );
			tooltip.css({
				'position' : 'absolute',
				'opacity' : '0'
			} );
			tooltip.animate({
				'opacity' : '1'
			}, 500 );
		} );
		link.on( 'mouseout', function() {
			var tooltip = $( '.tooltip' );
			tooltip.fadeOut( 500, function() {
				tooltip.remove();
				link.attr( 'title', title ); // Réinjecter la valeur du title pour l'accessibilité
			} );
		} );
	} );
} )( jQuery );

// -----------------------------------------------------------------------------
// @section     Text selection
// @description Sélection du texte des blocs de code
// -----------------------------------------------------------------------------

// @see http://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
// @link http://jsfiddle.net/edelman/KcX6A/1506/
jQuery.fn.selectText = function() {
	var element = this[0],
		doc = document.body;
	if ( doc.createTextRange ) {
		range = doc.createTextRange();
		range.moveToElementText( element );
		range.select();
	} else if ( window.getSelection ) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents( element );
		selection.removeAllRanges();
		selection.addRange( range );
	}
};

( function( $ ) {
	$( 'pre code' ).each( function() { // Création du bouton de commande
		var select = $( this ).data( 'select' ),
			value = $( this ).data( 'value' );
		if ( select ) {
			var code = $( this );
			code.parent().css( 'position', 'relative' );
			code.wrapInner( '<div/>' ); // @bugfix @affected IE (au minimum) @note L'ajout d'une div entre l'élément code et son contenu permet d'éviter la sélection non souhaitée de ses pseudo-éléments
			if ( value ) {
				code.prepend( '<button class="button">' + value + '</button>' );
			} else {
				code.prepend( '<button class="button">Select</button>' );
			}
			$( this ).parent().find( 'button' )
			.css( {
				'position' : 'absolute',
				'right' : '0'
			} )
			.on( 'click', function() {
				code.find( 'div' ).selectText();
			} );
		}
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Font CDN fails
// @description Solution de repli si font CDN de police défaillante
// -----------------------------------------------------------------------------

// @see http://wordpress.stackexchange.com/questions/142241/how-to-provide-a-local-fallback-for-font-awesome-if-cdn-fails
// @todo En développement...
//	( function test( $ ) {
//		var $span = $( '<span style="display:none;font-family:Tangerine"></span>' ).appendTo( 'body' ); // création d'un span de test
//		if ($span.css( 'fontFamily' ) !== 'Tangerine' ) {
//			$( 'head' ).append( '<link href="./Styles/Public/Fonts.css" rel="stylesheet">' ); // lien de repli
//		}
//		$span.remove();
// 	} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Ajax
// @description Requêtes HTTP par l'objet XmlHttpRequest
// -----------------------------------------------------------------------------

// @note Renseignement du script via des attributs data-* plutôt que via les IDs : solution bien plus souple permettant d'utliser les même fichiers cibles sur une même page web, à divers endroits de cette page.

// @documentation :
// - L'attribut 'data-display' détermine la prise en charge du contenu Ajax par le script
//      @param 'global' : ouverture du contenu Ajax dans une fenêtre globale [1]
//      @param 'popin' : ouverture dans une popin [2]
//      @param '***' : ouverture dans une fenêtre dédiée [3]
// - L'attribut 'data-url' de l'élément ajax doit correspondre au nom du fichier placé dans le dossier 'ajax'. Le script récupère le fichier et l'affiche dans une fenêtre '.ajax-window-*'.

( function( $ ) {
	$( document ).on( 'click', '[data-display][data-path]', function() {
		$( '.ajax-window' ).parent().parent().remove(); // Si fichier déjà appelé précédement
		obj = $( this );
		type = obj.data( 'display' );
		path = obj.data( 'path' );
		if ( type === 'global' ) { // [1]
			$( '<div class="section"><div class="wrap"><div class="ajax-window"></div></div></div>' ).appendTo( 'main' ); // Création d'une fenêtre Ajax
			$.ajax({
				url : path + '.php',
				complete : function (xhr, result) {
					if(result != 'success' ) { // Gestion des erreurs
						$( '<div class="section"><div class="wrap"><div class="ajax-window"><p class="message-error">Error: File not found</p></div></div></div>' ).appendTo( 'main' );
						return;
					}
					var response = xhr.responseText;
					$( '.ajax-window' ).html( response );
				}
			} );
		} else if ( type === 'popin' ) { // [2]
			$( 'body' ).css( 'overflow', 'hidden' ); // Pas de scroll sur la page si popin ouverte
			$( '<div class="ajax-window-popin"/>' ).appendTo( 'body' ); // Création d'une fenêtre Ajax
			$.ajax( {
				url : path + '.php',
				complete : function ( xhr, result ) {
					if(result != 'success' ) { // Gestion des erreurs
						$( '<div class="section"><div class="wrap"><div class="ajax-window"><p class="message-error">Error: File not found</p></div></div></div>' ).appendTo( 'main' );
						return;
					}
					var response = xhr.responseText;
					$( '.ajax-window-popin' )
						.html(response)
						.append( '<a href="" id="cmd-popin"/>' )
						.wrapInner( '<section id="popin" class="popin"/>' );
				}
			} );
		} else { // [3]
			$.ajax({
				url : path + '.php',
				complete : function (xhr, result) {
					if(result != 'success' ) { // Gestion des erreurs
						$( '<div class="section"><div class="wrap"><div class="ajax-window"><p class="message-error">Error: File not found</p></div></div></div>' ).appendTo( 'main' );
						return;
					}
					var response = xhr.responseText;
					$( '.ajax-window-' + type ).html( response );
				}
			} );
		}
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Auto Scroll
// @description Scroll vers un élément ajax qui vient d'être appelé
// -----------------------------------------------------------------------------

( function( $ ) {
	$( document ).on( 'click', '#comments', function() {
			setTimeout( function() {
				$( 'html, body' ).animate( {
					scrollTop : $( '#index-comments' ).offset().top
				}, 600 );
		}, 300 );
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     CNIL
// @description Gestion du message d'information exigé par la CNIL
// -----------------------------------------------------------------------------

// @note Ce script peut-être désactivé si les données utilisateurs ne sont pas récupérées lors de la navigation sur les pages

( function( $ ) {
	$( '.terms-use' ).css( 'display', 'inline' ); // @note Par défaut l'élément est caché afin d'éviter un visuel désagréable au chargement de la page
	$( document ).on( 'click', '#terms-use', function() {
		localStorage.setItem( 'termsuse', 'true' );
		$( '.terms-use' ).remove();
	} );
	if (localStorage.getItem( 'termsuse' ) === 'true' ) {
		$( '.terms-use' ).remove();
	}
	//	localStorage.removeItem( 'termsuse' ); // Réinitialisation de la valeur pour les tests, la clef peut aussi s'effacer directement via l'outil d'inspection
} )( jQuery );


// -----------------------------------------------------------------------------
// @section Console
// -----------------------------------------------------------------------------

// @note Attention : IE avec son mode "développement" désactivé plantera si les scripts dédiés à la console sont actifs.
// @note Recommandation de désactiver les scripts dédiés à la console en mode production.

/*
// Évite à IE de planter si mode "développement" désactivé
( function( $ ) {
	var f = function() {};
	if ( !window.console ) {
		window.console = {
			log:f, info:f, warn:f, debug:f, error:f
		};
	}
} )( jQuery );

// Code de la touche du clavier actuellement pressée
jQuery( document ).keydown( function( e ) {
	console.info( 'Code keyboard key: ' + e.keyCode );
} );

// Test du temps d'éxecution d'un script
console.time( 'test' );
// Le script
console.timeEnd( 'test' );
*/
