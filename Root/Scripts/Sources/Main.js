// -----------------------------------------------------------------------------
// @name         Scriptura
// @description  Interface for web apps
// @version      0.0.4
// @lastmodified 2016-3-24 07:42:00
// @author       Olivier Chavarin
// @homepage     http://scriptura.github.io/
// @license      ISC
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// @section     Support
// @description Détecte les supports et ajoute des classes dans le tag html
// -----------------------------------------------------------------------------

// @note Remplace le script Modernizr

// Vérification de javascript
jQuery('html').addClass('js').removeClass('no-js');

// Vérification du support de touch (jQuery)
//	$(window).one({
//		tap : function() {
//			Modernizr.touch = false; // Add this line if you have Modernizr
//			$('html').addClass('touch');
//		}
//	});

// Vérification du support de touch
var supports = (function() {
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
})();


// -----------------------------------------------------------------------------
// @section     Media Element JS
// @description Configuration pour MediaElement.js
// -----------------------------------------------------------------------------

var element = $('audio, video');
if (element.length){
	// Appel des sripts
	$('body').append('<script src="../Scripts/Vendors/MediaElementJS/mediaelement-and-player.min.js"><\/script>');
	$('audio, video').mediaelementplayer();
	// Appel des styles
	$('head').append('<link rel="stylesheet" href="../Scripts/Vendors/MediaElementJS/mediaelementplayer.css" media="screen">');
}


// -----------------------------------------------------------------------------
// @section     Center
// @description Centrer un élément en position fixed
// -----------------------------------------------------------------------------

// @todo Ne fonctionne pas avec Safari
jQuery.fn.center = function() { // .center()
	this.css({
		'position': 'fixed',
		'left': '50%',
		'top': '50%',
		'margin-left': -this.outerWidth() / 2 + 'px',
		'margin-top': -this.outerHeight() / 2 + 'px'
	});
	return this;
};


// -----------------------------------------------------------------------------
// @section     External links
// @description Gestion des liens externes au site
// -----------------------------------------------------------------------------

// #note Par défaut, tous les liens externes conduisent à l'ouverture d'un nouvel onglet, sauf les liens de téléchargement

jQuery(document).on('click','a:not(.download-link)',function() { // Ajout d'un attribut target_blank sur les liens externes
	$(this).filter(function() {
		return this.hostname && this.hostname !== location.hostname;
	}).attr("target", "_blank");
});


// -----------------------------------------------------------------------------
// @section     Isotope
// @description Réorganisation des boites via le plugin addoc
// -----------------------------------------------------------------------------

// if .class { getScript('/Scripts/Vendors/Isotope.js') }


// -----------------------------------------------------------------------------
// @section     Main Nav
// @description Menu de navigation principal
// -----------------------------------------------------------------------------

// @note Script remplacé par une solution full CSS
// @see _core.scss
/*
(function($) {
	var nav = $('.main-nav ul');
	$('.brand').append('<button type="button" id="cmd-main-nav" class=""><span></span></button>');
	$('#cmd-main-nav').on('click', function() {
		$('.main-nav ul').slideToggle(300).css('display', 'flex');
		$(this).toggleClass('active'); // Permet de cibler le bouton si actif
	});
})(jQuery);
*/


// -----------------------------------------------------------------------------
// @section     Main Nav Bottom
// @description Menu de navigation principal, position en bas
// -----------------------------------------------------------------------------

(function($) {
	var body = $('body');
	var menu = $('.sizeNav-nav-bottom');
	var scrollTop = $('.scroll-top');
	$('.sizeNav-nav-bottom button').on('click touchmove', function() {
		menu.toggleClass('active');
		if (menu.hasClass('active')) {
			body.css('overflow', 'hidden'); // Évite la confusion avec un scrool sur la page
			scrollTop.addClass('hidden');
		} else {
			body.css('overflow', 'visible');
			menu.removeClass('active');
			scrollTop.removeClass('hidden');
		}
	});
})(jQuery);

/*
(function($) {
	var body = $('body');
	var menu = $('.sizeNav-nav-bottom ul');
	var scrollTop = $('.scroll-top');
	$('.cmd-slide').on('click touchmove', function() {
		menu.toggleClass('active');
		if (menu.hasClass('active')) {
			body.css('overflow', 'hidden'); // Évite la confusion avec un scrool sur la page
			scrollTop.addClass('hidden');
		} else {
			body.css('overflow', 'visible');
			menu.removeClass('active');
			scrollTop.removeClass('hidden');
		}
	});
})(jQuery);
*/


