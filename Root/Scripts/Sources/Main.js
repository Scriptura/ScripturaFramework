// -----------------------------------------------------------------------------
// @name         scriptura
// @description  Interface for web apps
// @version      0.1.3
// @lastmodified 2017-09-11 15:48:48
// @author       Olivier Chavarin
// @homepage     http://scriptura.github.io/
// @license      ISC
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// @section     Support
// @description Détecte les supports et ajoute des classes dans le tag html
// -----------------------------------------------------------------------------

// @note Remplace le script Modernizr pour les deux seuls tests dont nous avons besoin

function jsDetect() { // Vérification de la présence de Javascript (Vanilla js)
	var el = document.getElementsByClassName( 'no-js' )[0];
	el.classList.remove( 'no-js' );
	el.classList.add( 'js' );
}
jsDetect();

function touchDetect() { // Vérification du support de touch (Vanilla js)
	var supports = ( function() {
		var html = document.documentElement,
			touch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
		if (touch) {
			html.classList.add( 'touch' );
			return {
				touch: true
			};
		}
		else {
			html.classList.add( 'no-touch' );
			return {
				touch: false
			};
		}
	} )();
}
touchDetect();


// -----------------------------------------------------------------------------
// @section     Protected
// @description Protège partiellement un texte en empêchant sa sélection
// -----------------------------------------------------------------------------

// @note Script no jQuery conforté par la règle css `user-select:none`
// @see Core.styl
// @note Le fait de placer la fonction en dehors de la boucle évite une erreur jshint
// @link http://stackoverflow.com/questions/10320343/dont-make-functions-within-a-loop

function protected() {
	var eventTest = function( e ) {
		e = e || window.event;
		if( e.preventDefault ) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return false;
	};
	window.onload = function() {
		var protect = document.getElementsByClassName( 'protected' );
		for( var i = 0, len = protect.length; i < len; i++ ) {
			protect[i].onmousedown = eventTest;
		}
	};
}
protected();


// -----------------------------------------------------------------------------
// @section     Media Element JS
// @description Configuration pour MediaElement.js
// -----------------------------------------------------------------------------

