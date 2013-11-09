function Grass(size, position){
	"use strict";


	var grass;

	// Vary the forest with 2 types of trees
	var randomGrass = THREE.Math.randInt(1,5);
	var model = grassModel[randomGrass];

	window.model = grassModel;
	createCloud(model.geometry, model.materials)
	function createCloud(geometry, materials){
		// If there is trees to close, abort!
		if(checkProximityToOther("tree", size*40)) return;

		// Don't know how to colorize the trees, so I copy the
		// color from the .color to emissive to get an effect.
		for (var i=0; i<materials.length; i++) {
		    // materials[i].ambient = globe.color;
		    // materials[i].emissive = materials[i].color;
		    // materials[i].wireframe = true;
		}




		var material = new THREE.MeshFaceMaterial(materials);

		grass = new THREE.Mesh(geometry, material);
		grass.name = "grass";

		// Size down
		grass.scale.x = grass.scale.y = grass.scale.z = size;

		grass.position = position;
		grass.lookAt(globe.position);

		globe.add(grass);
	}





	function checkProximityToOther(type, margin){
		var toCloseToOthers = false;
		// If position is close to other trees, abort!
		globe.children.forEach(function(element){
			if(element.name === type &&
				element.position.distanceTo(position) < size + margin ){
				console.log("close");
				toCloseToOthers = true;
			}
		})
		if(toCloseToOthers) return true;
		else return false;
	}

	return grass;
}

var grassModel = [];
Grass.load1 = function(g, m){ fixGeo(g); grassModel[1] = { geometry: g, materials: m}}
Grass.load2 = function(g, m){ fixGeo(g); grassModel[2] = { geometry: g, materials: m}}
Grass.load3 = function(g, m){ fixGeo(g); grassModel[3] = { geometry: g, materials: m}}
Grass.load4 = function(g, m){ fixGeo(g); grassModel[4] = { geometry: g, materials: m}}
Grass.load5 = function(g, m){ fixGeo(g); grassModel[5] = { geometry: g, materials: m}}

function fixGeo(geometry){
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -3, 0)); // Translate anchor point to bottom of tree stem
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX( deg2rad(-90))); // Rotate tree to point vertical when .lookAt
}