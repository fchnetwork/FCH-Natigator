import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AerunNameBuyConfirmComponent } from './aerun-name-buy-confirm.component';

describe('AerunNameBuyConfirmComponent', () => {
  let component: AerunNameBuyConfirmComponent;
  let fixture: ComponentFixture<AerunNameBuyConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AerunNameBuyConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerunNameBuyConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
