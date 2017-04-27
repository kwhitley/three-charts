export default function getBounds(data = [], previousBounds) {
  // accepts array of x/y/z points
  const axes = ['x', 'y', 'z'];

  const bounds = previousBounds || {
    min: { x: Infinity, y: Infinity, z: Infinity },
    max: { x: -Infinity, y: -Infinity, z: -Infinity },
    range: {},
    median: {}
  }

  // determine min/max of each axis
  data.forEach(point => {
    axes.forEach(axis => {
      let value = point[axis]
      value = value !== undefined ? value : 0
      bounds.min[axis] = Math.min(bounds.min[axis], point[axis])
      bounds.max[axis] = Math.max(bounds.max[axis], point[axis])
    })
  })

  // calculate ranges
  axes.forEach(axis => {
    bounds.range[axis] = bounds.max[axis] - bounds.min[axis]
    bounds.median[axis] = bounds.min[axis] + (bounds.range[axis] / 2)
  })

  return bounds
}
