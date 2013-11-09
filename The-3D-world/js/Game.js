function Game(){
	"use strict";

	this.frameCount = 0;
	this.useCamera = true;

	this.start = function(){

		// displayFPS();
		enableTrackballControls(camera);

		window.globe = new Globe({
			size: 3000,
			// color:  new THREE.Color().setRGB(0.26, 0.47, 0.18).getHex(),
			color: 5864504,
			segments: 150,
			// wireframe: true
		});

		globe.createHightMap();

		globe.createTrees({
			size: 2,
			amount: 2000
		});

		// globe.createGrasses({
		// 	size: 1,
		// 	amount: 800
		// });

		window.player = new Player({
			size: 2,
			distanceFromGlobe: 20,
			// noFlapSound: true
		});

		sounds.music.volume = 0;
		sounds.forest.volume = 0;
		sounds.forest.volume = 0;

		// Hide player model
		// player.children[0].visible = false

		player.speed = {
			x: 2, y: 0.5, z: 0.0007,
			min: { x: 2, y: 1},
			max: { x: 20, y: 15}
		};

		// Place player on top of globe
		player.position.setY(globe.size + player.distanceFromGlobe);
		camera.position = player.position.clone();
		camera.position.z += 120;
		globe.rotation.x = deg2rad(90);

		// in debugging, increase view angle and camera position
		if(!this.useCamera){
			camera.position.setZ(globe.size*3);
			scene.fog.near = 20000;
			scene.fog.far = 20000;
			camera.far = 40000;
			camera.updateProjectionMatrix();
		}

		var light = new THREE.AmbientLight( 0xDDDDDD ); // white light
		scene.add( light );

		window.directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.6	 );
		directionalLight.position.set(0, globe.size + 1500, 0);
		directionalLight.lookAt(player.position);
		directionalLight.target = player;
		directionalLight.castShadow = true;
		directionalLight.shadowDarkness = 0.2;
		directionalLight.shadowCameraFar = 15000;
		directionalLight.shadowMapHeight = 2024;
		directionalLight.shadowMapWidth = 2024;

		scene.add( directionalLight );



		// var hex = 0xFFFFFF;
		// var intensity = 1;
		// var distance = 10;
		// var angle = deg2rad(-90);
		// var spotLight = new THREE.SpotLight(hex, intensity, distance, angle);
		// spotLight.position.set(0, globe.size + 100, 0);
		// spotLight.rotation.set( deg2rad(180),0,0);
		// spotLight.target = player;
		// spotLight.shadowCameraFov = 70;
		// scene.add(spotLight);
		// // spotLight.castShadow = true;


		this.loop();
	}

	this.loop = function(){
		requestAnimationFrame(this.loop.bind(this));
		// game.stats.begin();
		this.frameCount++;


		if(game.useCamera){
			updateFromEvents();
			updateCameraPosition();
			updateAnimations();
		}
		else{
			game.controls.update();
		}

		sounds.setSoundTransition(player.distanceFromGlobe / 900);

		renderer.render(scene, camera);
		// game.stats.end();
	}

	function updateFromEvents(){

		// If key pressed, simulate glove input
		var data = events.gloveData;
		if(events.isDown("left"))   data.z += 5;
		if(events.isDown("right"))  data.z -= 5;
		if(events.isDown("bottom"))    data.x += 2;
		if(events.isDown("top")) data.x -= 2;

		// Limit the rotations
		if(data.x > 90) data.x = 90;
		if(data.x < -90) data.x = -90;
		if(data.z > 90) data.z = 90;
		if(data.z < -90) data.z = -90;

		rotatePlayer(data);
	}

	function rotatePlayer(rotation){


		// Smooth out the rotation in a bezier curve

		var rotation = linearVector3({
			x:{
				from: player.rotation.x,
				to: deg2rad(rotation.x)
			},
			y:{
				from: player.rotation.y,
				to: deg2rad(rotation.y)
			},
			z:{
				from: player.rotation.z,
				to: deg2rad(rotation.z)
			},
			transition: 0.1
		});

		if(!player.overrideRotation)
			player.rotation.x = rotation.x;

		player.rotation.z = rotation.z;
		calculateVelocity(rotation);
		updatePlayerPosition();
		rotateGlobe(rotation);
	}

	function calculateVelocity(rotation){
		player.velocity.x = -rotation.z * 15;

		if(player.rotation.x < 0)
			player.velocity.y = rotation.x * 8;
		else
			player.velocity.y = rotation.x * 2;

		player.velocity.z = (1.5 + -rotation.x) /700;
		// player.velocity.z -= player.velocity.y / 3000;
	}

	function rotateGlobe(rotation){

		// globe y axis rotation is affected by player velocity.x
		var globeYRotation = player.velocity.x / 1000;
		globe.applyMatrix(new THREE.Matrix4().makeRotationY(globeYRotation));

		globe.rotation.x += player.velocity.z;

	}

	function updatePlayerPosition(){

		player.position.y += player.velocity.y;

		// Collions with ground
		if(player.position.y < globe.size + player.size * 10){
			player.position.y = globe.size + player.size * 10;
			player.velocity.y = 0;
			player.overrideRotation = true;
			player.rotation.x = ease(player.rotation.x, 0, 0.1);
		}
		else{
			player.overrideRotation = false;
		}

		// Collions with to high in the air
		if(player.position.y > globe.size*1.5){
			player.position.y = globe.size*1.5;
			player.velocity.y = 0;
		}

		player.distanceFromGlobe = player.position.y - globe.size;

		// Increase the view-distance relative to player distance from globe
		scene.fog.far = 1000 + (player.distanceFromGlobe * 1.5);
		scene.fog.near = scene.fog.far - 500;
		camera.far = scene.fog.far;
		camera.updateProjectionMatrix();

	}
	function updateCameraPosition(){

		// Transition the camera position to player position in a bezier curve
		var newY = ease(camera.position.y, player.position.y, 0.2);

		// Increase the hight of camera even more
		// relative to the player distance from globe
		camera.position.y = newY + (player.distanceFromGlobe / 100);
		camera.lookAt(player.position);
		camera.rotation.z = player.rotation.z * 0.6;

		var ac = game.quadratic(0, 0, 10, Math.abs(player.rotation.x/2));

		var zc = game.quadratic(-10,40, 60, player.velocity.z * 150);

		camera.position.z = 120 - zc;

		if(player.rotation.x < 0){
			camera.position.y += ac;
			// player.velocity.y += ac;
		}else{
			camera.position.y -= ac;
			// player.velocity.y -= ac;
		}

	}

	function updateAnimations(){

		// If player rotated to much to the sides, glide
		if(Math.abs(player.rotation.z) > 1){
			player.requestGlide = true;
		}

		// If player flying downwards, glide
		if(player.rotation.x < -0.5){
			player.requestGlide = true;
		}

		if(player.requestGlide){
			player.requestGlide = false;
			player.glide();
		}
		else{
			// if(player.rotation.x > 0.6){
			// 	// player.animation.duration = ease(player.animation.duration, 1667 - 1000, 0.05);
			// 	player.animation.duration = 1667 - 1000;
			// }
			// else{
			// 	// player.animation.duration = ease(player.animation.duration, 1667, 0.1);
			// 	player.animation.duration = 1667;
			// }

			if(player.animation.duration < 600) player.animation.duration = 600;

			player.fly();
		}

		player.animate();
	}

	this.quadratic = function (_v0, _v1, _v2, _t){

	  return Math.pow((1-_t), 2) * _v0 + (2*_t) * (1-_t) * _v1 + Math.pow(_t, 2) * _v2;
	}
}