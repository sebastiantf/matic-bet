import React, { Component } from "react";
import logo from "../logo.png";
import BetAbi from "../abis/Bet";
import "./App.css";
import Web3 from "web3";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            betContract: null,
            playerEthId: null,
            winnerEthId: null
        };
    }
    async componentWillMount() {
        await this.loadWeb3();
        await this.loadAccount();
        await this.loadContract();
    }
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            alert("Please install MetaMask!");
        }
    }

    async loadAccount() {
        const web3 = window.web3;
        // Load Account
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        // console.log(this.state.account);
    }

    async loadContract() {
        const web3 = window.web3;
        // Load Meme Smart Contract
        // Use web3.eth.Contract to fetch the contract. It requires the abi and contractAddress as parameters
        // abi and contractAddress can be fetched from the abi json. It is imported as MemeAbi from "../abis/Meme"
        // abi and contractAddress need to be fetched from the correct network where the contract is deployed
        // network id is fetched using web3.eth.net.getId()
        console.log("Fetching smart contract..");
        const networkId = await web3.eth.net.getId();
        const networkData = BetAbi.networks[networkId];
        if (networkData) {
            const abi = BetAbi.abi;
            const contractAddress = networkData.address;
            console.log("Meme Contract address: ", contractAddress);
            const betContract = await web3.eth.Contract(abi, contractAddress);
            console.log("Smart Contract fetched.");
            this.setState({ betContract});
            // console.log(this.state.betContract);
        } else {
            alert("Smart Contract not deployed to the detected network!");
        }
    }

    betFor = event => {
        event.preventDefault();
        const playerEthId = document.getElementById("playerEthId").value;
        const betContract = this.state.betContract;
        betContract.methods.betFor(playerEthId, 200).send({ from: this.state.account }, r => {
            console.log("Betted");
            this.setState({ playerEthId });
        });
    }

    betAgainst = event => {
        event.preventDefault();
        const playerEthId = document.getElementById("playerEthId").value;
        const betContract = this.state.betContract;
        betContract.methods.betAgainst(playerEthId, 200).send({ from: this.state.account }, r => {
            console.log("Betted");
            this.setState({ playerEthId });
        });
    }

    getBettersFor = async event => {
        event.preventDefault();
        const winnerEthId = document.getElementById("winnerEthId").value;
        const betContract = this.state.betContract;
        const bettersFor = await betContract.methods.getBettersFor(winnerEthId).call();
        console.log("bettersFor:", bettersFor);
    };

    getBettersAgainst = async event => {
        event.preventDefault();
        const winnerEthId = document.getElementById("winnerEthId").value;
        const betContract = this.state.betContract;
        const bettersAgainst = await betContract.methods.getBettersAgainst(winnerEthId).call();
        console.log("bettersAgainst:", bettersAgainst);
    };


    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#" target="_blank" rel="noopener noreferrer">
                        AxieBets
                    </a>
                    <ul className="navbar-nav px-2">
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="text-white">Your wallet: {this.state.account}</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <img src={logo} className="App-logo" alt="logo" />
                                </a>
                                <p>Enter ETH address to bet on:</p>
                                <form onSubmit={this.betFor}>
                                    <input type="text" id="playerEthId" />

                                    <label className="btn btn-primary">
                                        Bet For <input type="submit" hidden />
                                    </label>
                                </form>

                                <form onSubmit={this.betAgainst}>
                                    <input type="text" id="playerEthId" />

                                    <label className="btn btn-primary">
                                        Bet Against <input type="submit" hidden />
                                    </label>
                                </form>

                                <form onSubmit={this.getBettersFor}>
                                    <input type="text" id="winnerEthId" />

                                    <label className="btn btn-primary">
                                        Get BettersFor <input type="submit" hidden />
                                    </label>
                                </form>

                                <form onSubmit={this.getBettersAgainst}>
                                    <input type="text" id="winnerEthId" />

                                    <label className="btn btn-primary">
                                        Get BettersAgainst <input type="submit" hidden />
                                    </label>
                                </form>

                                <p>Betted On: {this.state.playerEthId}</p>
                                <p>Winner: {this.state.winnerEthId}</p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
