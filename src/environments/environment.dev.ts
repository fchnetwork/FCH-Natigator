import { LogLevel } from "@app/core/general/logger-service/log-level.enum";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  configInUse: "environment.dev",
  WebsocketProvider: "wss://marge.aerum.net/wss",
  rpcApiProvider: "https://marge.aerum.net/eth",
  cookiesDomain: "dev.aerum.net",
  webSocketStatServer: "ws://localhost:3000/primus",
  externalBlockExplorer: "http://explore.aerum.net/#/",
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
            AeroSwap: "0xd7a2fdeedbb6495cdffa6d13f624c771de15a9ca",
            Erc20Swap: "0xa4d35cc7da4468ebe7be2ceb2bd05c3f12c2b4fd",
            TemplatesRegistry: "0x6ce0143a06476a3b1051df548cc096eb5ebb770e"
          },
          ethereum: {
            EtherSwap: "0x886cebd831af48f1bff5943605254037361c1d56",
            Erc20Swap: "0xef0aa2ffc51d039e073ebbb0de3c4b79ec98472c"
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
    }
  },
  ethereum: {
    endpoint: "https://rinkeby.infura.io/",
    chainId: 4,
    explorerUrl: "https://rinkeby.etherscan.io/tx/"
  },
  gasPrice: "1",
  maxBlockGas: "1",
  chainId: 418313827693,
  loglevel: LogLevel.All
};
