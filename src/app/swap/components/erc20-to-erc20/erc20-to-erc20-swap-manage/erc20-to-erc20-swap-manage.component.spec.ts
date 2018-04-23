import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20ToErc20SwapManageComponent } from './erc20-to-erc20-swap-manage.component';

describe('Erc20ToErc20SwapManageComponent', () => {
  let component: Erc20ToErc20SwapManageComponent;
  let fixture: ComponentFixture<Erc20ToErc20SwapManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erc20ToErc20SwapManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20ToErc20SwapManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