// -----------------------------------------------------------------------------
// @section     Sections Nav
// @description Navigation entre sections au clavier
// -----------------------------------------------------------------------------

(function($) {
	var doc = $(document),
		section = $('.section'), // Navigation via la classe en paramètre
		menu = $('.scroll-nav a'),
		body = $('html,body');
	var topToIndex = function(scrollTop) {
		var offsetTop = 0,
			indexlastSection;
		section.each(function(i){
			offsetTop = $(this).offset().top;
			if (scrollTop > offsetTop - 100){
				indexlastSection = i;
			}
		});
		return indexlastSection;
	};
	var retrieveActive = function() {
		var scrollTop = doc.scrollTop(),
			activeIndex = topToIndex(scrollTop);
		section.removeClass('active').eq(activeIndex).addClass('active');
		menu.removeClass('active').eq(activeIndex).addClass('active');
		return activeIndex;
	};
	doc.keydown(function(e) { // raccourci clavier
	var active = $('.section.active'), // Navigation via la classe en paramètre + .active
		tag = e.target.tagName.toLowerCase(); // Détecte sur quel élément est exécuté le script
		if (tag != 'input' && tag != 'textarea'){
			if (e.keyCode == 90){ // 'z' @bugfix @note Conflit avec arrow left ('37')
				body.animate({
					scrollTop: active.prev().length ? active.prev().offset().top : active.offset().top
				}, 400);
			}
			if (e.keyCode == 83){ // 's' @bugfix @note Conflit avec arrow right ('39')
				body.animate({
					scrollTop: active.next().length ? active.next().offset().top : active.offset().top
				}, 400);
			}
		}
	});
	doc.on('scroll', function() {
		retrieveActive();
	});
	retrieveActive();
})(jQuery);


// -----------------------------------------------------------------------------
// @section     Smooth Scroll
// @description Défilement fluide
// -----------------------------------------------------------------------------

jQuery(document).on('click', 'a[href*=#]:not([href=#])', function() {
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname){
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length){
			$('html,body').animate({
				scrollTop: target.offset().top
			}, 400);
			//return false;
		}
	}
});


// -----------------------------------------------------------------------------
// @section Scroll top
// @description Défilement vers le haut
// -----------------------------------------------------------------------------

(function($) {
	$('body').attr('id', 'index'); // Ajout d'une ID pour permettre un ciblage via .scroll-top
	$('<a href="#index" class="scroll-top"><svg xmlns="http://www.w3.org/2000/svg"><path d="M20 32v-16l6 6 6-6-16-16-16 16 6 6 6-6v16z"/></svg></a>').appendTo('body'); // Création de l'élément a.scroll-top
	var scrolltop = $('.scroll-top'); // Création de la variable après création de la classe dans le DOM
	//scrolltop.click(function() { // Retour en haut progressif
	//	$('html, body').animate({scrollTop: 0}, 600);
	//	return false;
	//});
	$(window).scroll(function() { // Apparition de la flèche 'retour en haut' au scroll de la page
		if ($(this).scrollTop() > 100) {
			scrolltop.fadeIn();
		} else {
			scrolltop.fadeOut();
		}
	});
})(jQuery);


// -----------------------------------------------------------------------------
// @section Accordions
// -----------------------------------------------------------------------------

(function($) {
	var accordion = $('[class*="accordion"]');
	$('.accordion-js').addClass('accordion'); // Ajout d'une class pour le style
	$('.accordion-js-link').addClass('accordion-link'); // Idem
	accordion.attr({ // Ajout d'une id par accordéon (facultatif)
		id: function(index){
			return 'accordion-' + index;
		}
	});
	accordion.find('> :nth-child(odd)').wrap('<a href=""/>'); // Ajout de liens permettant l'accessibilité
	accordion.find('> a *').contents().unwrap(); // Nettoyage des balises supperflues
	accordion.find('> :nth-child(even)').hide(); // Cacher le contenu
	accordion.find('> .active').show(); // Montrer le contenu comportant '.active'
	accordion.find('> .active').prev().addClass('active'); // Si élément de contenu comporte '.active', alors élément précédent (titre) comporte '.active'
	accordion.find('> a').click(function(e){
		var link = $(this);
		link.toggleClass('active'); // Ajout/suppression de '.active' sur élément cliqué
		link.siblings().removeClass('active'); // Retrait de '.active' sur les élements frères
		link.siblings('[class*="accordion"] > :nth-child(even)').slideUp();
		if (!link.next().is(':visible')){
			link.next().slideDown().addClass('active');
		}
		e.preventDefault();
	});
})(jQuery);


