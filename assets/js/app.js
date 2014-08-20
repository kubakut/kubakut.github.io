var map, boroughSearch = [], theaterSearch = [], museumSearch = [];

$(document).ready(function() {
  getViewport();
});

function getViewport() {
  if (sidebar.isVisible()) {
    map.setActiveArea({
      position: "absolute",
      top: "0px",
      left: $(".leaflet-sidebar").css("width"),
      right: "0px",
      height: $("#map").css("height")
    });
  } else {
    map.setActiveArea({
      position: "absolute",
      top: "0px",
      left: "0px",
      right: "0px",
      height: $("#map").css("height")
    });
  }
  if (document.body.clientWidth <= 767) {
    $(".leaflet-sidebar .close").css("top", "2px");
  } else {
    $(".leaflet-sidebar .close").css("top", "12px");
  }
}

function sidebarClick(id) {
  /* If sidebar takes up entire screen, hide it and go to the map */
  if (document.body.clientWidth <= 767) {
    sidebar.hide();
    getViewport();
  }
  map.addLayer(theaterLayer).addLayer(museumLayer);
  var layer = markerClusters.getLayer(id);
  markerClusters.zoomToShowLayer(layer, function() {
    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 18);
    layer.fire("click");
  });
}

/* Basemap Layers */
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOSM =  L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
	minZoom: 0,
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});
var mapquestHYB = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day.mobile/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
  attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
  subdomains: '1234',
  mapID: 'newest',
  app_id: 'CnMYdeDMhPqbw8Y4jvBu',
  app_code: '9EJrU_Za45utGoXRQXyGXw',
  base: 'aerial',
  minZoom: 0,
  maxZoom: 20
});

/* Overlay Layers */
var highlight = L.geoJson(null);

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "grey",
      fill: false,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/boroughs.geojson", function (data) {
  boroughs.addData(data);
});

