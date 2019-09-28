import { Injectable } from '@angular/core';
import { EnvironmentService } from "@core/general/environment-service/environment.service";

declare const window: any;

@Injectable()
export class FingerPrintService {
  private key = 'aerum-wallet-finger-print';
  private touchId: any;

  constructor(private environment: EnvironmentService) {
    if(!this.environment.get().isMobileBuild) {
      return;
    }
    this.touchId = window.plugins.touchid;
  }

  async isAvailable(): Promise<boolean> {
    if(!this.environment.get().isMobileBuild) {
      return false;
    }
    return await this.isTouchIdAvailable() && await this.isTouchIdKeyAvailable();
  }

  async savePassword(password: string): Promise<boolean> {
    if(!this.environment.get().isMobileBuild || !(await this.isTouchIdAvailable())) {
      return;
    }
    await this.deletePassword();
    return new Promise<boolean>(resolve => {
      this.touchId.save(this.key, password, false, () => {
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
    if(!this.environment.get().isMobileBuild) {
      return null;
    }
    return new Promise<string>(resolve => {
      this.touchId.verify(this.key, 'Fuchsia Wallet', password => {
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
