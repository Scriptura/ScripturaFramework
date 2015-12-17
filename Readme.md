# Scriptura
> Interface for web apps

__Project under development...__

* [Demo Page](http://scriptura.github.io/)

## About

### Eng

_Scriptura_ is a framework html/js/css light that aims to simplify the layout. Here, no supperflu adding html tags or index in the flow of web pages in order to support a script or a visual effect, priority is given to content, the HTML code is clean and respects the logic of the flow Datas.

The idea is to start from a properly structured text and to surround it with a parent element with a class. The part of the target document will be transformed as tabs or accordion menu, or anything else as appropriate. For examples see our ([StyleGuide](./Pages/StyleGuide.html)).

The framework allows for ([complex layouts](./Pages/Layouts.html)) through a grid system based on the modules css FlexBox and calc() function.

Their scripts sides are based on the Web Storage rather than cookies.

These technologies imply a limitation of backward compatibility with older browsers, bias on our part that allows us the use of the latest technologies without compromise web.

### Fr

_Scriptura_ est un framework html/js/css léger dont le but est de simplifier la mise en page. Ici, pas d'ajout supperflu de balises html ou d'index dans le flux des pages web dans le but de soutenir un script ou un effet visuel, la priorité est donnée au contenu, le code html reste propre et respecte la logique du flux des données.

L'idée est de partir d'un texte correctement structuré et de l'entourer d'un élément parent comportant une classe. La partie du document ainsi ciblée sera transformée en menu onglets ou accordéon, ou encore autre chose selon les besoins. Pour voir des exemples consultez notre ([StyleGuide](./Pages/StyleGuide.html)).

Le framework permet des ([mises en page complexes](./Pages/Layouts.html)) grâce à un système de grille basé sur les modules css flexbox et la fonction calc().

De leurs côtés les scripts s'appuient sur le Web Storage plutôt que sur les cookies.

Ces technologies impliquent une limitation de la rétrocompatibilité aux navigateurs récents, un parti pris de notre part qui nous permet l'utilisation des dernières technologies du web sans compromis.

## Folder tree and key files

    ├── index.html.jade
    ├── Scripts
    │   ├── Vendors
    │   ├── Sources
    │   │   └── Main.js
    ├── Styles
    │   │   └── Main.styl
    │       └── Partial
    ├── Public
    │   ├── Scripts
    │   │   └── Main.js
    │   └── Styles
    │       ├── Main*.css
    │       ├── Print.css
    │       └── Expanded
    ├── Images
    ├── Fonts
    ├── package.json
    ├── Gruntfile.js
    ├── node_modules
    └── Readme.md

## Template engine with Jade lang and Sass

The framework uses the syntax [Jade](http://jade-lang.com/) and [Stylus](https://learnboost.github.io/stylus/).

## Get Started

### First stage

Work with the workflow by running this command with your terminal to the file in the root: `$ gulp`

### Second stage

Create an .html.jade or an .php.jade file in the folder.

With in the file's header:

    link(rel='stylesheet', href='./Public/Styles/Main.css', media='screen')

And in the file's footer:

    script(src='./Scripts/Vendors/JQuery.js')
    script(src='./Public/Scripts/Main.js')

### Third stage

That's all! You can start creating with jade syntaxe.
