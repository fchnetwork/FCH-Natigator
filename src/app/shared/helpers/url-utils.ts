import { environment } from "@env/environment";
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";

export function genTransactionExplorerUrl(hash: string, chain: Chain): string {
  if(!hash) {
    return null;
  }
  let transactionExplorerUrl = null;
  if(chain === Chain.Aerum){
    transactionExplorerUrl = `${environment.externalBlockExplorer}transaction/${hash}`;
  }
  if(chain === Chain.Ethereum){
    transactionExplorerUrl = environment.ethereum.explorerUrl + hash;
  }
  return transactionExplorerUrl;
}