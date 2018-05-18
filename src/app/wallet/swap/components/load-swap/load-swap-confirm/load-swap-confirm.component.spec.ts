import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicModalContext } from '@app/shared/components/modals/basic-modal/basic-modal.component'; 
import { LoadSwapConfirmComponent } from './load-swap-confirm.component';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { AppUIModule } from '@app/app.ui.module';
import { DialogRef } from 'ngx-modialog';

describe('LoadSwapConfirmComponent', () => {
  let component: LoadSwapConfirmComponent;
  let fixture: ComponentFixture<LoadSwapConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }), SharedModule, AppUIModule],
      declarations: [ LoadSwapConfirmComponent ],
      providers: [
        TranslateService,
        DialogRef
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadSwapConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
