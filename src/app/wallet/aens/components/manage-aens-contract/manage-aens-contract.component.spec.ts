import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAensContractComponent } from './manage-aens-contract.component';

import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { AppUIModule } from '@app/app.ui.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';

import { AerumNameService } from '@app/core/aens/aerum-name.service';
import { NotificationService } from '@aerum/ui';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';

import { ConvertToEtherPipe } from '@app/shared/pipes/convertToEther.pipe';
import { Router } from '@angular/router';

class MockSessionService { }

describe('ManageAensContractComponent', () => {
  let component: ManageAensContractComponent;
  let fixture: ComponentFixture<ManageAensContractComponent>;
  const authService: Partial<AuthenticationService> = {
    initWeb3: () => null,
    getKeystore: () => ({ address: "test_keystroke" })
  };
  const ansService: Partial<AerumNameService> = {
    getBalance: () => Promise.resolve(5)
  };

  // const routerSpy = jest.spyOn(Router.prototype, "navigateByUrl");

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
         loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }), FormsModule, AppUIModule, ReactiveFormsModule, CoreModule, SharedModule],
      declarations: [ ManageAensContractComponent ],
      providers: [
        // { provide: Router, useValue: routerSpy },
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
    fixture = TestBed.createComponent(ManageAensContractComponent);
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