( function( $ ) {
	var element = $( 'audio, video' );
	if ( element.length ) {
		// Appel des sripts
		var scriptsUri = templateUri + '/Scripts/Vendors/MediaElementJS/mediaelement-and-player.min.js';
		var stylesUri = templateUri + '/Scripts/Vendors/MediaElementJS/mediaelementplayer.css';
		$.getScript( scriptsUri, function() { // Chargement via Ajax
			$( 'audio, video' ).mediaelementplayer(); // Initialisation du script
		} );
		$( 'head' ).append( '<link rel="stylesheet" href="' + stylesUri + '" media="screen">' ); // Appel des styles
	}
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     External links
// @description Gestion des liens externes au site
// -----------------------------------------------------------------------------

// @note Par défaut, tous les liens externes conduisent à l'ouverture d'un nouvel onglet, sauf les liens de téléchargement

function externalLinks() {
	var anchors = document.querySelectorAll( 'a' );
	for( var i = 0, len = anchors.length; i < len; i++ ) {
		if ( anchors[i].hostname !== window.location.hostname ) {
			anchors[i].setAttribute( 'target', '_blank' );
	 	}
	}
}
externalLinks();


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

// @link https://www.sitepoint.com/smooth-scrolling-vanilla-javascript/
// @link http://codepen.io/SitePoint/pen/YqewzZ

//initSmoothScrolling();
//function initSmoothScrolling() {
//  if (isCssSmoothSCrollSupported()) {
//    document.getElementById( 'css-support-msg' ).className = 'supported';
//    return;
//  }
//  var duration = 400;
//  var pageUrl = location.hash ?
//    stripHash(location.href) :
//    location.href;
//  delegatedLinkHijacking();
//  //directLinkHijacking();
//  function delegatedLinkHijacking() {
//    document.body.addEventListener( 'click', onClick, false );//

//    function onClick( e ) {
//      if ( !isInPageLink( e.target ) )
//        return;
//      e.stopPropagation();
//      e.preventDefault();
//      jump(e.target.hash, {
//        duration: duration,
//        callback: function() {
//          //setFocus(e.target.hash); // @note Désactivation de l'effet outline bleu sur le focus
//        }
//      });
//    }
//  }
//  function directLinkHijacking() {
//    [].slice.call( document.querySelectorAll( 'a' ) )
//      .filter(isInPageLink)
//      .forEach(function( a ) {
//        a.addEventListener( 'click', onClick, false );
//      });
//    function onClick( e ) {
//      e.stopPropagation();
//      e.preventDefault();
//      jump(e.target.hash, {
//        duration: duration,
//      });
//    }
//  }
//  function isInPageLink( n ) {
//    return n.tagName.toLowerCase() === 'a' &&
//      n.hash.length > 0 &&
//      stripHash(n.href) === pageUrl;
//  }
//  function stripHash( url ) {
//    return url.slice(0, url.lastIndexOf('#'));
//  }
//  function isCssSmoothSCrollSupported() {
//    return 'scrollBehavior' in document.documentElement.style;
//  }
//  // Adapted from:
//  // https://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
//  // @note Fonction désactivée pour éviter l'effet outline bleu sur le focus... l'appel à la fonction est désactivé plus haut dans le code
//  //function setFocus(hash) {
//  //  var element = document.getElementById(hash.substring(1));
//  //  if (element) {
//  //    if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
//  //      element.tabIndex = -1;
//  //    }
//  //    element.focus();
//  //  }
//  //}
//}
//function jump( target, options ) {
//  var
//    start = window.pageYOffset,
//    opt = {
//      duration: options.duration,
//      offset: options.offset || 0,
//      callback: options.callback,
//      easing: options.easing || easeInOutQuad
//    },
//    distance = typeof target === 'string' ?
//    opt.offset + document.querySelector(target).getBoundingClientRect().top :
//    target,
//    duration = typeof opt.duration === 'function' ?
//    opt.duration(distance) :
//    opt.duration,
//    timeStart, timeElapsed;
//  requestAnimationFrame( function( time ) {
//    timeStart = time;
//    loop(time);
//  } );
//  function loop( time ) {
//    timeElapsed = time - timeStart;
//    window.scrollTo( 0, opt.easing( timeElapsed, start, distance, duration ) );
//    if ( timeElapsed < duration )
//      requestAnimationFrame( loop );
//    else
//      end();
//  }
//  function end() {
//    window.scrollTo( 0, start + distance );
//    if ( typeof opt.callback === 'function' )
//      opt.callback();
//  }
//  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
//  function easeInOutQuad( t, b, c, d ) {
//    t /= d / 2;
//    if (t < 1) return c / 2 * t * t + b;
//    t--;
//    return -c / 2 * (t * (t - 2) - 1) + b;
//  }
//}

( function( $ ) {
	$( document ).on( 'click', 'a[href*="#"]:not([href="#"])', function() {
		if ( location.pathname.replace( /^\//,'' ) == this.pathname.replace( /^\//,'' ) && location.hostname == this.hostname ) {
			var target = $( this.hash );
			target = target.length ? target : $( '[name=' + this.hash.slice(1) +']' );
			if ( target.length ) {
				$( 'html, body' ).animate( {
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

function bodyIndex() {
	document.body.id = 'index';
}
bodyIndex();


// -----------------------------------------------------------------------------
// @section     Scroll Top
// @description Défilement vers le haut
// -----------------------------------------------------------------------------

// @note Vanilla Js de 'scrollTop: 0' : 'window.scrollTo( 0, 0 )'
// Hauteur de la fenêtre : window.innerHeight
// Hauteur du scroll : document.body.scrollTop
// Hauteur totale du document : document.body.scrollHeight
// @link https://openclassrooms.com/forum/sujet/recuperer-position-scroll

( function( $ ) {
	$( 'body > footer' ).append( '<a href="" class="scroll-top"><svg xmlns="http://www.w3.org/2000/svg"><path d="M20 32v-16l6 6 6-6-16-16-16 16 6 6 6-6v16z"/></svg></a>' ); // Création de l'élément 'a.scroll-top'
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

//function arrowScrollTop() {
//	var id = document.getElementsByClassName( 'footer' )[0];
//	id.insertAdjacentHTML( 'beforeend', '<a href="" class="scroll-top"><svg xmlns="http://www.w3.org/2000/svg"><path d="M20 32v-16l6 6 6-6-16-16-16 16 6 6 6-6v16z"/></svg></a>' );
//	var el = document.getElementsByClassName( 'scroll-top' )[0];
//	var es = el.style;
//	es.transition = 'opacity 2s ease-in-out';
//	es.display = 'none';
//	es.opacity = 0;
//	window.onscroll = function() {
//		var scrollTop = document.body.scrollTop;
//		if ( scrollTop > 100 ) {
//			es.display = 'block';
//			es.opacity = 1;
//		} else {
//			es.opacity = 0;
//			el.addEventListener( 'transitionend', function( event ) {
//				es.display = 'none';
//			}, false);
//		}
//	};
//	el.onclick = function( e ){
//		e.preventDefault();
//		window.scrollTo( 0, 0 );
//		//scroolToTop();
//	};
//	function scroolToTop(){
//		var top = 0;
//		var start = window.pageYOffset;
//		function toTop(){
//			if ( start > 0 )
//				start -= 1;
//			window.scrollTo( 0, start );
//		}
//		requestAnimationFrame( toTop );
//	}
//}
//arrowScrollTop();


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

// @todo Impacte aussi sur les checkbox et radio, à voir...

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
		imageFocus = $( this ).find( 'img' ).clone();
		alternativeSource = $( this ).find( 'picture' ).data( 'src' );
		imageFocus
			.removeAttr( 'width' ) // @note La suppression de ces attributs permet le responsive en zoom
			.removeAttr( 'height' ) // @note Idem
			.css( 'display', 'inherit' ) // @bugfix @affected Firefox @note Neutralise une déclaration inligne style 'display:inline' induite (via jQuery ?) sous ce navigateur
			.fadeIn( 300 )
			.appendTo( 'body > footer' )
			.wrap( '<div class="focus-off"><div></div></div>' ) // @bugfix @affected All browsers @note Image en flex item n'a pas son ratio préservé si resize ; une div intermédiaire entre le conteneur .focus-off et l'image corrige ce problème
			.before( '<span class="icon-shrink zoom200"/>' );
		if( ( typeof alternativeSource != 'undefined' ) && ( screen.width < 1500 ) ) { // @note Si petite définition d'écran alors résolution limitée pour l'image
			imageFocus.attr( 'src', alternativeSource );
		}
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
// @section     Gallery
// @description Diaporama sur les images sélectionnées
// -----------------------------------------------------------------------------

//.gallery [class*="figure"]
/*
BEGIN En test...
jQuery.fn.gallery = function() {
	var gallery = $( this );
	gallery.on( 'focus click', function( e ) {
			//var item = $( this ).clone().find( 'figure' );
			var item = $( this ).find( '> *' ).clone();
			var visio = $( '<gallery/>' );
			item.removeClass();
			var n = 0;
			item.each( function() {
				n = n + 1;
				$( this ).wrap( '<a href="#gallery-' + n + '"/>' );
			} );
			item.find( 'img' )
				.removeAttr( 'width' ) // @note Suppression des attributs @todo En test...
				.removeAttr( 'height' ); // @note Idem
			visio.appendTo( 'body > footer' );
			visio.append( item );
		e.stopPropagation();
		//e.preventDefault();
	} );
};
jQuery( '.gallery' ).gallery();
END En test...
*/

/*
jQuery.fn.gallery = function() {
	var gallery = $( this );
	gallery.find( '> *' ).wrapAll( '<div><div></div></div>' );
	gallery.prepend( '<div><visio></visio></div>' );
	gallery.find( 'img' )
		.removeAttr( 'width' ) // @note Suppression des attributs @todo En test...
		.removeAttr( 'height' ); // @note Idem
	var items = gallery.find( 'figure' );
	items.removeClass(); // @note Évite un 
	items.find( 'span' ).remove();
	var imgInit = gallery.find( ':last-child figure:first-child' );
	var n = 0;
	$( gallery ).find( ':last-child figure' ).each( function() {
		n = n + 1;
		$( this ).wrap( '<a href="#gallery-' + n + '"/>' );
	} );
	var imgClone = imgInit.clone();
	imgClone = imgClone.addClass( 'figure-focus' );
		imgClone.prepend( '<span class="icon-enlarge"/>' ); // Ajout d'une icône
	$( 'visio' ).replaceWith( imgClone );
	gallery.on( 'focus click', '> :last-child a', function( e ) {
		var imgVisio = $( this ).find( 'figure' ).clone();
		imgVisio = imgVisio.addClass( 'figure-focus' );
		imgVisio.prepend( '<span class="icon-enlarge"/>' ); // Ajout d'une icône
		gallery.find( ' > :first-child figure' )
			.replaceWith( imgVisio );
		e.stopPropagation();
		//e.preventDefault();
	} );
};

jQuery( '.gallery' ).gallery();
*/

// -----------------------------------------------------------------------------
// @section     Slideshow
// @description Diaporama en full page
// -----------------------------------------------------------------------------

// @note Le diaporama utilise le plugin jQuery 'Cycle 2'
// @link http://jquery.malsup.com/cycle2/
// @documentation http://jquery.malsup.com/cycle2/api/

( function( $ ) {
	var slideshow = $( '.slideshow' );
	var el = $( '.slideshow > .cycle-item' );
	if ( el[1] ) { // Si au moins deux items présents
		// Create Commands:
		slideshow
			.append( '<div class="cycle-pager"/>' )
			.append( '<button id="prev"/>' )
			.append( '<button data-cycle-cmd="pause" data-cycle-context="#slideshow1" class="pause"/>' )
			.append( '<button data-cycle-cmd="resume" data-cycle-context="#slideshow1" class="resume"/>' )
			.append( '<button id="next"/>' )
			.append( '<div class="slide-progress"/>' );
		// Slideshow Progress Bar:
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
		// Slideshow switch commands:
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
		// Auto-Initialization:
		var scriptsUri = templateUri + '/Scripts/Vendors/Cycle.js';
		$.getScript( scriptsUri, function() {  // Chargement via Ajax
			$( slideshow ).cycle(); // Initialisation du script
		} );
	}
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Cmd Print
// @description Commande pour l'impression
// -----------------------------------------------------------------------------

function cmdPrint() {
	var p = document.getElementsByClassName( 'cmd-print' );
	function startPrint(){
		window.print();
		return false;
	}
	for( var i = 0, len = p.length; i < len; i++ ) {
		p[i].onclick = startPrint;
	}
}
cmdPrint();


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
			}, 300 );
		popinUser
			.fadeOut( 300 );
			setTimeout( function() {
				popinUser.addClass( 'hidden' );
			}, 300 );
		e.preventDefault();
	} );
	$( document ).on( 'click', '#user', function() { // Afficher la popin #user
		$( 'body' ).css( 'overflow', 'hidden' ); // @note Pas de scroll sur la page si popin visible
		$( '#popin-user' )
			.removeClass( 'hidden' )
			.fadeIn( 300 ); // Afficher les popins 'login' ou 'profil'
		return false;
	} );
	$( document ).on( 'click', 'body', function( e ) { // Si clic en dehors de la popin
		var inside = $( '[id^="popin"]' );
		if (!inside.is( e.target ) && inside.has( e.target ).length === 0) {
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

// @name jTypeWriter, JQuery plugin
// @version 1.1 
// @license GPL
// @date 2008
// @author Nikos "DuMmWiaM" Kontis, info@dummwiam.com
// @link https://searchcode.com/codesearch/view/99910621/
/*
eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) {
            return r[e]
        }];
        e = function() {
            return '\\w+'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('(7($){$.u.v=7(b){5 c,8,w,r,x,A;5 d=$.W({},$.u.v.H,b);5 e=d.I*J;5 f=d.K.X();5 g=d.L;5 h=d.M;5 j=d.9;5 k=d.N;5 l=d.O;5 m=(f=="Y")?" ":".";5 n=P Q();5 o=0;y(i=0;i<q.p;i++){4(j){$(q[i]).9(j)}4(f=="s")n.R({3:$(q[i]),6:$(q[i]).9()});t n.R({3:$(q[i]),6:$(q[i]).9().Z(m)});4(!g)o=n[i].6.p>o?n[i].6.p:o;t o+=n[i].6.p;$(q[i]).9("")}B();7 B(){c=e/o;8=0;w=r=0;x=(!g)?C(S,c):C(T,c)};7 S(){8++;y(i=0;i<n.p;i++){5 a=n[i];4(a.6.p>=8){4(f=="s"){a.3.9(a.6.U(0,8))}t{a.3.z(a.6[8-1]);4(8<o){a.3.z(m)}}}}4(8>=o){D()}};7 T(){$3=n[w];4(f=="s"){$3.3.9($3.6.U(0,++r))}t{$3.3.z($3.6[r++]);4(r<$3.6.p)$3.3.z(m)}4(r>=$3.6.p){w++;r=0}8++;4(8>=o){D()}};7 D(){E(x);4(f!="s"){}4(k){4(l)A=C(V,l*J);t F()}h()};7 F(){y(i=0;i<n.p;i++){n[i].3.9("")}B()};7 V(){F();E(A)};7 G(){E(x);y(i=0;i<n.p;i++){n[i].3.9(n[i].6)}};q.G=G;10 q};$.u.v.H={I:2,K:"s",L:11,M:7(){},9:"",N:12,O:0};$.u.v.13={14:P Q()}})(15);', 62, 68, '|||obj|if|var|initialText|function|nIntervalCounter|text||||||||||||||||length|this|nSequentialCounterInternal|letter|else|fn|jTypeWriter|nSequentialCounter|nInterval|for|append|nLoopInterval|init|setInterval|circleEnd|clearInterval|newLoop|endEffect|defaults|duration|1000|type|sequential|onComplete|loop|loopDelay|new|Array|push|typerSimultaneous|typerSequential|substr|loopInterval|extend|toLowerCase|word|split|return|true|false|variables|aObjects|jQuery'.split('|'), 0, {}));

$( '.typewriter' ).jTypeWriter();
*/


// -----------------------------------------------------------------------------
// @section     Unveiling
// @description Dévoilement progressif d'un texte
// -----------------------------------------------------------------------------

// @note Classe à injecter selon de niveau de scroll
// @todo À développer...

function unveiling() {
	var u = document.getElementsByClassName( 'unveiling' );
	for( var i = 0, len = u.length; i < len; i++ ) {
		u[i].classList.add( 'unveiling-start' );
	}
}
unveiling();


// -----------------------------------------------------------------------------
// @section     Tooltips
// @description Gestion des infobulles
// -----------------------------------------------------------------------------

( function( $ ) {
	$( '.addtooltips a' ).each( function() {
		var link = $( this ),
			title = link.attr( 'title' ); // Stockage de tous les titles dans une variable
		link.css( 'position', 'relative' );
		link.on( 'mouseenter', function() {
			if ( title === undefined || title === '' ) return false; // Pas d'infobule si title manquant ou vide
			link.append( '<div class="tooltip">' + title + '</div>' );
			link.attr( 'title', '' ); // Empêche l'affichage des infobulles par défaut en vidant les titles
			var tooltip = $( '.tooltip' );
			tooltip.css({
				'position' : 'absolute',
				'opacity' : '0'
			} );
			tooltip.animate({
				'opacity' : '1'
			}, 300 );
		} );
		link.on( 'mouseout', function() {
			var tooltip = $( '.tooltip' );
			tooltip.fadeOut( 300, function() {
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
// @link https://www.creativejuiz.fr/blog/tutoriels/copier-presse-papier-en-javascript

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
			//code.parent().css( 'position', 'relative' );
			code.wrapInner( '<div/>' ); // @bugfix @affected IE (au minimum) @note L'ajout d'une div entre l'élément code et son contenu permet d'éviter la sélection non souhaitée de ses pseudo-éléments
			if ( value ) {
				code.prepend( '<button class="button">' + value + '</button>' );
			} else {
				code.prepend( '<button class="button">Select</button>' );
			}
			$( this ).parent().find( 'button' )
			//.css( {
			//	'position' : 'absolute',
			//	'right' : '0'
			//} )
			.on( 'click', function() {
				code.find( 'div' ).selectText(); // Sélection du texte
				document.execCommand( 'copy' ); // Copie de la sélection
				return false;
			} );
		}
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Readable Password
// @description Checkbox permettant de voir les mots de passe en clair
// -----------------------------------------------------------------------------

( function( $ ) {
	$( document ).on( 'click', '.input-password [type="checkbox"]', function() {
		var visiblePassword = $( this );
		if( visiblePassword.is(':checked' ) ) {
			visiblePassword.siblings( '[type="password"]' ).attr('type', 'text');
		} else {
			visiblePassword.siblings( '[type="text"]' ).attr('type', 'password');
		}
	} );
} )( jQuery );


// -----------------------------------------------------------------------------
// @section     Ajax
// @description Requêtes HTTP via l'objet XmlHttpRequest
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

function termsUse() {
	var el = document.getElementById( 'terms-use' );
	if ( el ) {
		var cmd = el.querySelectorAll( 'button' )[0];
		el.style.display = 'block'; // @note Par défaut l'élément est caché afin d'éviter un visuel désagréable au chargement de la page
		cmd.onclick = function(){
			localStorage.setItem( 'termsuse', 'true' );
			el.style.display = 'none';
		};
		if (localStorage.getItem( 'termsuse' ) === 'true' ) {
			el.style.display = 'none';
		}
		//localStorage.removeItem( 'termsuse' ); // Réinitialisation de la valeur pour les tests, la clef peut aussi s'effacer directement via l'outil d'inspection
	}
}
termsUse();


// -----------------------------------------------------------------------------
// @section     Snowstorm
// @description Effet flocons de neige sur la page web
// -----------------------------------------------------------------------------

// @link http://www.schillmania.com/projects/snowstorm/

( function( $ ) {
	var element = $( '.snowstorm' );
	if ( element.length ) {
		var scriptsUri = templateUri + '/Scripts/Vendors/Snowstorm/snowstorm-min.js';
		$.getScript( scriptsUri, function() { // Chargement via Ajax
			//snowStorm.snowColor = '#99ccff';
			//snowStorm.flakesMaxActive = 64; // Nombre de flocon actif max
			//snowStorm.useTwinkleEffect = true; // Scintillemment de la neige hors de vue écran
			//snowStorm.snowCharacter = '•'; // Caractère utilisé ('•' recommandé)
		} );
	}
} )( jQuery );


// -----------------------------------------------------------------------------
// @section Debug/Test
// -----------------------------------------------------------------------------

// @warning IE en mode développement désactivé plantera si les scripts dédiés à la console sont actifs, les désactiver en mode production.

// Test du temps d'éxecution d'un script
//console.time( 'test' );
// Le script
//console.timeEnd( 'test' );

// Repère les éléments dépassants en responsive
//var docWidth = document.documentElement.offsetWidth;
//[].forEach.call(
//  document.querySelectorAll( '*' ),
//  function( el ) {
//    if (el.offsetWidth > docWidth) {
//      console.log( el );
//    }
//  }
//);

