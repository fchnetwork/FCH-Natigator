import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadSwapConfirmComponent } from './load-swap-confirm.component';

describe('LoadSwapConfirmComponent', () => {
  let component: LoadSwapConfirmComponent;
  let fixture: ComponentFixture<LoadSwapConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadSwapConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadSwapConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
