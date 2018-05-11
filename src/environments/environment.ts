// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angularcli.json`.

export const environment = {
  production: false,
  configInUse: "environment.default",
  HttpProvider: "https://marge.aerum.net/eth",
  cookiesDomain: "localhost",
  webSocketStatServer: "ws://localhost:3000/primus",
  externalBlockExplorer: "http://explore.aerum.net/#/",
  contracts: {
    swap: {
      address: {
        AeroToErc20: "0x6fdf39d14b9caffab2ef746f37bec1cf7a12011a",
        Erc20ToAero: "0x5613008e456d5ae946d328de647ce7400eab63e5",
        Erc20ToErc20: "0xf0c9a6f06c38b0b8ae255ef9d592e16e419f9676"
      }
    }
  },
  chainId: 8522
};