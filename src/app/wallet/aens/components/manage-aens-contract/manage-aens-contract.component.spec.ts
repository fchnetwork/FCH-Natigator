import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAensContractComponent } from './manage-aens-contract.component';
import { AerumNameService } from '@app/core/aens/aerum-name.service';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { AppUIModule } from '@app/app.ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { NotificationService } from '@aerum/ui';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PrivateKey } from 'web3/types';
import { Observable } from 'rxjs/Observable';

import Web3 from 'web3';

class MockAerumNameService { 
  getBalance() {
    return 0;
  }
}
class MockNotificationService { }
class MockAuthService implements AuthenticationService {
  web3: Web3;
  
  initWeb3: () => Web3 = () => null;

  avatarsGenerator(): any[] {
    throw new Error("Method not implemented.");
  }
  generateCryptedAvatar(address: string) {
    throw new Error("Method not implemented.");
  }
  authState(): Observable<any> {
    throw new Error("Method not implemented.");
  }
  saveKeyStore(privateKey: string, password: string, seed: any): PrivateKey {
    throw new Error("Method not implemented.");
  }
  showKeystore(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getKeystore() {
    return "test_keystore";
  }
  unencryptKeystore(password: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  login(password: any): Promise<{}> {
    throw new Error("Method not implemented.");
  }
  logout(): void {
    throw new Error("Method not implemented.");
  }
  seedCleaner(seed: any) {
    throw new Error("Method not implemented.");
  }
  generateAdditionalAccounts(password: string, amount: number): any[] {
    throw new Error("Method not implemented.");
  }
  isHexAddress(str: any): boolean {
    throw new Error("Method not implemented.");
  }
  createQRcode(address: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  generateAddressLogin(seed: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}


class MockSessionService { }

describe('ManageAensContractComponent', () => {
  let component: ManageAensContractComponent;
  let fixture: ComponentFixture<ManageAensContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }), FormsModule, AppUIModule, CommonModule, ReactiveFormsModule, CoreModule, SharedModule],
      declarations: [ ManageAensContractComponent ],
      providers: [
        TranslateService,
        { provide: AerumNameService, useValue: new MockAerumNameService() },
        { provide: NotificationService, useValue: new MockNotificationService() },
        { provide: SessionStorageService, useValue: new MockSessionService() },
        { provide: AuthenticationService, useValue: new MockAuthService() }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAensContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
