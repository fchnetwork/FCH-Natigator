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
    },
    aens: {
      address: {
        ENSRegistry: "0x5b78f4488c1f915b5b1652a7f0133cd534fd853f",
        FixedPriceRegistrar: "0x5343f733de635a1371c26ad3dc67963a044f9145",
        PublicResolver: "0xdc6453947b3ccabd14aa20c29e7df3ee124c42a9"
      }
    }
  },
  gasPrice: "1",
  maxBlockGas: "1",
  chainId: 8522
};