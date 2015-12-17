// -----------------------------------------------------------------------------
// @name        Themes
// @description Choix d'un thème
// -----------------------------------------------------------------------------

var setDefaultTheme = 'Ratatouille'; // @param Nom du thème en CamelCase
var beginLink = '<link rel="stylesheet" href="/Public/Styles/Main';
var endLink = '.css" media="screen" id="stylesheet">';

function defaultTheme() {
	$('#stylesheet').replaceWith(beginLink + setDefaultTheme + endLink);
}

function populateTheme() {
	$('#stylesheet').replaceWith(beginLink + localStorage.getItem('theme') + endLink);
}

jQuery(document).on('click', '[id^="theme"]', function() {
	if ('theme' + localStorage.getItem('theme') != 'theme' + this.value) { // Seulement si option pas encore séléctionnée
		localStorage.setItem('theme', this.value); // Option mémorisée en Web Storage
		setTimeout(populateTheme, 200);
	}
});

jQuery(document).on('click', '#clearTheme', function() {
	if (localStorage.getItem('theme')) { // Seulement si option existante
		localStorage.removeItem('theme'); // Option Web Storage effacée
		setTimeout(defaultTheme, 200);
	}
});

if (localStorage.getItem('theme')) {
	populateTheme();
	$('[id^="theme' + localStorage.getItem('theme') +'"]').attr('checked', 'checked'); // Bouton radio checké si option mémorisée
}
