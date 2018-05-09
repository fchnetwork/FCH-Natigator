const path = require('path');

module.exports = {
    '@app': path.resolve('src/app/app'),
    '@account': path.resolve('src/app/account'),
    '@dashboard': path.resolve('src/app/wallet/dashboard'),
    '@explorer': path.resolve('src/app/wallet/explorer'),
    '@shared': path.resolve('src/app/shared'),
    '@transaction': path.resolve('src/app/wallet/transaction'),
    '@diagnostics': path.resolve('src/app/wallet/diagnostics'),
    '@env': path.resolve('src/environments')
};