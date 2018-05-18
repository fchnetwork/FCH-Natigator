import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadSwapComponent } from './load-swap.component';

describe('LoadSwapComponent', () => {
  let component: LoadSwapComponent;
  let fixture: ComponentFixture<LoadSwapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadSwapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
