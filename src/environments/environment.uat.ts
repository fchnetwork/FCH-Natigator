import { LogLevel } from "@app/core/general/logger-service/log-level.enum";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  configInUse: "environment.uat",
  WebsocketProvider: "wss://marge.aerum.net/wss",
  rpcApiProvider: "https://marge.aerum.net/eth",
  cookiesDomain: "uat.aerum.net",
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
            OpenAeroSwap: "0x7ff74f1a5f55d632902587ed4e961e426c0103dc",
            OpenErc20Swap: "0xd7efba4122c670a563fd19fe28fb95a1ee48e04f",
            CounterAeroSwap: "0x898c0615ff8a1f18b9af8b721bb4aeae20a1f877",
            CounterErc20Swap: "0x9f38dccb3b784606a30e0b43fe7b97d15e91ceae",
            TemplatesRegistry: "0x6ce0143a06476a3b1051df548cc096eb5ebb770e"
          },
          ethereum: {
            OpenEtherSwap: "0x99c92b41a4194014a1d6649c52c2684b325590b6",
            OpenErc20Swap: "0x4aaf1190442c85c99b9fcf9003bc9ee138ecee70",
            CounterEtherSwap: "0xe51f118ac3cb8d54fc0168d1021c1fddcd860243",
            CounterErc20Swap: "0xc7f35bbbad6ef915ad292da05a61e8decf07cf55"
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
  loglevel: LogLevel.None
};
