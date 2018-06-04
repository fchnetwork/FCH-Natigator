import { Injectable } from '@angular/core';
import Web3 from "web3";

@Injectable()
export class EthereumAuthenticationService {

  private readonly web3: Web3;

  constructor() {
    const rinkebyAddress = "wss://rinkeby.infura.io/ws";
    let provider = new Web3.providers.WebsocketProvider(rinkebyAddress);
    this.web3 = new Web3(provider);

    provider.on('error', () => console.log('WS Error'));
    provider.on('end', () => {
      console.log('WS closed');
      console.log('Attempting to reconnect...');
      provider = new Web3.providers.WebsocketProvider(rinkebyAddress);

      provider.on('connect', () => {
        console.log('WSS Reconnected');
      });

      this.web3.setProvider(provider);
    });
  }

  getWeb3(): Web3 {
    return this.web3;
  }
}
