import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSwapConfirmComponent } from './create-swap-confirm.component';

describe('CreateSwapConfirmComponent', () => {
  let component: CreateSwapConfirmComponent;
  let fixture: ComponentFixture<CreateSwapConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSwapConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSwapConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
