import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AeroToErc20SwapCreateComponent } from './aero-to-erc20-swap-create.component';

describe('AeroToErc20SwapCreateComponent', () => {
  let component: AeroToErc20SwapCreateComponent;
  let fixture: ComponentFixture<AeroToErc20SwapCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AeroToErc20SwapCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AeroToErc20SwapCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
