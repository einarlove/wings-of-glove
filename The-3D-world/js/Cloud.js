function Cloud(){

	var cloud = new THREE.Object3D();

	JSONLoader.load("js/models/treeGeneric.js", createCloud);
	function createCloud(geometry, materials){

		for (var i=0; i<materials.length; i++) {
		    materials[i].emissive = materials[i].color;
		}


		// Translate anchor point to bottom of tree stem
		var translation = new THREE.Matrix4().makeTranslation(-20, 0, 0);
		geometry.applyMatrix(translation);

		var material = new THREE.MeshFaceMaterial(materials);
		var mesh = new THREE.Mesh(geometry, material);

		// Size down
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

		cloud.add(mesh);
		globe.add(cloud);
	}


	return cloud;
}