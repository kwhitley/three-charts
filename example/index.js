// styles
require('./styles/app.scss')

// const wellData = require('./data/wells.js')
import wellData from './data/wells-california.js'

import threeCharts from '../src/three-charts'

// console.log('wellData', wellData, Object.keys(wellData).length)

window.threeCharts = threeCharts

const myChart = window.myChart = threeCharts({
  backgroundColor: 0xffffff
})

myChart
  .addSeries({
    name: 'oil_eur',
    color: 0x00aa00,
    data: Object.keys(wellData).map(wUID => {
      let well = wellData[wUID]
      // console.log('well', wUID, well)
      return {
        x: well.spud_date,
        y: well.oil_eur,
        z: 0
      }
    })
  })
  .addSeries({
    name: 'gas_eur',
    color: 0xee8888,
    data: Object.keys(wellData).map(wUID => {
      let well = wellData[wUID]
      // console.log('well', wUID, well)
      return {
        x: well.spud_date,
        y: well.gas_eur,
        z: 0
      }
    }),
  })
  .addSeries({
    name: 'gas_pdp',
    color: 0xffaaaa,
    data: Object.keys(wellData).map(wUID => {
      let well = wellData[wUID]
      // console.log('well', wUID, well)
      return {
        x: well.spud_date,
        y: well.gas_pdp,
        z: 0
      }
    }),
  })
  .addSeries({
    name: 'oil_pdp',
    color: 0x00dd00,
    data: Object.keys(wellData).map(wUID => {
      let well = wellData[wUID]
      // console.log('well', wUID, well)
      return {
        x: well.spud_date,
        y: well.oil_pdp,
        z: 0
      }
    }),
  })
  .bindToElement(document.getElementById('chart'))
  .generateScatterPlot()
  .render()

/*

import threeCharts from 'three-charts'
var myChart = threeCharts.createChart('scatter', config)

myChart
  .getPoints() --> for animations
  .addData(data)
  .addAxis({ name: 'Oil Volume [MBPD]', axis: 'x' })
  .addSeries({ name, color, data }) --> color can be function
  .removeSeries(id)
  .setType('scatter')
  .setConfig(cfg)
  .compose(...behaviors)
  .addStyle(type, fn) (e.g. 'color', p => p.z > 100 ? 'red' : 'grey')
  .camera
  .scene



*/


function createAGrid(opts) {
  var config = opts || {
    height: 500,
    width: 500,
    linesHeight: 10,
    linesWidth: 10,
    color: 0xDD006C
  };

  var material = new THREE.LineBasicMaterial({
    color: config.color,
    opacity: 0.2
  });

  var gridObject = new THREE.Object3D(),
    gridGeo = new THREE.Geometry(),
    stepw = 2 * config.width / config.linesWidth,
    steph = 2 * config.height / config.linesHeight;

  //width
  for (var i = -config.width; i <= config.width; i += stepw) {
    gridGeo.vertices.push(new THREE.Vector3(-config.height, i, 0));
    gridGeo.vertices.push(new THREE.Vector3(config.height, i, 0));
  }

  //height
  for (var i = -config.height; i <= config.height; i += steph) {
    gridGeo.vertices.push(new THREE.Vector3(i, -config.width, 0));
    gridGeo.vertices.push(new THREE.Vector3(i, config.width, 0));
  }

  var line = new THREE.Line(gridGeo, material, THREE.LinePieces);
  gridObject.add(line);

  return gridObject;
}


// generateGridGeometry(p0, p2, segments) {

// }


// core libs
var THREE = require('three')

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

scene.background = new THREE.Color(0xffffff);

var geometry = new THREE.BoxGeometry(100, 100, 100);

var material = new THREE.MeshPhongMaterial( { color: 0xffbb00, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0.5 } )
var cube = new THREE.Mesh( geometry, material )

scene.add(cube);

var eGeometry = new THREE.EdgesGeometry( geometry );
var eMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
var edges = new THREE.LineSegments( eGeometry, eMaterial );
cube.add(edges);

scene.add(createAGrid({
  height: 500,
  width: 500,
  linesHeight: 50,
  linesWidth: 50,
  color: 0xdddddd
}))

// LIGHTS

// create a point light
var pointLight = new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

cube.position.x = 200;
cube.rotation.x = -45.87;
cube.rotation.y = -45.87;
camera.position.z = 1000000;

var el = window.el = document.getElementById('chart')

renderer.setSize( el.offsetWidth, el.offsetHeight );

// el.appendChild(renderer.domElement)

function renderCycle() {
  requestAnimationFrame(renderCycle);

  // add some rotation!
  cube.rotation.x += 0.002;
  cube.rotation.y += 0.001;

  renderer.render(scene, camera);
}
renderCycle();