// -----------------------------------------------------------------------------
// @section Tabs
// -----------------------------------------------------------------------------

(function($) {
	var tabs = $('[class*="tabs-js"]');
	tabs.addClass('tabs'); // @todo En test, pour le css
	tabs.find('> :nth-child(even)').hide(); // Cacher le contenu
	tabs.find('> :nth-child(2)').addClass('active'); // Appliquer la class .active au premier enfant du contenu
	tabs.find('> .active').show(); // Montrer le contenu .active
	tabs.find('> :nth-child(odd)')
		.each(function(index){
			$(this).wrap('<li><a href="#tab-' + index + '" id="cmd-tab-' + index + '"></a></li>'); // Ajout de balises, d'un href et d'une id par onglet
		});
	tabs.find('> li a *')
		.contents().unwrap(); // Supprime les balises contenues dans le texte. Ce code est appliqué seulement après l'ajout des balises liens pour éviter un effet de décalage dû aux noeuds de texte laissés après le retrait des balises
	tabs.find('> :nth-child(even)') // Traitement des contenus
		.each(function(index){
			$(this).attr('id', 'content-cmd-tab-' + index); // Ajout d'un id
		});
	tabs.each(function() {
		$(this).children('li').insertBefore(this).wrapAll('<ul class="cmd-tabs"/>'); // Placer les onglets devant le conteneur et les entourer
	});
	$('.tabs-js-united').addClass('tabs-united'); // @todo En test, pour le css
	var cmdtabs = $('.cmd-tabs'); // Création de la variable après création de la classe dans le DOM
	cmdtabs.find(':first-child a').addClass('active'); // Attribuer .active sur le premier onglet
	cmdtabs.on('click', 'a', function(e){
		var link = $(this);
		link.parent().parent().children().children().removeClass('active'); // Les onglets frères possèdant la classe .active la perdent
		link.addClass('active'); // L'onglet courant récupère la classe .active
		link.parent().parent().next().children().removeClass('active').hide(); // Traiter l'ancien conteneur actif
		$('#content-' + this.id).addClass('active').show(); // Traitement du contenu en rapport avec l'onglet cliqué
		e.preventDefault();
	});
})(jQuery);


// @note Mémorisation du dernier onglet cliqué
// @todo En test
jQuery(document).on('click', '[id^="cmd-tab-"]', function() {
		localStorage.setItem('tab', this.id); // Option mémorisée en Web Storage
});
var tab = localStorage.getItem('tab');
if (tab) {
	var idTab = $('[id^="' + tab + '"]');
	idTab.parent().parent().children().children().removeClass('active'); // Les onglets frères possèdant la classe .active la perdent
	idTab.addClass('active'); // Ajout d'une classe .active sur l'onglet si option mémorisée
	idTab.parent().parent().next().children().removeClass('active').hide(); // Traiter l'ancien conteneur actif
	$('#content-' + tab).addClass('active').show(); // Traitement du contenu en rapport avec l'onglet cliqué
}
// localStorage.removeItem('tab');


// -----------------------------------------------------------------------------
// @section     Remove Placeholder
// @description Si focus sur un élément de formulaire alors suppression du ::placeholder
// -----------------------------------------------------------------------------

jQuery(document).on('focus', 'input, textarea', function() {
	var input = $(this);
	placeholder = input.attr('placeholder');
	input.attr('placeholder', '');
});

jQuery(document).on('focusout', 'input, textarea', function() {
	$(this).attr('placeholder', placeholder); // Rétablissement du ::placeholder
});


// -----------------------------------------------------------------------------
// @section     Input type range
// @description Affichage de la valeur d'un input
// -----------------------------------------------------------------------------

// Cet ancien code ne fonctionne pas avec Ajax car utilisation de .each() :
//	jQuery('[type="range"]').each(function() {
//		var range = $(this);
//		range.on('input', function() {
//			range.next().text(range.val());
//		})
//		.next().text(range.val());
//	});

// Nouveau code "Ajax ready" :
jQuery(document).on('input', '[type="range"]', function() {
	var range = $(this);
	range.next().text(range.val());
});

// Cette partie du code, affichant la valeur de départ dans un output, ne fonctionne pas avec Ajax :
jQuery('[type="range"]').each(function() {
	var range = $(this);
	range.next().text(range.val());
});


