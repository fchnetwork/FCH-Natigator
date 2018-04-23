import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AeroToErc20Component } from './aero-to-erc20.component';

describe('AeroToErc20Component', () => {
  let component: AeroToErc20Component;
  let fixture: ComponentFixture<AeroToErc20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AeroToErc20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AeroToErc20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
