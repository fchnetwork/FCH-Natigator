/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BackupPromptComponent } from './backup-prompt.component';

describe('BackupConfirmationComponent', () => {
  let component: BackupPromptComponent;
  let fixture: ComponentFixture<BackupPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
