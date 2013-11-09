"use strict";

// Download required files
requirejs([
	"lib/three.TrackballControls",
	"lib/socket.io",
	"lib/Stats",
	"helpers",
	"Sounds",
	"Game",
	"Globe",
	"Player",
	"Tree",
	"Animal",
	"Grass",
	"events"
	], setup)

function setup(){

	// Glove input from node.js
	var ip = "tvl-air.local";
	window.socket = io.connect('http://'+ip+':3000');
	window.socket.on('toGame', events.gloveInput);
	window.socket.on('connection', function(){
		console.log("Connected to server");
	})
	// Keyboard inputs
	window.addEventListener("keydown", events.keydown);
	window.addEventListener("keyup", events.keyup);

	// Update camera and render on window resize
	window.addEventListener("resize", onWindowResize);

	// Game
	window.game = new Game();
	game.width = window.innerWidth;
	game.height = window.innerHeight;
	game.backgroundColor = new THREE.Color().setHSL(0.5, 0.7, 0.9);

	// Scene
	window.scene = new THREE.Scene();

	// Camera
	var fov = 35;                       // Field of view
	var aspect = game.width/game.height // Aspect ratio
	var near = 1;                       // Camera frustum near plane
	var far = 1000;                     // Camera frustum far plane
	window.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

	// Fog
	var fog = new THREE.Fog(game.backgroundColor.getHex(), far - 500, far);
	scene.fog = fog;

	// Renderer
	var upscale = 1;
	window.renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(game.width/upscale, game.height/upscale); // Upscaling variable affects the renderer
	renderer.setClearColorHex(game.backgroundColor.getHex(), 1.0);
	// renderer.shadowMapEnabled = true;
	// renderer.shadowMapSoft = true;
	// renderer.shadowCameraNear = 1;
	// renderer.shadowCameraFar = camera.far;
	// renderer.shadowCameraFov = 35;
	// renderer.shadowMapBias = 0.0039;
	// renderer.shadowMapDarkness = 0.1;
	// renderer.shadowMapWidth = 1024;
	// renderer.shadowMapHeight = 1024;

	// Sounds
	window.sounds = new Sounds();

	// Clock - Used for animation loops etc.
	window.clock = new THREE.Clock();

	// Create canvas inside canvasContainer
	var container = document.querySelector(".canvasContainer");
	var canvasElement = renderer.domElement;
	container.appendChild(canvasElement);

	var qeue = 0;
	function loadModels(models){
		models.forEach(function(model){
			var loader = new THREE.JSONLoader();
			loader.onLoadStart = function(){ qeue++ };
			loader.load("js/models/"+ model.file +".js", model.callback);
			loader.onLoadComplete = function(){ qeue-- };
		})
	}

	// Import models and store them in their classes
	loadModels([
		{file: "TreeGeneric", callback: Tree.loadGeneric},
		{file: "TreeGenericLower", callback: Tree.loadGenericLower},
		{file: "eagle", callback: Player.loadPlayerModel},
		// {file: "butterfly_hiC", callback: Animal.loadButterfly_hiCModel},
		// {file: "butterfly_hiD", callback: Animal.loadButterfly_hiDModel},
		{file: "Grass01", callback: Grass.load1},
		{file: "Grass02", callback: Grass.load2},
		{file: "Grass03", callback: Grass.load3},
		{file: "Grass04", callback: Grass.load4},
		{file: "Grass05", callback: Grass.load5}
	]);

	var waitForModel = setInterval(function(){
		if(!qeue){
			clearInterval(waitForModel);
			game.start();
		}
	}, 300)
};

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function enableTrackballControls(camera){
	// Mouse control of camera in test development
	game.controls = new THREE.TrackballControls(camera);
	game.controls.rotateSpeed = 1.0;
	game.controls.zoomSpeed = 0.2;
	game.controls.panSpeed = 0.8;
	game.controls.noZoom = false;
	game.controls.noPan = false;
	game.controls.staticMoving = true;
	game.controls.dynamicDampingFactor = 0.3;
}

function displayFPS(){
	game.stats = new Stats();
	game.stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	game.stats.domElement.style.position = 'absolute';
	game.stats.domElement.style.left = '0px';
	game.stats.domElement.style.bottom = '0px';

	document.body.appendChild( game.stats.domElement );

}