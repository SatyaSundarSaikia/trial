
//print button

// import Map from 'ol/Map.js';
// import View from 'ol/View.js';
// import WKT from 'ol/format/WKT.js';
// import {OSM, Vector as VectorSource} from 'ol/source.js';
// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';


 


// Define the view
const view = new ol.View({
	projection: 'EPSG:4326',
	center: [82.00, 23.00],
	zoom: 5,
  });
  
  // Define base layer
  const raster = new ol.layer.Tile({
	source: new ol.source.OSM(),
  });
  
  // Define vector layer with a polygon feature
  const format = new ol.format.WKT();
  const feature = format.readFeature(
	'POLYGON((10.689697265625 -25.0927734375, 34.595947265625 ' +
	'-20.1708984375, 38.814697265625 -35.6396484375, 13.502197265625 ' +
	'-39.1552734375, 10.689697265625 -25.0927734375))',
  );
  feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
  
  const vectorSource = new ol.source.Vector({
	features: [feature],
  });
  const vector = new ol.layer.Vector({
	source: vectorSource,
	opacity: 0.5,
  });
  
  // Define the map
  const map = new ol.Map({
	layers: [raster, vector],
	target: 'map',
	view: view,
  });
  
  // Define export dimensions
  const dims = {
	a0: [1189, 841],
	a1: [841, 594],
	a2: [594, 420],
	a3: [420, 297],
	a4: [297, 210],
	a5: [210, 148],
  };
  
  // Define export button functionality
  const exportButton = document.getElementById('export-pdf');
  
  exportButton.addEventListener(
	'click',
	function () {
	  exportButton.disabled = true;
	  document.body.style.cursor = 'progress';
  
	  const format = document.getElementById('format').value;
	  const resolution = document.getElementById('resolution').value;
	  const dim = dims[format];
	  const width = Math.round((dim[0] * resolution) / 25.4);
	  const height = Math.round((dim[1] * resolution) / 25.4);
	  const size = map.getSize();
	  const viewResolution = map.getView().getResolution();
  
	  map.once('rendercomplete', function () {
		const mapCanvas = document.createElement('canvas');
		mapCanvas.width = width;
		mapCanvas.height = height;
		const mapContext = mapCanvas.getContext('2d');
		Array.prototype.forEach.call(
		  document.querySelectorAll('.ol-layer canvas'),
		  function (canvas) {
			if (canvas.width > 0) {
			  const opacity = canvas.parentNode.style.opacity;
			  mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
			  const transform = canvas.style.transform;
			  const matrix = transform
				.match(/^matrix\(([^\(]*)\)$/)[1]
				.split(',')
				.map(Number);
			  CanvasRenderingContext2D.prototype.setTransform.apply(
				mapContext,
				matrix,
			  );
			  mapContext.drawImage(canvas, 0, 0);
			}
		  },
		);
		mapContext.globalAlpha = 1;
		mapContext.setTransform(1, 0, 0, 1, 0, 0);
		const pdf = new jspdf.jsPDF('landscape', undefined, format);
		pdf.addImage(
		  mapCanvas.toDataURL('image/jpeg'),
		  'JPEG',
		  0,
		  0,
		  dim[0],
		  dim[1],
		);
		pdf.save('map.pdf');
		map.setSize(size);
		map.getView().setResolution(viewResolution);
		exportButton.disabled = false;
		document.body.style.cursor = 'auto';
	  });
  
	  const printSize = [width, height];
	  map.setSize(printSize);
	  const scaling = Math.min(width / size[0], height / size[1]);
	  map.getView().setResolution(viewResolution / scaling);
	},
	false,
  );
  