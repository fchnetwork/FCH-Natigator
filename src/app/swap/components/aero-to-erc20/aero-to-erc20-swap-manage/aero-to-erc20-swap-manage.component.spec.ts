import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AeroToErc20SwapManageComponent } from './aero-to-erc20-swap-manage.component';

describe('AeroToErc20SwapManageComponent', () => {
  let component: AeroToErc20SwapManageComponent;
  let fixture: ComponentFixture<AeroToErc20SwapManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AeroToErc20SwapManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AeroToErc20SwapManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
