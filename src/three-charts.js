import getBoundsFromSeries from './fn/get-bounds'
import dataFromArrays from './fn/data-from-arrays'

const threeChart = window.threeChart = () => {
  const data = []
  const series = []

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

  const getBounds = (name) => {
    if (name) {
      return getBoundsFromSeries(getSeries(name).data)
    } else {
      return getAllSeries().reduce((bounds, s) => getBoundsFromSeries(s.data, bounds), null)
    }
  }

  return {
    addData,
    addSeries,
    getAllSeries,
    getBounds,
    getData,
    getSeries
  }
}

export default threeChart
