/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GetBlockModalComponent } from './get-block-modal.component';

describe('GetBlockModalComponent', () => {
  let component: GetBlockModalComponent;
  let fixture: ComponentFixture<GetBlockModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetBlockModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBlockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
