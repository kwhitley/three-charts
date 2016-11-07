webpackHotUpdate(0,{

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

// styles
__webpack_require__(78);

// core libs
var THREE = __webpack_require__(79);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

var geometry = new THREE.BoxGeometry(1, 1, 1);

var materials = [new THREE.MeshBasicMaterial({ color: 0xffffff, shading: THREE.FlatShading, wireframe: true, transparent: true, overdraw: 0 }), new THREE.MeshPhongMaterial({ color: 0xffbb00, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0.5, overdraw: true })];
// // let cube = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
// // // cube.position.x = -400;

// // scene.add( cube );

// var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
// // var material = new THREE.MeshPhongMaterial({ color: 0xffbb00, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 })
// // var cube = new THREE.Mesh(geometry, material);
var cube = new THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
// scene.add(cube);

// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshPhongMaterial({color: 0xffbb00});
// var cube = new THREE.Mesh( geometry, material );
scene.add(cube);

// LIGHTS

// create a point light
var pointLight = new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

cube.rotation.x = -1.87;
cube.rotation.y = -45.87;
camera.position.z = 2;

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('app').appendChild(renderer.domElement);

function renderCycle() {
  requestAnimationFrame(renderCycle);

  // add some rotation!
  cube.rotation.x += 0.001;
  cube.rotation.y += 0.001;

  renderer.render(scene, camera);
}
renderCycle();

/***/ }

})
//# sourceMappingURL=0.ac956bbfd9da16ee1141.hot-update.js.map