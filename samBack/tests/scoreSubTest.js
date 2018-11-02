// Test all data used for getScores GraphQL endpoint
const scoreSubTest = function(techArray, winArray, nConversionRow, expect) {

  // Check Tech_Matrix column types
  describe("Check Tech Matrix Data", () => {
    it("should return non-null values", () => {
      techArray.forEach(i => {
        it('should return non-null values', () => {
          expect(i.n_percent_reduction_high).to.be.a('number')
          expect(i.n_percent_reduction_low).to.be.a('number')
          expect(i.ProjectCost_kg).to.be.a('number')
          expect(i.capFTE).to.be.a('number')
          expect(i.OMCost_kg).to.be.a('number')
          expect(i.omFTE).to.be.a('number')
          expect(i.Avg_Life_Cycle_Cost).to.be.a('number')
          expect(i.Useful_Life_Yrs).to.be.a('number')
          expect(i.NewCompat).to.be.a('number')
        })
      });
    });
  });

  // Check TBL_WIN column types
  describe("Check WIN Parcel Data", () => {
    it("should return non-null values", () => {
      winArray.forEach(i => {
        it('should return non-null values', () => {
          expect(i.TreatmentID).to.be.a('number')
          expect(i.EconDevType).to.be.a('string')
          expect(i.DensityCat).to.be.a('number')
          expect(i.BioMap2).to.be.a('number')
          expect(i.CWMP).to.be.a('number')
          expect(i.FLOWTHRUCOEF).to.be.a('number')
          expect(i.NewSLIRM).to.be.a('number')
          expect(i.Waterfront).to.be.a('number')
          expect(i.TotalAssessedValue).to.be.a('number')
        })
      });
    });
  });

  // Check TBL_NConversion_SQL column types
  describe("Check N_Conversion Data", () => {
    it("should return non-null values", () => {
      expect(nConversionRow.Slope).to.be.a('number')
      expect(nConversionRow.Intercept).to.be.a('number')
    });
  });
}

module.exports =  {
  scoreSubTest: scoreSubTest
}