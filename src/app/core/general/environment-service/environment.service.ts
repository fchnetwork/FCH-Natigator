import { Injectable } from '@angular/core';
import { StorageService } from '@app/core/general/storage-service/storage.service';

import { environment } from '@env/environment';
import { environment as environmentTest } from '@env/environment.test';
import { environment as environmentMobileTest } from '@env/environment.mobile.test';
import { EnvMode } from './environment.model';

@Injectable()
export class EnvironmentService {
  constructor(private storageService: StorageService) {
  }

  get() {
    const mode = this.getMode();
    if(mode === EnvMode.Test) {
      return !environment.isMobileBuild ? environmentTest : environmentMobileTest;
    }
    return environment;
  }

  getMode(): EnvMode {
    const envModeStr = this.storageService.getStorage('EnvMode');
    if(!envModeStr) {
      return EnvMode.Live;
    }
    return Number.parseInt(this.storageService.getStorage('EnvMode'));
  }

  setMode(mode: EnvMode) {
    this.storageService.setStorage('EnvMode', mode);
  }
}
