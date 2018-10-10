setPercentiles = function(techMatrix, technologies, nReducTotal) {

  // Generate percentiles
  // Only needs to be calculated once
  var capArray = [];
  var omArray = [];
  var lcArray = [];
  var perfArray = [];
  var yearsArray = [];
  var jobsArray = [];
  var arrays = []
  var tPerfHigh = 0
  var tPerfLow = 0
  var delta = 0
  var job = 0
  var kd = []
  var percentiles = []

  techMatrix.recordset.map((i) => {

    var techRow = technologies.recordset.find((j) => {return j.technology_id === i.Technology_ID})

    // Get percent reduction properties from technologies table
    tPerfHigh = techRow.n_percent_reduction_high
    tPerfLow = techRow.n_percent_reduction_low
    delta = tPerfHigh - tPerfLow

    job = ((i.ProjectCost_kg * nReducTotal * i.capFTE) + (i.OMCost_kg * nReducTotal * i.omFTE)) / 1000000

    capArray.push(i.ProjectCost_kg)
    omArray.push(i.OMCost_kg)
    lcArray.push(i.Avg_Life_Cycle_Cost)
    perfArray.push(delta)
    yearsArray.push(i.Useful_Life_Yrs)
    jobsArray.push(job)
  })

  arrays = [capArray, omArray, lcArray, perfArray, yearsArray, jobsArray]

  for (var i = 10; i <= 100; i+=10) { 
    
    var n = ((i/100) * capArray.length).toFixed(1)
    var nString = n.toString()
    var nExplode = nString.split('.')
    var k = parseFloat(nExplode[0])
    var d = parseFloat(nExplode[1])

    kd.push([i,k,d])
  } 

  arrays.map((i) => {

    i.sort((a,b) => {return a - b})
    
    var thesePcts = []

    kd.map((j) => {

      var k = j[1]
      var d = j[2]
      var vp = i[k - 1] + d * i[k - 1]

      thesePcts.push(vp)
    })

    percentiles.push(thesePcts)
  })

  return percentiles
}

module.exports = {
  
  setPercentiles: setPercentiles
}