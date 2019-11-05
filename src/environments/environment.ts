import { LogLevel } from "@app/core/general/logger-service/log-level.enum";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angularcli.json`.
export const environment = {
  production: false,
  isMobileBuild: false,
  configInUse: "environment.local",
  externalConfig: "http://localhost:3000/",
  WebsocketProvider: "wss://gateway.fch.network/wss",
  rpcApiProvider: "https://gateway.fch.network/",
  // TODO: To be provided...
  aerumBit: "",
  cookiesDomain: "localhost",
  externalBlockExplorer: "https://stats.fch.network/#/",
  predefinedTokens: ['0xFFD267230c3FB89889FA6a0de55b7C6751bDD461'],
  contracts: {
    swap: {
      address: {
        AeroToErc20: "0xa4E12D96faEB7b34A301a817d5A7BeEf824471ea",
        Erc20ToAero: "0xC376141bCE40020B672c0ee94233CC347ad321cb",
        Erc20ToErc20: "0x5Ee81732Ef5567342FbBC40306250Df5884944c4"
      },
      // TODO: To be provided...
      crossChain: {
        address: {
          aerum: {
            OpenAeroSwap: "",
            OpenErc20Swap: "",
            CounterAeroSwap: "",
            CounterErc20Swap: "",
            TemplatesRegistry: ""
          },
          ethereum: {
            OpenEtherSwap: "",
            OpenErc20Swap: "",
            CounterEtherSwap: "",
            CounterErc20Swap: ""
          }
        },
        swapExpireTimeoutInSeconds: 10 * 60
      }
    },
    aens: {
      address: {
        ENSRegistry: "0x4a61D1E631e663EaCafeb32a67B6A67C29F1FC3D",
        FixedPriceRegistrar: "0xc156a39301132Ba03CA56197741E459c5D67d4cd",
        PublicResolver: "0x75Bd4922F1811325fcACF8604a812B93C61F1953"
      }
    },
    staking: {
      address: {
        Aerum: "0x8f7e51d7487ebdcb9d729079074d8778e06c280a",
        Governance: "0xe2b151d2eF8d7D3058E44b6481B06F71d38253c9"
      }
    },
    factory: {
      address: {
        TokenFactory: "0x6bA3F4791Ee49197ffFdf83f8004467B8b6B9194"
      }
    },
    contractRegistry: {
      address: "0xa4E12D96faEB7b34A301a817d5A7BeEf824471ea"
    }
  },
  ethereum: {
    endpoint: "https://rinkeby.infura.io/",
    chainId: 4,
    explorerUrl: "https://rinkeby.etherscan.io/tx/"
  },
  settings: {
    settingsExpiration: 3650,
    gasPrice: "1",
    maxTransactionGas: "4000000",
    lastTransactionsNumber: "10",
    maxBlockGas: "1",
    derivationPath: "m/44'/4040'/0'/0/0",
    language: "en",
    numberOfBlocks: 20
  },
  chainId: 4040,
  loglevel: LogLevel.All
};
