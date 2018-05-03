import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSwapComponent } from './create-swap.component';

describe('CreateSwapComponent', () => {
  let component: CreateSwapComponent;
  let fixture: ComponentFixture<CreateSwapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSwapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
