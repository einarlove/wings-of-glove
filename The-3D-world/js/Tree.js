function Tree(size, position){
	"use strict";


	var tree;

	// Vary the forest with 2 types of trees
	var randomTree = THREE.Math.randInt(0,1);
	var type = randomTree ? "Generic" : "GenericLower";
	var model = treeModel[type];

	window.model = treeModel;
	createCloud(model.geometry, model.materials)
	function createCloud(geometry, materials){
		// If there is trees to close, abort!
		if(checkProximityToOther("tree", 30)) return;

		// Don't know how to colorize the trees, so I copy the
		// color from the .color to emissive to get an effect.
		for (var i=0; i<materials.length; i++) {
		    // materials[i].emissive = materials[i].color;
		    materials[i].ambient = materials[i].color;
		    // materials[i].wireframe = true;
		}




		var material = new THREE.MeshFaceMaterial(materials);

		tree = new THREE.Mesh(geometry, material);
		tree.name = "tree";


		// ———————— Bug —————————
		// Applies to all trees since they share geometries.
		// Could clone geometry for each tree, but insane performance hit
		// var geometry = geometry.clone();
		// ———————————————————————
		// // Random rotation to vary the forest
		// var randomDegree = THREE.Math.randInt(0, 360);
		// tree.applyMatrix( new THREE.Matrix4().makeRotationY(deg2rad(randomDegree)));

		//———— Another try ————————
		// var axis = new THREE.Vector3(0,1,0);
		// var radians = deg2rad(30);
		// var rotation = new THREE.Matrix4();
		// rotation.makeRotationAxis(axis.normalize(), radians);
		// rotation.multiplySelf(tree.matrix);
		// tree.matrix = rotation;
		// tree.rotation.setEulerFromRotationMatrix(tree.matrix);

		//————————————————————————



		// Size down
		var randomSize = THREE.Math.randInt(1,3)
		var newSize = (randomTree ? 0.3 : 0.1) * randomSize;
		tree.scale.x = tree.scale.y = tree.scale.z = newSize * size;

		tree.castShadow = true;

		window.tree = tree;
		tree.position = position;
		tree.lookAt(globe.position);
		// console.log(tree);

		globe.add(tree);
	}








	function checkProximityToOther(type, margin){
		var toCloseToOthers = false;
		// If position is close to other trees, abort!
		globe.children.forEach(function(element){
			if(element.name === type &&
				element.position.distanceTo(position) < size + margin ){
				toCloseToOthers = true;
			}
		})
		if(toCloseToOthers) return true;
		else return false;
	}

	return tree;
}

var treeModel = {};
Tree.loadGeneric = function(geometry, materials){
	fixGeometry(geometry);
	treeModel.Generic = {
		geometry: geometry,
		materials: materials
	}
}
Tree.loadGenericLower = function(geometry, materials){
	fixGeometry(geometry);
	treeModel.GenericLower = {
			geometry: geometry,
			materials: materials
		}
}
function fixGeometry(geometry){
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-30, -10, 0)); // Translate anchor point to bottom of tree stem
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX( deg2rad(-90) )); // Rotate tree to point vertical when .lookAt
}