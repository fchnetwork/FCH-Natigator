/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QrScanComponent } from './qr-scan.component';

describe('QrScanComponent', () => {
  let component: QrScanComponent;
  let fixture: ComponentFixture<QrScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
