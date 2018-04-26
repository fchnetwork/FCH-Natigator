// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  HttpProvider: "http://52.51.85.249:8545",
  // HttpProvider: "http://127.0.0.1:8545"
  cookiesDomain: "dev.aerum.net",
  contracts: {
    swap: {
      address: {
        AeroToErc20: "0x597c59b85b9d75abb040091e084ffdbe687ac2f0",
        Erc20ToAero: "0x132042ea011f2b0f3b2910a3ac56f78c047b82c8",
        Erc20ToErc20: "0xb08d606c34e2b259512be2d06e9748af662ede71"
      }
    }
  },
  chainId: 8522
};
