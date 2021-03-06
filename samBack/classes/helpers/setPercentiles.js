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

    // $delta = $row->PctRemoval_high-$row->PctRemoval_low;
    delta = tPerfHigh - tPerfLow

    // $job = (($row->ProjectCost_kg*$totalNreduc*$row->capFTE) + ($row->OMCost_kg*$totalNreduc*$row->omFTE))/1000000;
    job = ((i.ProjectCost_kg * nReducTotal * i.capFTE) + (i.OMCost_kg * nReducTotal * i.omFTE)) / 1000000

    capArray.push(i.ProjectCost_kg)
    omArray.push(i.OMCost_kg)
    lcArray.push(i.Avg_Life_Cycle_Cost)
    perfArray.push(delta)
    yearsArray.push(i.Useful_Life_Yrs)
    jobsArray.push(job)
  })

  arrays = [capArray, omArray, lcArray, perfArray, yearsArray, jobsArray]

  // for ($i=10;$i<=101;$i+=10){
  for (var i = 10; i <= 100; i+=10) { 
    
    // $n = ($i/100)*(count($capArray)-1)+1;
    var n = ((i/100) * capArray.length).toFixed(1)
    var nString = n.toString()

    // $n_explode = explode(".",strval($n));
    var nExplode = nString.split('.')
    var k = parseFloat(nExplode[0])

    // $d = intval($n_explode[1])/10;
    var d = parseFloat(nExplode[1]) / 10

    // array_push($k_d,[$i,$k,$d]);
    kd.push([i,k,d])
  } 

  // for ($a = 0;$a<count($arrays);++$a){
  arrays.map((i) => {

    // $sort = sort($this_array);
    i.sort((a,b) => {return a - b})
    
    var thesePcts = []

    // for ($b=0;$b<count($k_d);++$b){
    kd.map((j) => {

      // $k = intval($k_d[$b][1]);
      var k = j[1]

      // $d = $k_d[$b][2];
      var d = j[2]

      // $vp = $this_array[$k-1]+$d*($this_array[$k]-$this_array[$k-1]); //k-1 because of array indexing
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