const axios = require("axios").default;
const expect = require("chai").expect;

describe("First test", () => {
  it("Should assert true to be true", () => {
    expect(true).to.be.true;
  });
});

describe("api test", () => {
  it("Should have body ", () => {
    axios
      .get("http://localhost:9000/data2")
      .then((result) => {
        // console.log(result.data);
        expect(result.data).have.property("source");
      })
      .catch((err) => {});
  });

  // it("Should have fil this test ", () => {
  //   expect({ x: 1, z: 1 }).to.have.all.keys('x');
  // });
});
