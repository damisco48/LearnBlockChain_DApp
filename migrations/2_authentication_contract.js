const AuthenticationContract = artifacts.require("AuthenticationContract");

module.exports = function(deployer){
    deployer.deploy(AuthenticationContract);
};