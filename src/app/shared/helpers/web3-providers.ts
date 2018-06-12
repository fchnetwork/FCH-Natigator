declare const window: any;

export function getCurrentProvider() {
  if (!window.web3) {
    return null;
  }

  if (window.web3.currentProvider.isMetaMask) {
    return 'Metamask';
  }

  if (window.web3.currentProvider.isTrust) {
    return 'Trust';
  }

  if (typeof window.SOFA !== 'undefined') {
    return 'Toshi';
  }

  if (typeof window.__CIPHER__ !== 'undefined') {
    return 'Cipher';
  }

  if (window.web3.currentProvider.constructor.name === 'EthereumProvider') {
    return 'Mist';
  }

  if (window.web3.currentProvider.constructor.name === 'Web3FrameProvider') {
    return 'Parity';
  }

  if (window.web3.currentProvider.host && window.web3.currentProvider.host.indexOf('infura') !== -1) {
    return 'Infura';
  }

  if (window.web3.currentProvider.host && window.web3.currentProvider.host.indexOf('localhost') !== -1) {
    return 'localhost';
  }

  return 'Unknown';
}
