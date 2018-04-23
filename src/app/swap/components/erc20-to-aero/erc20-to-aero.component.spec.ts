import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20ToAeroComponent } from './erc20-to-aero.component';

describe('Erc20ToAeroComponent', () => {
  let component: Erc20ToAeroComponent;
  let fixture: ComponentFixture<Erc20ToAeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erc20ToAeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20ToAeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
