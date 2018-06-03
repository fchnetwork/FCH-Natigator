// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  configInUse: "environment.local",
  WebsocketProvider: "ws://52.51.85.249:8546",
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
            AeroSwap: "0x0bda3dbaae4faad9e832829557d20321c7309d96",
            Erc20Swap: "0x6a69122b61f094a574ff21c81b5486fc55a4abc9",
            TemplatesRegistry: "0x3f5edd8ff0437a87f5ec9992c2722e75f227c8f4"
          },
          ethereum: {
            EtherSwap: "0x29269e39b166744a67aebf9b7a4c8a23acc87c46",
            Erc20Swap: "0xf43dec38ee501964ce7412612a5665fc8f626b50"
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
  gasPrice: "1",
  maxBlockGas: "1",
  chainId: 418313827693
};
