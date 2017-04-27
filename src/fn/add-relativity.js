export default function addRelativity(series, bounds) {
  series.forEach(s => {
    s.data.forEach(p => {
      p.rx = bounds.range.x ? (p.x - bounds.min.x) / bounds.range.x * 2 - 1 : 0
      p.ry = bounds.range.y ? (p.y - bounds.min.y) / bounds.range.y * 2 - 1 : 0
      p.rz = bounds.range.z ? (p.z - bounds.min.z) / bounds.range.z : 0
    })
  })
}
