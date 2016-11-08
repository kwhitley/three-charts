// remaps { x: [1,2,3], y: [2,4], z: [0] } to array of points

export default function dataFromArrays(data = {}) {
  if (!data.x && !data.y && !data.z) {
    throw TypeError('data conversion failure: data lacks x, y, or z attributes')
  }

  const axes = ['x', 'y', 'z'];

  data = axes.reduce((remapped, axis) => {
    let axisData = data[axis]
    if (axisData) {
      axisData.forEach((value, index) => {
        remapped[index] = remapped[index] || {}
        remapped[index][axis] = value
      })
    }

    return remapped
  }, [])

  // fill undefined attributes with 0
  data.map(point => {
    axes.forEach(axis => {
      if (point[axis] === undefined) {
        point[axis] = 0
      }
    })
  })

  return data
}
