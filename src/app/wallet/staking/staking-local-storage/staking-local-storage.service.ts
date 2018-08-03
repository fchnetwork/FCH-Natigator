import { Injectable } from '@angular/core';
import { StorageService } from "@core/general/storage-service/storage.service";
import { StakingReference } from "@app/wallet/staking/models/staking-reference.model";

@Injectable()
export class StakingLocalStorageService {

  constructor(private storageService: StorageService)
  { }

  get(): StakingReference[] {
    return this.storageService.getSessionData('stakings') as StakingReference[] || [];
  }

  store(staking: StakingReference) {
    if(!staking) {
      return;
    }
    const stakings = this.get();
    stakings.push(staking);
    this.storageService.setSessionData('stakings', stakings);
    const stringStaking = JSON.stringify(stakings);
    this.storageService.setCookie('stakings', stringStaking, true, 7);
  }

  remove(staking: StakingReference) {
    if(!staking) {
      return;
    }
    const stakings = this.get();
    const index = stakings.findIndex(s => s.address === staking.address);
    if(index === -1) {
      return;  
    }
    stakings.splice(index, 1);
    this.storageService.setSessionData('stakings', stakings);
    const stringStaking = JSON.stringify(stakings);
    this.storageService.setCookie('stakings', stringStaking, true, 7);
  }
}
