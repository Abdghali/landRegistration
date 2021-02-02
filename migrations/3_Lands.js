var LandsApp = artifacts.require("./Lands.sol");

module.exports = function(deployer) {
  deployer.deploy(LandsApp);
};
