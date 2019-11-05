import { LogLevel } from "@app/core/general/logger-service/log-level.enum";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  isMobileBuild: true,
  configInUse: "environment.mobile.live",
  // TODO: To be provided... https://conf.fch.network/
  // externalConfig: "https://conf.aerum.net/",
  externalConfig: "",
  WebsocketProvider: "wss://gateway.fch.network/wss",
  rpcApiProvider: "https://gateway.fch.network/",
  // TODO: To be provided...
  aerumBit: "",
  cookiesDomain: "wallet.fch.network",
  externalBlockExplorer: "https://stats.fch.network/#/",
  predefinedTokens: ['0x13EE9f558bBaa42a1e3984451733bdd1640C6F3E'],
  contracts: {
    swap: {
      address: {
        AeroToErc20: "0x1D80d7984f842eC3271Ee8201c350122b964b192",
        Erc20ToAero: "0xb6bd94D15eD0496C0836cfA2A99CD0e86eC171bb",
        Erc20ToErc20: "0x4Acd9b68A3ff7c7e5B7810CbD5dDCfAeCEC4CCA2"
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
        swapExpireTimeoutInSeconds: 4 * 60 * 60
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
    endpoint: "https://mainnet.infura.io/",
    chainId: 1,
    explorerUrl: "https://etherscan.io/tx/"
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
  loglevel: LogLevel.All,
};
