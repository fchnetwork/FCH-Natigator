const path = require('path');

module.exports = {
    '@app': path.resolve('src/app'),
    '@core': path.resolve('src/app/core'),
    '@account': path.resolve('src/app/account'),
    '@shared': path.resolve('src/app/shared'),
    '@dashboard': path.resolve('src/app/wallet/dashboard'),
    '@explorer': path.resolve('src/app/wallet/explorer'),
    '@transaction': path.resolve('src/app/wallet/transaction'),
    '@diagnostics': path.resolve('src/app/wallet/diagnostics'),
    '@env': path.resolve('src/environments')
};