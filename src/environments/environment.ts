// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angularcli.json`.

export const environment = {
  production: false,
  configInUse: "environment.default",
  // WebsocketProvider: "ws://52.51.85.249:8546",
  WebsocketProvider: "ws://127.0.0.1:8546",
  cookiesDomain: "localhost",
  webSocketStatServer: "ws://localhost:3000/primus",
  externalBlockExplorer: "http://explore.aerum.net/#/",
  contracts: {
    swap: {
      address: {
        AeroToErc20: "0xb5b8a711e5abae1940e1b92ad45d4ec86215ce82",
        Erc20ToAero: "0x52ac5cf9c2823ea9891d347f94f74dfa8258db1c",
        Erc20ToErc20: "0xf0b36c5e2ab2e66e2c0baeaf5f2cfdfedbaf757a"
      },
      crossChain: {
        address: {
          aerum: {
            AeroSwap: "0xd7a2fdeedbb6495cdffa6d13f624c771de15a9ca",
            Erc20Swap: "0x709cebb3bc1d07747cbc84213af09be227ba2ace",
            TemplatesRegistry: "0x6ce0143a06476a3b1051df548cc096eb5ebb770e"
          },
          ethereum: {
            EtherSwap: "0x886cebd831af48f1bff5943605254037361c1d56",
            Erc20Swap: "0xef0aa2ffc51d039e073ebbb0de3c4b79ec98472c"
          }
        }
      }
    },
    aens: {
      address: {
        ENSRegistry: "0x49dc6ee5540eb3e0d8015ec2381ed4146315b6b6",
        FixedPriceRegistrar: "0xa942a9d2793cc12b35b7801cc0b60b72095f8553",
        PublicResolver: "0x125a0dd27bb49b38b1f023263ccfbf1757e603b7"
      }
    }
  },
  ethereum: {
    endpoint: "wss://rinkeby.infura.io/ws",
    chainId: 4
  },
  gasPrice: "1",
  maxBlockGas: "1",
  chainId: 418313827693
};