// -----------------------------------------------------------------------------
// @section     Progress
// @description Barre de progression
// -----------------------------------------------------------------------------

jQuery('#progress-demo').data('value', '70');

jQuery('.progress div').each(function() {
	var bar = $(this),
		value = bar.data('value');
	bar.css('width', value + '%');
});


// -----------------------------------------------------------------------------
// @section     Figure focus
// @description Zoom sur les images
// -----------------------------------------------------------------------------

jQuery('[class*="-focus"]').each(function() {
	$('<span class="icon-enlarge"/>').prependTo(this);
});

jQuery(document).on('click', '[class*="-focus"]', function(e){ // @note Event si utilisation sur <a>
	$(this).find('img').clone()
		.css('display', 'inherit') // @bugfix @affected Firefox @note Neutralise une déclaration inligne style 'display:inline' induite (via jQuery ?) sous ce navigateur
		.fadeIn(300)
		.appendTo('body')
		.wrap('<div class="focus-off"><div></div></div>') // @bugfix @affected All browsers @note Image en flex item n'a pas son ratio préservé si resize ; une div intermédiaire entre le conteneur .focus-off et l'image corrige ce problème
		.before('<span class="icon-shrink zoom200"/>');
	$('body').css('overflow', 'hidden'); // @note Pas de scroll sur la page si photo en focus
	$(document).on('click' ,'.focus-off', function(e) {
		$('.focus-off').fadeOut(300);
		setTimeout(function() {
			$('.focus-off').remove();
		}, 300);
		$('body').css('overflow', 'visible'); // @note Scroll réactivé
	});
	e.preventDefault();
});


// -----------------------------------------------------------------------------
// @section     Print
// @description Commande pour l'impression
// -----------------------------------------------------------------------------

jQuery(document).on('click', '.cmd-print', function() {
	window.print();
	return false;
});


// -----------------------------------------------------------------------------
// @section     Popin
// @description Gestion de l'affichage des fenêtres popin
// -----------------------------------------------------------------------------

jQuery(document).on('click', '#cmd-popin', function(e) { // Supprimer ou cacher la popin
	var popin = $('#popin');
	var popinUser = $('#popin-user');
	if (popinUser) {
		$('body').css('overflow', 'visible'); // @note Scroll réactivé
	}
	popin
		.fadeOut(300);
		setTimeout(function() {
			$('.ajax-window-popin').remove(); // Suppression de la fenêtre Ajax et donc de la popin qu'elle contient
			// popin.remove();
		},300);
	popinUser
		.fadeOut(300);
		setTimeout(function() {
			popinUser.addClass('hidden');
		}, 300);
	e.preventDefault();
});

jQuery(document).on('click', '#user', function(e) { // Afficher la popin #user
	$('body').css('overflow', 'hidden'); // @note Pas de scroll sur la page si popin visible
	$('#popin-user')
		.removeClass('hidden')
		.fadeIn(300); // Afficher les popins 'login' ou 'profil'
//	e.preventDefault();
	return false;
});

jQuery(document).on('click', 'body', function(e) { // Si clic en dehors de la popin
	var inside = $('[id^="popin"]');
	if (!inside.is(e.target) && inside.has(e.target).length === 0) {
		inside.addClass('popin-error');
		setTimeout(function() {
			inside.removeClass('popin-error');
		}, 300);
	}
});


// -----------------------------------------------------------------------------
// @section Drop Cap
// -----------------------------------------------------------------------------

