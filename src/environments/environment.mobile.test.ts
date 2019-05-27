import { LogLevel } from "@app/core/general/logger-service/log-level.enum";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  isMobileBuild: true,
  configInUse: "environment.mobile.test",
  externalConfig: "http://localhost:3000/",
  WebsocketProvider: "wss://ortus.testnet.aerum.net/wss",
  rpcApiProvider: "https://ortus.testnet.aerum.net/",
  aerumBit: "https://api-aerumbit.testnet.aerum.net/",
  cookiesDomain: "dev.aerum.net",
  webSocketStatServer: "ws://localhost:3000/primus",
  externalBlockExplorer: "https://ortus.stats.testnet.aerum.net/#/",
  predefinedTokens: ['0xf197379e7942afa153ad13f3e337d4c362b7bd99'],
  contracts: {
    swap: {
      address: {
        AeroToErc20: "0x8f3d1cf1739cda904ac8fa3b7f52e96af82f5acd",
        Erc20ToAero: "0xcf348523e8c6dbfb64e55b0622b4c1e74b9d7866",
        Erc20ToErc20: "0x20bf6e06b57e6384a5ac41c324edf894f7d59323"
      },
      crossChain: {
        address: {
          aerum: {
            OpenAeroSwap: "0x05f77b04179f6b9c9c8d67ebb027079d168a3b85",
            OpenErc20Swap: "0x355d4b0beb5c8a265ca4f09827ec1ebcb25aee37",
            CounterAeroSwap: "0xd2348accf6a36705982fce15362c14afad143a63",
            CounterErc20Swap: "0xc13c8016fb21762dcb41f84b6246c34b24999e12",
            TemplatesRegistry: "0x27ccab73acfb1b0545f605c894e5521ec71eb505"
          },
          ethereum: {
            OpenEtherSwap: "0x407062bd0171cb6a8d19a061774f1b1374b40f43",
            OpenErc20Swap: "0x4cd16d5bcd54619c34b17970296b44e73719ada8",
            CounterEtherSwap: "0xba57c7716427cd12d821ae0cb268de1eb139ae14",
            CounterErc20Swap: "0xa5ff7624fb3e19a6c10bb2d465da69081f3692c4"
          }
        },
        swapExpireTimeoutInSeconds: 10 * 60
      }
    },
    aens: {
      address: {
        ENSRegistry: "0x1cbe52b6ddaf594076fe484bcd1131cf7aaa5427",
        FixedPriceRegistrar: "0x84037fa2e7f68b23a6af5eafb2f9a61800f18159",
        PublicResolver: "0x966a2c2e9c1c0167ed342dfdf639e0a07a7d65c9"
      }
    },
    staking: {
      address: {
        Aerum: "0x202a7a348fe8b106f11c3be2224d394dce65a424",
        Governance: "0xa67725590a935d8af3abb082dda3fd9eceff5fbf"
      }
    },
    factory: {
      address: {
        TokenFactory: "0xfcbcd12416e972e05c2e76f484d39a383808ff71"
      }
    },
    contractRegistry: {
      address: "0x6c43165e4c2c56dbe5fbb99f687e7742ff4375f3"
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
  chainId: 418313827693,
  loglevel: LogLevel.All
};
