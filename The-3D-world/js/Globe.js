function Globe(options){
	"use strict";

	var globe = new THREE.Object3D();
	globe.verticalAxis = new THREE.Object3D();

	globe.size = options.size || 10;
	globe.color = options.color || 0x000000;
	globe.segments = options.segments || 5;
	globe.wireframe = options.wireframe || false;
	globe.name = "Globe";

	// Load texture and create a pattern of it
	globe.texture = THREE.ImageUtils.loadTexture( 'js/textures/Texture_Grass.jpg' );
	globe.texture.wrapS = globe.texture.wrapT = THREE.RepeatWrapping;
	globe.texture.repeat.set( 40, 40 );

	var geometry = new THREE.SphereGeometry(globe.size, globe.segments, globe.segments);
	var material = new THREE.MeshPhongMaterial();
	material.color = new THREE.Color(globe.color);
	material.map = globe.texture;
	material.wireframe = globe.wireframe;
	material.ambient.setHex(0x666666);
	window.mat = material;


	var mesh = new THREE.Mesh(geometry, material);
	mesh.name = "Globe";

	mesh.receiveShadow = true;

	globe.add(mesh);

	globe.verticalAxis.add(globe);
	scene.add(globe.verticalAxis);

	// Create trees on globe
	// @param Object{ size: $, amount: $ }
	globe.createTrees = function(s){
		var points = THREE.GeometryUtils.randomPointsInGeometry(geometry, s.amount);
		points.forEach(function(position){
			globe.add( new Tree(s.size, position) )
		})
	}

	// Create grass on globe
	// @param Object{ size: $, amount: $ }
	globe.createGrasses = function(s){
		var points = THREE.GeometryUtils.randomPointsInGeometry(geometry, s.amount);
		points.forEach(function(position){
			globe.add( new Grass(s.size, position) )
		})
	}

	globe.createHightMap = function(){
		var vertices = globe.children[0].geometry.vertices;
		var l = vertices.length;

		var count = 0;
		for(var i = 0; i<l; i++){
			if(vertices[i].y < globe.size*0.99 && vertices[i].y > -globe.size*0.99){

				var randomHeight = THREE.Math.randInt(1, 10);
				var newPosition = new THREE.Vector3();
				newPosition.set(globe.size + randomHeight, globe.size + randomHeight, globe.size + randomHeight)
				vertices[i].normalize();
				vertices[i].multiply(newPosition);

				count++;
			}
		}
	}

	return globe;
}




function animal(){
			// camera.position = animal.position.clone();
			// camera.position.x += 150;
			// camera.position.y += 20;
			// camera.position.z += 10;


			var dis = 10;
			var direction = animal.position.normalize().clone();
			animal.position.multiply(new THREE.Vector3(globe.size + dis,globe.size + dis,globe.size + dis));

			animal.up = direction;
			var plus = 10;
			animal.position.x -= direction.x + plus;
			animal.position.y -= direction.y + plus;
			animal.position.z -= direction.z + plus;


			// var dis = 10;
			// var up = animal.target.position.normalize();
			// animal.target.position.multiply(new THREE.Vector3(globe.size + dis,globe.size + dis,globe.size + dis));
			// animal.target.up = up;
			// animal.target.position.x = Math.cos(game.frameCount / 180) * (globe.size + dis) ;
			// animal.target.position.y = Math.tan(game.frameCount / 180) * (globe.size + dis) ;
			// animal.target.position.z = Math.sin(game.frameCount / 180) * (globe.size + dis) ;

			// animal.lookAt(animal.target.position);



			// console.log(animal.rotation);


			// animal.updateAnimation(1000*delta);
}