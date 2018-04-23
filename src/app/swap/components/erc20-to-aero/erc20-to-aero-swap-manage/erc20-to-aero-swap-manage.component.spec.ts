import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20ToAeroSwapManageComponent } from './erc20-to-aero-swap-manage.component';

describe('Erc20ToAeroSwapManageComponent', () => {
  let component: Erc20ToAeroSwapManageComponent;
  let fixture: ComponentFixture<Erc20ToAeroSwapManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erc20ToAeroSwapManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20ToAeroSwapManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
