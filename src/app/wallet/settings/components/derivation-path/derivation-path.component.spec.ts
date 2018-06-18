/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DerivationPathComponent } from './derivation-path.component';

describe('DerivationPathComponent', () => {
  let component: DerivationPathComponent;
  let fixture: ComponentFixture<DerivationPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivationPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivationPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