// @note Le pseudo-élément ::first-letter ne se comporte pas de la même manière selon tous les navigateurs, cette solution css/js corrige ce problème.
// @note Ajout d'une class .dropcap sur le p:first d'un élément parent comportant .adddropcap
jQuery.fn.dropcap = function() {
	$('[class*="adddropcap"] p:first').each(function() {
		var string = $(this),
			newString = string.html().replace(/(<([^>]+)>|[A-Z0-9«»"]|&amp;)/, '<span class="dropcap">$1</span>'); // Ajout d'un span + class sur les caractères sélectionnés, filtrage des balises html
		string.html(newString);
	});
};

jQuery('.dropcap').dropcap();


// -----------------------------------------------------------------------------
// @section     Letter
// @description Visuel des lettres capitales
// -----------------------------------------------------------------------------

// @note Ajout d'un span + class sur les caractères sélectionnés avec filtrage des balises html
// @todo Le parsage des guillemets droits est déconseillé car problématique sur les liens

// jQuery.fn.letter = function() {
// 	$(':header, legend, .h1, .h2, .h3, .h4, .h5, .h6, .addletter').each(function() {
// 		var string = $(this),
// 			newString = string.html().replace(/([A-Z«»"]|&amp;)(?![^<>]*>)/gm, '<span class="letter">$1</span>');
// 		string.html(newString);
// 	});
// };

// jQuery('.letter').letter();


// -----------------------------------------------------------------------------
// @section     Typewriter Js
// @description Effet 'machine à écrire'
// -----------------------------------------------------------------------------

jQuery.fn.typewriter = function(options){
	var opts = $.extend(true, {}, $.fn.typewriter.defaults, options);
	return this.each(function(i, item){
		var interval = parseInt(opts.interval , 10) || 100,
			tabString = $(item).text().split(''),
			length = tabString.length,
			letter = [];
		$(item).text('');
		for(var k = 0; k < length; k++){
			letter.push(
				$("<span/>", {
					"css" : {
						"display" : "none"
					},
					"text" : tabString[k]
				})
			);
		}
		$(item).queue( function() {
			for(var i = 0; i < length; i++){
				letter.shift().appendTo(item).delay(interval * i).fadeIn(600);
			}
			$(this).dequeue();
		});
	});
};

(function($) {
	$.fn.typewriter.defaults = {
		'interval' : 30
	};
	$('.typewriter').typewriter();
})(jQuery);


// -----------------------------------------------------------------------------
// @section Tooltips
// -----------------------------------------------------------------------------

jQuery('.addtooltips a').each(function() {
	var link = $(this),
		title = link.attr('title'); // Stockage de tous les titles dans une variable
	link.css('position', 'relative');
	link.on('mouseenter', function() {
		if (title === undefined || title === '') return false; // Pas d'infobule si title manquant ou vide
		link.append('<div class="tooltip">' + title + '</div>');
		link.attr('title', ''); // Empêche l'affichage des infobules par défaut en vidant les titles
		var tooltip = $('.tooltip');
		tooltip.css({
			'position' : 'absolute',
			'opacity' : '0'
		});
		tooltip.animate({
			'opacity' : '1'
		}, 500);
	});
	link.on('mouseout', function() {
		var tooltip = $('.tooltip');
		tooltip.fadeOut(500, function() {
			tooltip.remove();
			link.attr('title', title); // Réinjecter la valeur du title pour l'accessibilité
		});
	});
});


// -----------------------------------------------------------------------------
// @section Text selection
// -----------------------------------------------------------------------------

// @see http://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
// @link http://jsfiddle.net/edelman/KcX6A/1506/
jQuery.fn.selectText = function() {
	var element = this[0],
		doc = document.body;
	if (doc.createTextRange) {
		range = doc.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};

jQuery('pre code').each(function() { // Création du bouton de commande
	var select = $(this).data('select'),
		value = $(this).data('value');
	if (select) {
		var code = $(this);
		code.parent().css('position', 'relative');
		code.wrapInner('<div/>'); // @bugfix @affected IE (au minimum) @note L'ajout d'une div entre l'élément code et son contenu permet d'éviter la sélection non souhaitée de ses pseudo-éléments
		if (value) {
			code.prepend('<button class="button">' + value + '</button>');
		} else {
			code.prepend('<button class="button">Select</button>');
		}
		$(this).parent().find('button')
		.css({
			'position': 'absolute',
			'right': '0'
		})
		.on('click', function() {
			code.find('div').selectText();
		});
	}
});


// -----------------------------------------------------------------------------
// @section     Font CDN fails
// @description Solution de repli si font CDN de police défaillante
// -----------------------------------------------------------------------------

// @see http://wordpress.stackexchange.com/questions/142241/how-to-provide-a-local-fallback-for-font-awesome-if-cdn-fails
// @todo En développement...
//	(function test($){
//		var $span = $('<span style="display:none;font-family:Tangerine"></span>').appendTo('body'); // création d'un span de test
//		if ($span.css('fontFamily') !== 'Tangerine'){
//			$('head').append('<link href="./Styles/Public/Fonts.css" rel="stylesheet">'); // lien de repli
//		}
//		$span.remove();
//	})(jQuery);


// -----------------------------------------------------------------------------
// @section Ajax
// -----------------------------------------------------------------------------

// @note Renseignement du script via des attributs data-* plutôt que via les IDs : solution bien plus souple permettant d'utliser les même fichiers cibles sur une même page web, à divers endroits de cette page.

// @documentation :
// - L'attribut 'data-display' détermine la prise en charge du contenu Ajax par le script
//      @param 'global' : ouverture du contenu Ajax dans une fenêtre globale [1]
//      @param 'popin' : ouverture dans une popin [2]
//      @param '***' : ouverture dans une fenêtre dédiée [3]
// - L'attribut 'data-url' de l'élément ajax doit correspondre au nom du fichier placé dans le dossier 'ajax'. Le script récupère le fichier et l'affiche dans une fenêtre '.ajax-window-*'.

jQuery(document).on('click', '[data-display][data-path]', function() {
	$('.ajax-window').parent().parent().remove(); // Si fichier déjà appelé précédement
	obj = $(this);
	type = obj.data('display');
	path = obj.data('path');
	if (type === 'global') { // [1]
		$('<div class="section"><div class="wrap"><div class="ajax-window"></div></div></div>').appendTo('main'); // Création d'une fenêtre Ajax
		$.ajax({
			url : path + '.php',
			complete : function (xhr, result) {
				if(result != 'success') { // Gestion des erreurs
					$('<div class="section"><div class="wrap"><div class="ajax-window"><p class="message-error">Error: File not found</p></div></div></div>').appendTo('main');
					return;
				}
				var response = xhr.responseText;
				$('.ajax-window').html(response);
			}
		});
	} else if (type === 'popin') { // [2]
		$('body').css('overflow', 'hidden'); // Pas de scroll sur la page si popin ouverte
		$('<div class="ajax-window-popin"/>').appendTo('body'); // Création d'une fenêtre Ajax
		$.ajax({
			url : path + '.php',
			complete : function (xhr, result) {
				if(result != 'success') { // Gestion des erreurs
					$('<div class="section"><div class="wrap"><div class="ajax-window"><p class="message-error">Error: File not found</p></div></div></div>').appendTo('main');
					return;
				}
				var response = xhr.responseText;
				$('.ajax-window-popin')
					.html(response)
					.append('<a href="" id="cmd-popin"/>')
					.wrapInner('<section id="popin" class="popin"/>');
			}
		});
	} else { // [3]
		$.ajax({
			url : path + '.php',
			complete : function (xhr, result) {
				if(result != 'success') { // Gestion des erreurs
					$('<div class="section"><div class="wrap"><div class="ajax-window"><p class="message-error">Error: File not found</p></div></div></div>').appendTo('main');
					return;
				}
				var response = xhr.responseText;
				$('.ajax-window-' + type).html(response);
			}
		});
	}
});


// -----------------------------------------------------------------------------
// @section Auto Scroll
// -----------------------------------------------------------------------------

// Scroll vers un élément ajax qui vient d'être appelé
jQuery(document).on('click', '#comments', function() {
		setTimeout(function() {
			$('html, body').animate({
				scrollTop: $("#index-comments").offset().top
			}, 600);
	}, 300);
});


// -----------------------------------------------------------------------------
// @section CNIL
// @description Gestion du message d'information exigé par la CNIL
// -----------------------------------------------------------------------------

// @note Ce script peut-être désacrivé si les données utilisateurs ne sont pas récupérées lors de la navigation sur les pages

jQuery('.terms-use').css('display', 'inline'); // @note Par défaut l'élément est caché afin d'éviter un visuel désagréable au chargement de la page

jQuery(document).on('click', '#terms-use', function() {
	localStorage.setItem('termsuse', 'true');
	$('.terms-use').remove();
});

if (localStorage.getItem('termsuse') === 'true') {
	$('.terms-use').remove();
}

// Réinitialisation de la valeur pour les tests, la clef peut aussi s'effacer directement via l'outil d'inspection
//	localStorage.removeItem('termsuse');


// -----------------------------------------------------------------------------
// @section Console
// -----------------------------------------------------------------------------

// @note Attention : IE avec son mode "développement" désactivé plantera si les scripts dédiés à la console sont actifs.
// @note Recommandation de désactiver les scripts dédiés à la console en mode production.

/*
// Évite à IE de planter si mode "développement" désactivé
(function($) {
	var f = function() {};
	if (!window.console){
		window.console = {
			log:f, info:f, warn:f, debug:f, error:f
		};
	}
})(jQuery);

// Code de la touche du clavier actuellement pressée
jQuery(document).keydown(function(e){
	console.info('Code keyboard key: ' + e.keyCode);
});

// Test du temps d'éxecution d'un script
console.time('test');
// Le script
console.timeEnd('test');
*/
