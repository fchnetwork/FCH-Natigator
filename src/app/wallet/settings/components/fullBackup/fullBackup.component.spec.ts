/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FullBackupComponent } from './fullBackup.component';

describe('FullBackupComponent', () => {
  let component: FullBackupComponent;
  let fixture: ComponentFixture<FullBackupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullBackupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
