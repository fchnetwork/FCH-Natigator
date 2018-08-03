/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PaperWalletImportComponent } from './paper-wallet-import.component';

describe('PaperWalletImportComponent', () => {
  let component: PaperWalletImportComponent;
  let fixture: ComponentFixture<PaperWalletImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperWalletImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperWalletImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
