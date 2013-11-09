function Player(options){
	"use strict";

	var player = new THREE.Object3D();

	// Velocity vector
	player.velocity = new THREE.Vector3();

	player.distanceFromGlobe = options.distanceFromGlobe || 10;
	player.size = options.size || 10;
	player.name = "Player";
	player.animal = options.animal || "eagle";
	player.noFlapSound = options.noFlapSound || false;

	// Scale player
	player.scale.x = player.scale.y = player.scale.z = player.size / 10;

	morphColorsToFaceColors(playerModel.geometry);
	playerModel.geometry.computeMorphNormals();

	var material = new THREE.MeshLambertMaterial({
		color: 0xffffff,
		morphTargets: true,
		morphNormals: true,
		vertexColors: THREE.FaceColors,
		shading: THREE.FlatShading
	});

	player.animation = new THREE.MorphAnimMesh( playerModel.geometry, material );

	// Rotate the player to face forward relative to camera
	player.animation.applyMatrix(new THREE.Matrix4().makeRotationY(deg2rad(180)));

	player.castShadow = true;
	player.receiveShadow = true;

	player.add(player.animation);

	player.animation.duration = 1000;
	scene.add( player );

	player.animation.setAnimationLabel("eagle_fly", 0, 25);
	player.animation.setAnimationLabel("glide", 0, 1);

	player.glide = function(){
		if(player.gliding) return;
		else player.animation.playAnimation("glide", 0.8);
		player.gliding = true;
		player.flying = false;
	};
	player.fly = function(){
		if(player.flying) return;
		else{
			var current = player.animation.currentKeyframe;
			player.animation.playAnimation("eagle_fly", 15);
			player.animation.currentKeyframe = current;
		};
		player.flying = true;
		player.gliding = false;
	};


	var canFlap = true;
	var flapKey = 24;

	player.animate = function(){
		var delta = clock.getDelta();


		if(player.animation.currentKeyframe === flapKey && canFlap && !player.noFlapSound){
			sounds.wingFlap();
			canFlap = false;
		}
		if(player.animation.currentKeyframe === flapKey+1){
			canFlap = true;
		}


		player.animation.updateAnimation( 1000 * delta );
	}

	scene.add(player);


	function displayRectangle(){
		// Player velocity
		player.velocity = new THREE.Vector3();

		var figGeo = new THREE.CubeGeometry(player.size, player.size/2, player.size*2);
		var figMat = new THREE.MeshBasicMaterial({
			color: new THREE.Color().setHSL(0.9, 0.5, 0.4).getHex()
		});
		var player = new THREE.Mesh(figGeo, figMat);
		scene.add(player);
	}

	return player;
}

playerModel = {};
Player.loadPlayerModel = function(geometry, materials){
	playerModel.geometry = geometry;
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
