import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAensContractComponent } from './manage-aens-contract.component';

describe('ManageAensContractComponent', () => {
  let component: ManageAensContractComponent;
  let fixture: ComponentFixture<ManageAensContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAensContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAensContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
