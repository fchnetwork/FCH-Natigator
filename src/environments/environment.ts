import { LogLevel } from "@app/core/general/logger-service/log-level.enum";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angularcli.json`.
export const environment = {
  production: false,
  isMobileBuild: false,
  configInUse: "environment.default",
  WebsocketProvider: "wss://marge.aerum.net/wss",
  rpcApiProvider: "https://marge.aerum.net/eth",
  cookiesDomain: "localhost",
  webSocketStatServer: "ws://localhost:3000/primus",
  externalBlockExplorer: "https://explore.aerum.net/#/",
  contracts: {
    swap: {
      address: {
        AeroToErc20: "0x537c9e85fb2bf55e83b0631e85b3227f05411d3e",
        Erc20ToAero: "0x1af3aadfe5e2f8d9799e2ccb011906023ea01922",
        Erc20ToErc20: "0x20bf6e06b57e6384a5ac41c324edf894f7d59323"
      },
      crossChain: {
        address: {
          aerum: {
            OpenAeroSwap: "0xc26a824f59e315a3ebc7f45d4a53b5c87b743bf7",
            OpenErc20Swap: "0x223a8f2b11602f10931fc4bc852c057f3d1bc5e3",
            CounterAeroSwap: "0x39d6969f9f0b528efef7e13b932d2b912bfd9486",
            CounterErc20Swap: "0xc0b995d7e0300e5f5e459911ad5d63c0f9a1b3b1",
            TemplatesRegistry: "0x1b1ff05ebe506d8c07e4354b316b1fb5b3b08d2a"
          },
          ethereum: {
            OpenEtherSwap: "0x44fcb81f812a69b6c4a4a52569937284bba0df6a",
            OpenErc20Swap: "0xa687217b52139ea26f52114e8188ed2f7b94a679",
            CounterEtherSwap: "0x014604c83715377c7ee381400932ba7c2a691bbe",
            CounterErc20Swap: "0xc6ef31905ab863242dc6ed5d6fd6930f4f97f0ac"
          }
        },
        swapExpireTimeoutInSeconds: 10 * 60
      }
    },
    aens: {
      address: {
        ENSRegistry: "0x49dc6ee5540eb3e0d8015ec2381ed4146315b6b6",
        FixedPriceRegistrar: "0xa942a9d2793cc12b35b7801cc0b60b72095f8553",
        PublicResolver: "0x125a0dd27bb49b38b1f023263ccfbf1757e603b7"
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
        TokenFactory: "0x7281e96d6feb03162e93f6b9077e7d407d0c6880"
      }
    },
    contractRegistry: {
      address: "0x8a550f44836101b45f02dfbd13d99ffa425a29b0"
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
  loglevel: LogLevel.All,
};
