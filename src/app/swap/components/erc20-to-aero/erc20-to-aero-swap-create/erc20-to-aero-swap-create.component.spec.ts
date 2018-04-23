import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20ToAeroSwapCreateComponent } from './erc20-to-aero-swap-create.component';

describe('Erc20ToAeroSwapCreateComponent', () => {
  let component: Erc20ToAeroSwapCreateComponent;
  let fixture: ComponentFixture<Erc20ToAeroSwapCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erc20ToAeroSwapCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20ToAeroSwapCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
