require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require('truffle-hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Match any network id
        },
        matic: {
            provider: () => new HDWalletProvider(mnemonic, `https://testnet2.matic.network`),
            network_id: "*",
            gas: 0,
            confirmations: 2, // # of confs to wait between deployments. (default: 0)
            timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
            skipDryRun: true // Skip dry run before migrations? (default: false for public nets )
        }
    },
    contracts_directory: "./src/contracts/",
    contracts_build_directory: "./src/abis/",
    compilers: {
        solc: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
};
