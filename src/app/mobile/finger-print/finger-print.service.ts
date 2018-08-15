import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

declare const window: any;

@Injectable()
export class FingerPrintService {
  private key = 'aerum-wallet-finger-print';
  private touchId: any;

  constructor() {
    if(!environment.isMobileBuild) {
      return;
    }
    this.touchId = window.plugins.touchid;
  }

  async isAvailable(): Promise<boolean> {
    if(!environment.isMobileBuild) {
      return false;
    }
    return await this.isTouchIdAvailable() && await this.isTouchIdKeyAvailable();
  }

  async savePassword(password: string): Promise<boolean> {
    if(!environment.isMobileBuild) {
      return;
    }
    await this.deletePassword();
    return new Promise<boolean>(resolve => {
      this.touchId.save(this.key, password, true, () => {
        resolve(true);
      });
    });
    
  }

  async deletePassword(): Promise<boolean> {
    if(!(await this.isAvailable())) {
      return;
    }
    return new Promise<boolean>(resolve => {
      this.touchId.delete(this.key, () => {
        resolve(true);
      });
    });
    
  }

  verify(): Promise<string> {
    if(!environment.isMobileBuild) {
      return null;
    }
    return new Promise<string>(resolve => {
      this.touchId.verify(this.key, 'Aerum Wallet', password => {
        resolve(password);
      });
    });
  }

  private isTouchIdAvailable(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.touchId.isAvailable(() => {
        resolve(true);
      }, () => {
        resolve(false);
      });
    });
  }

  private isTouchIdKeyAvailable(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.touchId.has(this.key, () => {
        resolve(true);
      }, () => {
        resolve(false);
      });
    });
  }
}
