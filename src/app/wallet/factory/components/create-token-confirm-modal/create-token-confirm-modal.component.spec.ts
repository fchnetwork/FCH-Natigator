import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTokenConfirmModalComponent } from './create-token-confirm-modal.component';

describe('CreateTokenConfirmModalComponent', () => {
  let component: CreateTokenConfirmModalComponent;
  let fixture: ComponentFixture<CreateTokenConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTokenConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTokenConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
