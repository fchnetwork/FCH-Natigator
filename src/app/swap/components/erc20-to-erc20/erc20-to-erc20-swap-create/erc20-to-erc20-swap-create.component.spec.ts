import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20ToErc20SwapCreateComponent } from './erc20-to-erc20-swap-create.component';

describe('Erc20ToErc20SwapCreateComponent', () => {
  let component: Erc20ToErc20SwapCreateComponent;
  let fixture: ComponentFixture<Erc20ToErc20SwapCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erc20ToErc20SwapCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20ToErc20SwapCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
