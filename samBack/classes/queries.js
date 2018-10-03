var {Scenario} = require('./Scenario')

getScenario = function({id}) {

  // Init new Scenario class
  var a = new Scenario(id)

  // Get data from scenario wiz
  return a.getScenarioData().then((i) => {

    // Fill relevant scenario properties with query results, initialize arrays
    a.createdBy = i.recordset[0].CreatedBy
    a.nReducAtt = i.recordset[0].Nload_Reduction_Attenuation
    a.nReducFert = i.recordset[0].Nload_Reduction_Fert
    a.nReducGW = i.recordset[0].Nload_Reduction_GW
    a.nReducInEmbay = i.recordset[0].Nload_Reduction_InEmbay
    a.nReducSeptic = i.recordset[0].Nload_Reduction_Septic
    a.nReducSW = i.recordset[0].Nload_Reduction_SW
    a.areaID = i.recordset[0].AreaID
    a.areaName = i.recordset[0].AreaName
    a.treatments = []
    a.typeIDArray = []
    a.techMatrixArray = []
    a.treatmentIDCustomArray = []
    a.subWatershedArray = []
    a.subWaterIDArray = []
    a.tblWinArray = []
    a.ftCoeffArray = []

    // Get data from Treatment Wiz
    return a.getTreatmentsData().then((j) => {

      // Loop through results of Treatment Wiz data, fill relevant arrays
      j.recordset.map((k) => {

        a.treatmentIDCustomArray.push(k.TreatmentID)
        a.typeIDArray.push(k.TreatmentType_ID)
        a.treatments.push(k)
      })

      // Get data from Tech Matrix
      return a.getTechMatrixData().then((k) => {
        
        // Loop through results from Tech Matrix data, fill relevant array
        k.recordset.map((l) => {
          a.techMatrixArray.push(l)
        })

        return a.getSubwatershedsData().then((m) => {

          m.recordset.map((n) => {
            a.subWaterIDArray.push(n.SUBWATER_ID)
            a.subWatershedArray.push({
              TreatmentID: n.TreatmentID,
              SUBWATER_ID: n.SUBWATER_ID
            })
          })

          return a.getWINData().then((o) => {

            o.recordset.map((p) => {
              a.tblWinArray.push(p)
            })

            return a.getFTCoeffData().then((q) => {

              q.recordset.map((r) => {
                a.ftCoeffArray.push(r)
              })

              return a
            })
          })
        })
      })
    })
  })
}

// mutation {
  //     createMessage(input:{
  //       author:"mario"
  //       content:"hello world!"
  //     }) {
  //       id
  //     }
  //   }
  // createMessage: function ({input}) {

  //   // Create a random id for our "database".
  //   var id = require('crypto').randomBytes(10).toString('hex');

  //   fakeDatabase[id] = input;
  //   return new Message(id, input);
  // },


  // mutation {
  //   updateMessage(id: "4458a8c8632e1f9bdee7", input: {content: "hello world! UPDATED"}) 
  //   {
  //     id
  //     author
  //     content
  //   }
  // }
  // updateMessage: function ({id,input}) {

  //   if (!fakeDatabase[id]) {

  //     throw new Error('no message exists with id ' + id);
  //   }

  //   // This replaces all old data, but some apps might want partial update.
  //   fakeDatabase[id].content = input.content
  //   return new Message(id, input);
  // }

module.exports = {
  
  getScenario: getScenario
}