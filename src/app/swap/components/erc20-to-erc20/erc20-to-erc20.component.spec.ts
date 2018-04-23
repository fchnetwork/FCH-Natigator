import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20ToErc20Component } from './erc20-to-erc20.component';

describe('Erc20ToErc20Component', () => {
  let component: Erc20ToErc20Component;
  let fixture: ComponentFixture<Erc20ToErc20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erc20ToErc20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20ToErc20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
