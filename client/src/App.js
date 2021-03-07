import React, { Component } from "react";
import LandsContract from "./contracts/Lands.json";
import getWeb3 from "./getWeb3";
import bootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ipfs from './ipfs';
import "./App.css";
import parse from 'html-react-parser';

class App extends Component {
  state = {
    imageHash: 'QmNeEf6kNKbbKvAgSrYoui1GTkyciGJJG5Ke6Px3EzGn58',
    buffer: null,
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    asset_html: '',
    owners_html: ''
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();


      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LandsContract.networks[networkId];
      const instance = new web3.eth.Contract(
        LandsContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.displayAssets);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  registerLand = async (event) => {

    event.preventDefault();
    const { accounts, contract } = this.state;

    console.log("form submitted");


    ipfs.add(this.state.buffer, async (error, resutls) => {
      console.log('ipfs results', resutls);
      const temp = resutls[0].hash;

      //contract.methods.addContract(this.state.contractid, temp, this.state.contractOwnerName, this.state.contractType, this.state.contractdesc, this.state.contractstartdate,this.state.contractenddate,this.state.municipalities).send({ from: accounts[0] });

      await contract.methods.registerLand(
        accounts[0],
        this.state.city,
        this.state.town,
        this.state.trough,
        this.state.part,
        temp
      ).send({ from: accounts[0] });

      if (error) {

        console.log(error);
      }
    });

    //code for calling blockchain contract to save date.

  }
  captureFile = (event) => {

    event.preventDefault();

    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      console.log("buffer", Buffer(reader.result));
      this.setState({ buffer: Buffer(reader.result) })
    }

  }

  captureInputChange = async (event) => {

    let nam = event.target.name;
    let val = event.target.value;

    console.log("field name: " + nam);
    console.log("field value: " + val);

    this.setState({
      [nam]: val
    });


  }
  transferOwnerShip = async (event) => {
    const { accounts, contract } = this.state;
    console.log(this.state.owners);
    await contract.methods.moveOwnerShip(accounts[0], this.state.owners).send({ from: accounts[0] });


  }

  displayAssets = async () => {
    const { accounts, contract } = this.state;

    const res = await contract.methods.getContractByAddress(accounts[0]).call();
    console.log(res);
    let assetHTML = '<tr><td>' + res[0] + '</td><td>'
      + res[1] + '</td><td>'
      + res[2] + '</td><td>'
      + res[3] + '</td><td>'
      + res[4] + '</td><td><img src="https://ipfs.infura-ipfs.io/ipfs/'
      + res[5] + '"</td></tr>';
    let ownerListHTML = '';
    for (let i = 0; i < 4; i++) {
      const ownerList = await contract.methods.landsOwners(i).call();
      console.log(ownerList);
      ownerListHTML = ownerListHTML + '<option value="' + ownerList[1] + '">' + ownerList[2] + '</option>'
    }
    this.setState({ owners_html: ownerListHTML, asset_html: assetHTML });



  };

  render() {
    
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>Welcome to the LAST UseCase About Land Registration and Ownership!</h1>
              <form onSubmit={this.registerLand}>
                <label htmlFor="city">Land City</label>
                <select className="form-control" name="city" onChange={this.captureInputChange} >
                  <option value="1">Khan Younes</option>
                  <option value="2">Deir Al Balah</option>
                  <option value="3">Gaza</option>
                  <option value="4">Rafah</option>
                  <option value="5">Jenin</option>
                  <option value="6">Nablus</option>
                  <option value="7">Jerusalem</option>
                  <option value="8">Haifa</option>
                  <option value="9">Acre</option>
                </select>
                <label htmlFor="town">Land Town</label>
                <input className="form-control" name="town" placeholder="Land Town" onChange={this.captureInputChange} ></input>

                <label htmlFor="trough">Land trough</label>
                <input className="form-control" name="trough" placeholder="Land Trough" onChange={this.captureInputChange}  ></input>

                <label htmlFor="part">Land Part</label>
                <input className="form-control" name="part" placeholder="Land Part" onChange={this.captureInputChange}  ></input>

                <label htmlFor="contractimage">Contract Image</label>
                <input type="file" className="form-control" name="contractimage" placeholder="Contract Image" onChange={this.captureFile}  ></input>

                <input type="submit" className="form-control btn btn-primary" ></input>

              </form>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <table className="table">
                <thead>
                  <tr>
                    <td>Owner Address</td>
                    <td>City</td>
                    <td>Town</td>
                    <td>Trough</td>
                    <td>Part</td>
                    <td>Contract Image</td>

                  </tr>
                </thead>
                <tbody>
                  {parse(this.state.asset_html)}
                </tbody>
              </table>



            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <label htmlFor="owners">Land Owners</label>
              <select className="form-control" name="owners" onChange={this.captureInputChange} >
                {parse(this.state.owners_html)}
              </select>

              <button className="btn btn-primary" onClick={this.transferOwnerShip}>TransferOwnership</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
