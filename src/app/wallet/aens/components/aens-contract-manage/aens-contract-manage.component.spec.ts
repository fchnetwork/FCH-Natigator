import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AensContractManageComponent } from './aens-contract-manage.component';

import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { AppUIModule } from '@app/app.ui.module';
import { CoreModule } from '@app/core/core.module';

import { AerumNameService } from '@core/aens//aerum-name-service/aerum-name.service';
import { NotificationService } from '@aerum/ui';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';

import { ConvertToEtherPipe } from '@app/shared/pipes/convertToEther.pipe';
import Web3 from "web3";

describe('ManageAensContractComponent', () => {
  let component: AensContractManageComponent;
  let fixture: ComponentFixture<AensContractManageComponent>;
  const authService: Partial<AuthenticationService> = {
    getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3),
    getKeystore: () => ({ address: "test_keystroke" })
  };
  const ansService: Partial<AerumNameService> = {
    getBalance: () => Promise.resolve(5)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
         loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }), FormsModule, AppUIModule, ReactiveFormsModule, CoreModule, SharedModule],
      declarations: [ AensContractManageComponent ],
      providers: [
        TranslateService,
        { provide: AerumNameService, useValue: ansService },
        { provide: NotificationService, useValue: jest.fn() },
        { provide: AuthenticationService, useValue: authService },
        // TODO: Routes requires this. We should mock routes as well
        { provide: SessionStorageService, useValue: jest.fn() }
      ],
    })
    .compileComponents();

    jest.spyOn(ConvertToEtherPipe.prototype, "transform").mockImplementation((value) => value);
    jest.spyOn(TranslatePipe.prototype, "transform").mockImplementation((value) => value);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AensContractManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be able to transfer ownership to invalid address', () => {
    component.transferTo = '';
    fixture.detectChanges();
    expect(component.canTransfer()).toBeFalsy();
  });
});
