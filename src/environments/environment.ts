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
  webSocketStatServer: "ws://localhost:3000/primus",
  externalBlockExplorer: "https://stats.fch.network/#/",
  // TODO: To be provided...
  predefinedTokens: [],
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
        ENSRegistry: "0x9DB8E0a507296edCCd3ba1eE9Fc1437caA052074",
        FixedPriceRegistrar: "0x8db5d1184ab75f08555f0aec7B73104a34F27E32",
        PublicResolver: "0xa131c557C05A3B31DA79090fd0f99da6361BE084"
      }
    },
    staking: {
      address: {
        Aerum: "0x74BE783894Dd616183b7045a79761661Ec97D26b",
        Governance: "0x073b2D2Cf8D31be73BDb0109dA05dA8C85BEa279"
      }
    },
    factory: {
      address: {
        TokenFactory: "0x4a61D1E631e663EaCafeb32a67B6A67C29F1FC3D"
      }
    },
    contractRegistry: {
      address: "0x75Bd4922F1811325fcACF8604a812B93C61F1953"
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
    derivationPath: "m/44'/60'/0'/0/0",
    laguage: "en",
    numberOfBlocks: 20
  },
  chainId: 4040,
  loglevel: LogLevel.All
};
