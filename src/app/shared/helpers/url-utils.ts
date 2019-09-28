import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { SessionStorageService } from 'ngx-webstorage';
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";

export function genTransactionExplorerUrl(hash: string, chain: Chain): string {
  if(!hash) {
    return null;
  }
  const environment = new EnvironmentService(new StorageService(new SessionStorageService()));
  let transactionExplorerUrl = null;
  if(chain === Chain.Fuchsia){
    transactionExplorerUrl = `${environment.get().externalBlockExplorer}transaction/${hash}`;
  }
  if(chain === Chain.Ethereum){
    transactionExplorerUrl = environment.get().ethereum.explorerUrl + hash;
  }
  return transactionExplorerUrl;
}
