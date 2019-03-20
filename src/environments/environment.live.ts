import { LogLevel } from "@app/core/general/logger-service/log-level.enum";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  isMobileBuild: false,
  configInUse: "environment.live",
  externalConfig: "https://conf.aerum.net/",
  WebsocketProvider: "wss://main-gw-500.aerum.net/wss",
  rpcApiProvider: "https://main-gw-500.aerum.net",
  aerumBit: "",
  cookiesDomain: "wallet.aerum.net",
  webSocketStatServer: "ws://localhost:3000/primus",
  externalBlockExplorer: "https://explore.aerum.net/#/",
  predefinedTokens: ['0x2274630e6bf220fc09cfb5253c6ff9759abb8578'],
  contracts: {
    swap: {
      address: {
        AeroToErc20: "0xb5c1c46b9b61f8adbd1b4a407db8d0c93948d5e1",
        Erc20ToAero: "0x02145c31e3bc16dae4cba31a2c812ce9de9bfffd",
        Erc20ToErc20: "0x5b01d4546af542820ac253876e52dc8853fac75b"
      },
      crossChain: {
        address: {
          aerum: {
            OpenAeroSwap: "0x3d8878932485c83df67758b6739321534fee61f0",
            OpenErc20Swap: "0x3a95e495081271cc45772054c481f1d2f3f14797",
            CounterAeroSwap: "0xa7555fe3350ad5236027ea1cbc97dbae33967759",
            CounterErc20Swap: "0x3a64689e2c4be2e65a031cbf2505a91075079df2",
            TemplatesRegistry: "0x5e3f8c9554ca04b82c83f36bc2c34758c8712eeb"
          },
          ethereum: {
            OpenEtherSwap: "0x2abe1b7547d80e549cbe7a44226470966aeef253",
            OpenErc20Swap: "0x3094b0d1f000aae7e1d83b3d12527271586924eb",
            CounterEtherSwap: "0xdbf8dfded1cb047f1d8b43a9a3662cb42859e7bd",
            CounterErc20Swap: "0x234237642c428994e500569581febc7c60fe6709"
          }
        },
        swapExpireTimeoutInSeconds: 4 * 60 * 60
      }
    },
    aens: {
      address: {
        ENSRegistry: "0x51523ba907e3868b1dfa97c9185869c3144807ac",
        FixedPriceRegistrar: "0x248d27095a659fc125a16b6191fb6b904936f475",
        PublicResolver: "0x09964cc3105f51b4f94ec5bf7d398521f36202b1"
      }
    },
    staking: {
      address: {
        Aerum: "0xa249f0e9a464b9685f66992f41e1012388e39e81",
        Governance: "0x7f07f6627e9bf1fc821360e0c20f32af532df106"
      }
    },
    factory: {
      address: {
        TokenFactory: "0x158f3b5369e9a4f58fcd8452bc76b859405a2214"
      }
    },
    contractRegistry: {
      address: "0xdca75acf346b00e0faa3148246714df8ebe4e639"
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
    derivationPath: "m/44'/538'/0'/0/0",
    laguage: "en",
    numberOfBlocks: 20
  },
  chainId: 538,
  loglevel: LogLevel.All,
};
