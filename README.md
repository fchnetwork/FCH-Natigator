# aerumWALLET

This project contains the WALLET (WebApp) implementation of the AERUM solution. 

## Development server

This projects contains direct dependency to the `aerumUI` framework. Since `aerumUI` is constantly updating through CI processes 
Make syre you have the latest version. To do so, this is how you should run the dev. server: 

`npm run update:ui`
`npm run start`

## Code scaffolding

For code scaffolding purposes you can use `ng generate`. There is, however, a more neat solution. If you install `Angular files` extension for VSCode
you will be able to generate necessary files just by right clicking the folder and selecting desired component/module/pipe/service option. 

## Build

As with development server, always ensure you have the latest version of `aerumUI` installed. To execute build run following commands: 

`npm run update:ui`
`npm run build`

## CI & Cloud Builds

`aerumWALLET` has CI processes implemented through bitbucket pipelines (see `bitbucket-pipelines.yml`). General overview of how it works is:

* Pushing the code to server branch triggers a cloud build
* PR from your branch to `development` branch triggers a cloud build. If the build is successfull, the build artifacts get deployed to [dev.aerum.net](http://dev.aerum.net) 

## Running tests

Run `npm run test` to execute `Karma` tests.To execute the end-to-end tests via [Protractor](http://www.protractortest.org/), run `npm run e2e`.

## Further help

In case of any questions contact me @ b.ballay@asrcrypto.io or in the slack channel.
