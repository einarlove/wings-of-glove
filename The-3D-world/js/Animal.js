function Animal(type, size){
	"use strict";

	var animal;

	// If model is animateable
	if(animalModel[type].geometry.morphTargets.length){
		createAnimationAnimal(animalModel[type]);
	}
	else{
		createAnimationAnimal(animalModel[type]);
	}

	function createAnimal(model){

		var material = new THREE.MeshFaceMaterial(materials);

		animal = new THREE.Mesh(geometry, material);

		// var size = 1;
		// animal.scale.x = animal.scale.y = animal.scale.z = size;

		animal.position = position;
		// animal.lookAt(globe.position);
		window.animal = animal;
		scene.add(animal);
	}

	function createAnimationAnimal(model){
		var geometry = model.geometry;

		// morphColorsToFaceColors(geometry);
		geometry.computeMorphNormals();

		var material = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			morphTargets: true,
			morphNormals: true,
			vertexColors: THREE.FaceColors,
			shading: THREE.FlatShading
		});

		animal = new THREE.MorphAnimMesh( geometry, material );

		animal.duration = 1;

		animal.lookAt(globe.position);
		game.animals.push(animal);
		globe.add(animal);
	}
	animal.scale.set(30,30,30)

	animal.target = new THREE.Object3D();
	animal.target.position = animal.position.clone();
	animal.target.rotation = animal.rotation.clone();

	return animal;
}


function morphColorsToFaceColors( geometry ) {

	if ( geometry.morphColors && geometry.morphColors.length ) {

		var colorMap = geometry.morphColors[ 0 ];

		for ( var i = 0; i < colorMap.colors.length; i ++ ) {

			geometry.faces[ i ].color = colorMap.colors[ i ];
			geometry.faces[ i ].color.offsetHSL( 0, 0.3, 0 );

		}

	}
}

var animalModel = {};
Animal.loadButterfly_hiCModel = function(g, m){
	animalModel.Butterfly_hiC = {geometry: g, materials: m}
}
Animal.loadButterfly_hiDModel = function(g, m){
	animalModel.Butterfly_hiD = {geometry: g, materials: m}
}