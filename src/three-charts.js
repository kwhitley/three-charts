import getBoundsFromSeries from './fn/get-bounds'
import dataFromArrays from './fn/data-from-arrays'
import addRelativity from './fn/add-relativity'

const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)

const threeChart = window.threeChart = (opt) => {
  const data = []
  const series = []
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  let scene = new THREE.Scene()
  let camera = window.camera = undefined

  let parentElement = undefined

  let options = Object.assign({
    backgroundColor: 0xffffff
  }, opt)

  // initialize
  setBackgroundColor(options.backgroundColor)

  function addCaption(text) {
    this.caption = text

    return this
  }

  function setBackgroundColor(color) {
    scene.background = new THREE.Color(color)
  }

  function addData(newData) {
    data.concat(newData)

    return this
  }

  function addSeries(s = {}) {
    if (!s.name) {
      throw TypeError('no series name defined when adding a new series')
    }

    if (!s.data || ['object','array'].indexOf(typeof s.data) === -1) {
      throw TypeError('no data defined when adding a new series')
    }

    if (!s.data.length) {
      s.data = dataFromArrays(s.data)
    }

    series.push(s)

    return this
  }

  function getSeries(name) {
    return series.find(s => s.name === name)
  }

  function getAllSeries() {
    return series
  }

  function getData() {
    return data
  }

  function getPoints() {
    return getAllSeries().reduce((points, series) => points.concat(series.data), [])
  }

  function getBounds(name) {
    if (name) {
      return getBoundsFromSeries(getSeries(name).data)
    } else {
      return getAllSeries().reduce((bounds, s) => getBoundsFromSeries(s.data, bounds), null)
    }
  }

  function bindToElement(el) {
    parentElement = el
    el.appendChild(renderer.domElement)

    return this.reflow()
  }

  function reflow() {
    renderer.setSize(parentElement.offsetWidth, parentElement.offsetHeight)

    return this
  }

  function generateScatterPlot() {
    // var eGeometry = new THREE.EdgesGeometry( geometry );
    // var eMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
    // var edges = new THREE.LineSegments( eGeometry, eMaterial );

    window.camera = camera = new THREE.PerspectiveCamera(5, parentElement.offsetWidth / parentElement.offsetHeight, 0.1, 100000)
    var pointLight = new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 0;
    pointLight.position.y = 0;
    pointLight.position.z = 100;

    scene.add(pointLight);

    // cube.add(edges);

    addRelativity(getAllSeries(), getBounds())

    getAllSeries().forEach((series, seriesIndex) => {
      // console.log('series', series)
      var material = new THREE.MeshPhongMaterial({
        color: series.color || 0xffbb00,
        shading: THREE.FlatShading,
        // transparent: true,
        // opacity: 0.5,
        shininess: 0
      })

      var seriesGeometry = new THREE.Geometry();
      var seriesMaterial = new THREE.ParticleBasicMaterial({
        color: series.color || 0xffbb00,
        size: 15
      });


      series.data.forEach(p => {
        // CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)
        seriesGeometry.vertices.push(new THREE.Vector3(
          p.rx, p.ry, seriesIndex * 0.1
        ))

        // for (var i=0; i < 100; i++) {
        //   particle_system_geometry.vertices.push(new THREE.Vector3D(x, y, z));
        // }
        // var particle_system_material = new THREE.ParticleBasicMaterial({
        //   color: 0xffffff,
        //   size: 1
        // });

        // var geometry = new THREE.CylinderGeometry(0.015, 0.015, 0, 4);
        // var point = new THREE.Mesh(geometry, material)

        // point.position.x = p.rx
        // point.position.y = p.ry
        // point.position.z = seriesIndex * 0.1
        // point.rotation.x = 90

        // scene.add(point)
      })

      var seriesPoints = new THREE.Points(
        seriesGeometry,
        seriesMaterial
      );

      scene.add(seriesPoints)
    })

    let bounds = getBounds()

    var material = new THREE.MeshPhongMaterial( { color: 0xaa0000, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 })
    var geometry = new THREE.BoxGeometry(bounds.range.x, bounds.range.y, 0);
    var boundsObject = new THREE.Mesh(geometry, material)

    boundsObject.position.set(
      bounds.median.x,
      bounds.median.y,
      -100
    )
    // scene.add(boundsObject)

    console.log('bounds', bounds)

    // camera.position.x = bounds.median.x
    // camera.position.y = bounds.median.y
    camera.position.z = 1000;
    camera.position.y = -100
    camera.fov = 0.15
    camera.updateProjectionMatrix()

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false
    // controls.damping = 0.2;
    // controls.addEventListener( 'change', render );

    // camera.far = 1000000

    // var vFOVRadians = 2 * Math.atan(parentElement.offsetHeight / ( 2 * depth ) ),
    //     fov = vFOVRadians * 180 / Math.PI;
    // camera.fov = fov;
    // camera.updateProjectionMatrix()
    // console.log(vFOVRadians, fov)

    // camera.position.z = 10000000;
    // camera.far = 1000000;
    // camera.updateProjectionMatrix();

    // scene.add(createAGrid({
    //   height: 500,
    //   width: 500,
    //   linesHeight: 50,
    //   linesWidth: 50,
    //   color: 0xdddddd
    // }))

    return this
  }

  function render() {
    requestAnimationFrame(render);

    // // let canvas = renderer.domElement

    // // console.log('canvas resize', canvas.width, canvas.clientWidth)

    // if (canvas.width !== parentElement.clientWidth || canvas.height !== parentElement.clientHeight) {
    //   renderer.setSize(parentElement.clientWidth, parentElement.clientHeight, false);
    //   camera.aspect = parentElement.clientWidth / parentElement.clientHeight;
    //   camera.updateProjectionMatrix();
    //   console.log('canvas resize', canvas.width, canvas.clientWidth, parentElement.clientWidth, parentElement.offsetWidth)
    // }

    // box.position.set(-1 + 2 * left, 1 - 2 * top, depth).unproject(camera);
    // box.rotation.y += clock.getDelta() * 2 * Math.PI / period;

    renderer.render(scene, camera)

    // console.log('bounds', getBounds())
    // console.log('camera position', camera.position)
  }

  return {
    THREE,
    camera,
    scene,
    renderer,
    addCaption,
    addData,
    addSeries,
    bindToElement,
    generateScatterPlot,
    getAllSeries,
    getBounds,
    getData,
    getPoints,
    getSeries,
    parentElement,
    reflow,
    render,
    setBackgroundColor
  }
}

export default threeChart
