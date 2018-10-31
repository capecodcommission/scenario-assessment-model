const summarySubTest = function(scenRow, townArray, treatArray, subArray, tmdlRow, expect) {
  
  describe("Check Scenario Data", () => {
    it("should return non-null values", () => {
      expect(scenRow.ScenarioID).to.be.a('number')
      expect(scenRow.Nload_Reduction_Fert).to.be.a('number')
      expect(scenRow.Nload_Reduction_SW).to.be.a('number')
      expect(scenRow.Nload_Reduction_Septic).to.be.a('number')
      expect(scenRow.Nload_Reduction_GW).to.be.a('number')
      expect(scenRow.Nload_Reduction_Attenuation).to.be.a('number')
      expect(scenRow.Nload_Reduction_InEmbay).to.be.a('number')
      expect(scenRow.Nload_Calculated_InEmbay).to.be.a('number')
      expect(scenRow.AreaID).to.be.a('number')
      expect(scenRow.AreaName).to.be.a('string')
    });
  });

  describe("Check Town Names", () => {
    it("should return non-null values", () => {
      townArray.forEach(i => {
        it('should return non-null value', () => {
          expect(i.TOWN).to.be.a('string')
        })
      });
    });
  });

  describe("Check Treatment Data", () => {
    it("should return non-null values", () => {
      treatArray.forEach(i => {
        it('should return non-null values', () => {
          expect(i.TreatmentID).to.be.a('number')
          expect(i.ScenarioID).to.be.a('number')
          expect(i.TreatmentType_ID).to.be.a('number')
          expect(i.TreatmentType_Name).to.be.a('string')
          expect(i.Nload_Reduction).to.be.a('number')
          expect(i.Treatment_Class).to.be.a('string')
          expect(i.Treatment_Parcels).to.be.a('number')
          expect(i.Custom_POLY).to.be.a('number')
          expect(i.POLY_STRING).to.be.an('object')
        })
      });
    });
  });

  describe("Check Submebayment Names", () => {
    it("should return non-null values", async () => {
      subArray.forEach(i => {
        it('should return non-null value', () => {
          expect(i.SUBEM_DISP).to.be.a('string')
        })
      });
    });
  });

  describe("Check TMDL", () => {
    it("should return non-null TMDL and TMDL <= 100", async () => {
      expect(tmdlRow.progress).to.be.a('number')
      expect(tmdlRow.progress).to.be.at.most(100)
    });
  });
}

module.exports =  {
  summarySubTest: summarySubTest
}