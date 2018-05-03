import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapTokensListComponent } from './swap-tokens-list.component';

describe('SwapTokensListComponent', () => {
  let component: SwapTokensListComponent;
  let fixture: ComponentFixture<SwapTokensListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapTokensListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapTokensListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
