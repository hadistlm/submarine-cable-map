L.mapbox.accessToken = 'pk.eyJ1IjoiaGFkaXN0bG0iLCJhIjoiY2tpemVkeXlzMGI5bTJ4a2xldXRmcmdwMSJ9.C8rujS9lk1cQrp9NYDrrPw';

const map = L.mapbox.map('map', null, { zoomControl:false })
    .setView([0,0],3)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/hadistlm/ckizf2lal5lu619nan6me2whk'));

var layers = document.getElementById('map-ui');
// layers
var nogchq_layer = new L.FeatureGroup();
var landing_points = new L.FeatureGroup();
var isgchq_layer = new L.FeatureGroup();
var allData = new L.FeatureGroup();
var nogchq_style = {
    "color": "#ccc",
    "weight": 1,
    "opacity": 0.5
};
var gchq_style = {
    "color": "#FF9900",
    "weight": 1,
    "opacity": 1
};

new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
// layer toggle 
addLayer(nogchq_layer, 'gray', "Not In GCHQ Documents", 0);
addLayer(isgchq_layer, 'gray', "In GCHQ Documents", 1);
addLayer(allData, 'orange', "All Available data", 1);

$.getJSON("./data/joined_nogchq.geojson", function(data) {
    var nogchq = L.geoJson(data, {style: nogchq_style});
    nogchq.addTo(nogchq_layer);
});

$.getJSON("./data/joined_isgchq.geojson", function(data) {
    var gchq;

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#FF9900',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }
    
    function resetHighlight(e) {
        gchq.resetStyle(e.target);
    }

    var gchq = L.geoJson(data, {
      style: gchq_style,
      onEachFeature: function (feature, layer) {
        layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
        });
        var names = [
            { feat: feature.properties.uk, name: 'UK'},
            { feat: feature.properties.dacron, name: ' DACRON'  },
            { feat: feature.properties.remedy, name: ' REMEDY' },
            { feat: feature.properties.pinnage, name: ' PINNAGE' },
            { feat: feature.properties.street_car, name: ' STREET CAR' },
            { feat: feature.properties.gerontic, name: ' GERONTIC' },
            { feat: feature.properties.vitreous, name: ' VITREOUS'},
            { feat: feature.properties.little, name: ' LITTLE'}
           ];
        var programs = [];
        for (var i = 0; i < names.length; i++) {
          if (names[i].feat != ''){ programs.push(names[i].name)
          feature.properties.programs = programs;
          };
        };
        layer.bindPopup('<h3>'+feature.properties.name+'</h3><hr><b>Owners: </b>'+feature.properties.owners+'<hr><b>Associated GCHQ Programs: </b><br>'+ feature.properties.programs)
      }
    });

    gchq.addTo(isgchq_layer);
});

$.getJSON("./data/cable-geo.json", function(data) {
    var getAll;

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#FF9900',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }
    
    function resetHighlight(e) {
        getAll.resetStyle(e.target);
    }
    var getAll = L.geoJson(data, {
      style: gchq_style,
      onEachFeature: function (feature, layer) {
        // console.log(feature)
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        var names = [
            { feat: feature.properties.uk, name: 'UK'},
            { feat: feature.properties.dacron, name: ' DACRON'  },
            { feat: feature.properties.remedy, name: ' REMEDY' },
            { feat: feature.properties.pinnage, name: ' PINNAGE' },
            { feat: feature.properties.street_car, name: ' STREET CAR' },
            { feat: feature.properties.gerontic, name: ' GERONTIC' },
            { feat: feature.properties.vitreous, name: ' VITREOUS'},
            { feat: feature.properties.little, name: ' LITTLE'}
        ];
        var programs = [];
        for (var i = 0; i < names.length; i++) {
          if (names[i].feat != ''){ programs.push(names[i].name)
          feature.properties.programs = programs;
          };
        };
        
        $.getJSON( `./data/cable/${feature.properties.slug}.json`, function( data ) {
          layer.bindPopup('<h3>'+data.name+'</h3><hr><b>Owners: </b>'+data.owners+'<hr><b>Associated GCHQ Programs: </b><br>'+ feature.properties.programs)
        });
      }
    });

    getAll.addTo(allData);
});

function addLayer(layer, id, name, zIndex) {
    layer
        .setZIndex(zIndex)
        .addTo(map);

    var item = document.createElement('li');
        item.className= id;
        check = document.createElement('input');
        check.type = 'checkbox';
        check.checked='checked';
        txt = document.createElement('span');
        txt.innerHTML = name;

    check.onclick = function(e) {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            e.check.checked = ''
        } else {
            map.addLayer(layer);
            e.check.checked='checked';
        }
    };
    item.appendChild(check);
    item.appendChild(txt);
    layers.appendChild(item);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

