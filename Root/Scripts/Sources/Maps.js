// -----------------------------------------------------------------------------
// @name        Maps
// @description Carte Google Map de test
// -----------------------------------------------------------------------------

function initMap() {

  var marker1 = '../Images/Marker.svg';
  var marker2 = '../Images/Marker2.svg';
  var marker3 = '../Images/Marker3.svg';

  var locations = [
    ['Château de Montrond les Bains', 45.641507, 4.230653, marker1],
    ['Château de la Bâtie d\'Urfé', 45.727812, 4.078731, marker1],
    ['Château de Chalmazel', 45.702396, 3.8511, marker2],
    ['Château de Couzan', 45.728146, 3.969063, marker1],
    ['Château de Bouthéon', 45.544066, 4.263822, marker1],
    ['Ruines du Donzy', 45.747927, 4.282442, marker2],
    ['Prieuré de Montverdun', 45.717916, 4.066487, marker3],
    ['Prieuré de Champdieu', 45.644482, 4.045586, marker3],
    ['Prieuré de Saint-Romain-le-Puy', 45.557543, 4.125911, marker3],
    ['Collégiale de Montbrison', 45.605652, 4.066235, marker3],
    ['Collégiale de Saint-Bonnet-le-Château', 45.423614, 4.067601, marker3]
  ];

  // @link https://developers.google.com/maps/documentation/javascript/styling#stylers
  // @link http://googlemaps.github.io/js-samples/styledmaps/wizard/index.html
  var customMapType = new google.maps.StyledMapType(
    [
      {
        stylers: [
          //{hue: #777777},
          {visibility: 'simplified'}, // @params : on, off, simplified
          //{gamma: 0.5},
          //{weight: 0.5},
          //{lightness: '50'},
          {saturation: -100}
        ]
      },
      {
        featureType: 'poi', // Point of interest
        stylers: [
          {visibility: 'off'}
        ]
      },
      {
        featureType: 'road',
        stylers: [
          {visibility: 'simplified'}
        ]
      },
      {
        elementType: 'labels',
        stylers: [
          //{visibility: 'off'},
          {lightness: '20'}
        ]
      }
      //{
      //  featureType: 'water',
      //  stylers: [
      //    {color: '#dddddd'}
      //]
      //}
    ], {
      name: 'Custom Style'
  });

  var customMapTypeId = 'custom_style';

  var map = new google.maps.Map(document.getElementById('map'), {
    // @note Inactif si fonction d'autocentrage .fitBounds() :
    //zoom: 12,
    //center: new google.maps.LatLng(locations[0][1], locations[0][2]),
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, customMapTypeId] // Options utilisateur
    }
  });
  map.mapTypes.set(customMapTypeId, customMapType); // ajout des styles personnalisés
  map.setMapTypeId(customMapTypeId);

  /*
  // Option pour une seconde carte :

  var map2 = new google.maps.Map(document.getElementById('map2'), {
    zoom: 12,
    center: new google.maps.LatLng(locations[0][1], locations[0][2]),
  });

  marker2 = new google.maps.Marker({
    map: map2,
    position: position1,
    draggable: true
  });
  */

  var infowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds(); // Initialisation des limites de la carte

  for (i = 0; i < locations.length; i++) {

    var latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);

    marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: locations[i][3],
      animation: google.maps.Animation.DROP
    });

    bounds.extend(latLng); // Récupération des coordonnées du marqueur pour la fonction fitBounds

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(locations[i][0]); // Info list
        infowindow.open(map, marker);

        if (marker.getAnimation() !== null) { // Animation marker
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }

        if (marker.getAnimation() !== null) { // End animation marker
          setTimeout(function() {
            marker.setAnimation(null);
          }, 2000);
        }

      }
    })(marker, i));



  }

  map.fitBounds(bounds); // Calcul des limites de la cartes pour autocentrage en fonction des markers

}
