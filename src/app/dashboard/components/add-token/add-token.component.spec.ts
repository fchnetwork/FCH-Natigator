/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddTokenComponent } from './add-token.component';

describe('AddTokenComponent', () => {
  let component: AddTokenComponent;
  let fixture: ComponentFixture<AddTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