var subwayLines = L.geoJson(null, {
  style: function (feature) {
    if (feature.properties.route_id === "1" || feature.properties.route_id === "2" || feature.properties.route_id === "3") {
      return {
        color: "#ff3135",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "4" || feature.properties.route_id === "5" || feature.properties.route_id === "6") {
      return {
        color: "#009b2e",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "7") {
      return {
        color: "#ce06cb",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "A" || feature.properties.route_id === "C" || feature.properties.route_id === "E" || feature.properties.route_id === "SI" || feature.properties.route_id === "H") {
      return {
        color: "#fd9a00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "Air") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "B" || feature.properties.route_id === "D" || feature.properties.route_id === "F" || feature.properties.route_id === "M") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "G") {
      return {
        color: "#9ace00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "FS" || feature.properties.route_id === "GS") {
      return {
        color: "#6e6e6e",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "J" || feature.properties.route_id === "Z") {
      return {
        color: "#976900",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "L") {
      return {
        color: "#969696",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "N" || feature.properties.route_id === "Q" || feature.properties.route_id === "R") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([e.latlng.lat, e.latlng.lng], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        subwayLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/subways.geojson", function (data) {
  subwayLines.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var theaterLayer = L.geoJson(null);
var theaters = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        html: "<table><tr><th style='font-size:13px;' class='label label-danger'>"+feature.id+"</th></tr><tr><td><img style='margin: 0px 0px' src='/assets/img/hriste.png'></td></tr></table>",
        iconSize: [24, 27],
        iconAnchor: [12, 28],
        className:'text-center',        
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<div style='font-size: 17px; margin:2px; padding: 1em 1em 1em 1em;' class='bg-primary' role='alert'>" + feature.properties.INFO + "</div>" + "<br></br>" +
"</div>"+
"<div class='panel panel-info'>" +
      "<div class='panel-heading'>"+
        "<h3 class='panel-title'>Popis</h3>"+
      "</div>"+
      "<div class='panel-body'>" +
        feature.properties.POPIS +
      "</div>"+
"</div>"+
"<div class='panel panel-info'>" +
      "<div class='panel-heading'>"+
        "<h3 class='panel-title'>Doporučujeme</h3>"+
      "</div>"+
      "<div class='panel-body'>" +
        feature.properties.DOPORUCENI +
      "</div>"+
"</div>"+
"<div class='panel panel-info'>" +
      "<div class='panel-heading'>"+
        "<h3 class='panel-title'>Sociální zařízení</h3>"+
      "</div>"+
      "<div class='panel-body'>" +
        feature.properties.SOCIALNI +
      "</div>"+
"</div>"+
"<div class='panel panel-info'>" +
      "<div class='panel-heading'>"+
        "<h3 class='panel-title'>Občerstvení</h3>"+
      "</div>"+
      "<div class='panel-body'>" +
        feature.properties.OBCERSTVENI +
      "</div>"+
"</div>"+
"<div class='panel panel-info'>" +
      "<div class='panel-heading'>"+
        "<h3 class='panel-title'>Doprava</h3>"+
      "</div>"+
      "<div class='panel-body'>" +
        feature.properties.DOPRAVA +
      "</div>"+
"</div>"
 ;
      
      var nadpis = feature.id + ". " + feature.properties.NAME;
      
      layer.on({
        click: function (e) {
          var galerie ="";
          $("#feature-title").html(nadpis);
          $("#feature-info").html(content);
        for ( var i = 0; i < feature.properties.GALERIE; i++ ) {
            galerie = galerie+'<obr>';
    
}    
            
          $("#feature-gal").html(galerie);
            
          $(document).ready( function() {
              $("obr").each( function(i) {
                  $(this).prepend("<center><a href='img/"+feature.id+"/"+(++i)+".JPG' target='_blank'><img style='margin: 10px 0px' src='img/"+feature.id+"/"+(i)+".JPG'  height='auto' max-width: 100%; class='img-responsive img-thumbnail' /></a></center>");	
        });
 
});   

  
  
 


          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
      $("#theater-table > tbody").append('<tr class="tbl-item" style="cursor: pointer;" onclick="sidebarClick('+L.stamp(layer)+'); return false;"><td class="theater-name ">'+ "<b>"+ '<p class="title">' + (feature.id) + "</b>.</p> " +layer.feature.properties.NAME+'<p class="'+feature.mesto+'">'+'</p></td><td style="vertical-align: middle;"><i style="vertical-align: middle;" class="fa fa-chevron-right pull-right"></td></tr>');
        $('document').ready(function(){
				$('#demo').jplist({
				    debug:	true
					,itemsBox: '.demo-tbl' 
					,itemPath: '.tbl-item' 
					,panelPath: '.jplist-panel'
                    ,redrawCallback: function(collection, $dataview, statuses){
                    var theaterList = new List("theaters", {valueNames: ["theater-name"]}).sort("theater-name", {order:"asc"});
                 }						    
                   
                   
				});
          
			});
      theaterSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.mesto,
        source: "Hřiště",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/hriste.geojson", function (data) {
  theaters.addData(data);
  map.addLayer(theaterLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var museumLayer = L.geoJson(null);
var museums = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/museum.png",
        iconSize: [32, 37],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Název</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Popis</th><td>" + feature.properties.POPIS + "</td></tr>"+"<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#feature-gal").html('');
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
      $("#museum-table tbody").append('<tr style="cursor: pointer;" onclick="sidebarClick('+L.stamp(layer)+'); return false;"><td class="museum-name">'+ "<b>" + feature.id + "</b>. "+layer.feature.properties.NAME+'<i class="fa fa-chevron-right pull-right"></td></tr>');
      museumSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "Občerstvení",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/obcerstveni.geojson", function (data) {
  museums.addData(data);
});

map = L.map("map", {
  zoom: 5,
  center: [14.338222, 50.04878],
  layers: [mapquestOSM, boroughs, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === theaterLayer) {
    markerClusters.addLayer(theaters);
  }
  if (e.layer === museumLayer) {
    markerClusters.addLayer(museums);
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === theaterLayer) {
    markerClusters.removeLayer(theaters);
  }
  if (e.layer === museumLayer) {
    markerClusters.removeLayer(museums);
  }
});

/* Clear feature highlight when featureModal is closed */
$("#featureModal").on("hide.bs.modal", function (e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "Mapa od <a href='http://www.openstreetmap.org/'>OpenStreetMap.org</a> | <a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Zdroje</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "icon-direction",
  metric: false,
  strings: {
    title: "Moje lokace",
    popup: "Nacházíte se {distance} {unit} od tohoto bodu.",
    outsideMapBoundsMsg: "Nacházíte se mimo hranice mapové zóny"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

var sidebar = L.control.sidebar("sidebar", {
  closeButton: true,
  position: "left"
}).on("shown", function () {
  getViewport();
}).on("hidden", function () {
  getViewport();
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
  sidebar.show();
}

var baseLayers = {
  "Mapa A": mapquestOAM,
  "Mapa B": mapquestOSM,
  "Satelitní": mapquestHYB
};

var groupedOverlays = {
  "Seznam míst": {
    "<img src='assets/img/hriste.png' width='24' height='28'>&nbsp;Hřiště": theaterLayer,
    "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Občerstvení": museumLayer
  },
  //"Reference": {
  //  "Boroughs": boroughs,
   // "Subway Lines": subwayLines
  //}
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  /* Fit map to boroughs bounds */
  map.fitBounds(boroughs.getBounds());
  $("#loading").hide();

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });

  var theatersBH = new Bloodhound({
    name: "Hřiště",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: theaterSearch,
    limit: 10
  });
  var theaterList = new List("theaters", {valueNames: ["theater-name"]}).sort("theater-name", {order:"asc"});

  var museumsBH = new Bloodhound({
    name: "Občerstvení",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: museumSearch,
    limit: 10
  });
  var museumList = new List("museums", {valueNames: ["museum-name", "museum-address"]}).sort("museum-name", {order:"asc"});

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  boroughsBH.initialize();
  theatersBH.initialize();
  museumsBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Boroughs",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Boroughs</h4>"
    }
  }, {
    name: "Hřiště",
    displayKey: "name",
    source: theatersBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/hriste.png' width='24' height='28'>&nbsp;Hřiště</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{mesto}}</small>"].join(""))
    }
  }, {
    name: "Občerstvení",
    displayKey: "name",
    source: museumsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;Občerstvení</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boroughs") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Hřiště") {
      if (!map.hasLayer(theaterLayer)) {
        map.addLayer(theaterLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Občerstvení") {
      if (!map.hasLayer(museumLayer)) {
        map.addLayer(museumLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});
