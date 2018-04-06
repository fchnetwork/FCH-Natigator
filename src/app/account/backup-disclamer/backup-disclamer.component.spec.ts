/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BackupDisclamerComponent } from './backup-disclamer.component';

describe('BackupDisclamerComponent', () => {
  let component: BackupDisclamerComponent;
  let fixture: ComponentFixture<BackupDisclamerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupDisclamerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupDisclamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
