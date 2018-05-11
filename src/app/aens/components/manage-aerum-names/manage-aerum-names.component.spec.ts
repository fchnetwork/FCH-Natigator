import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAerumNamesComponent } from './manage-aerum-names.component';

describe('ManageAerumNamesComponent', () => {
  let component: ManageAerumNamesComponent;
  let fixture: ComponentFixture<ManageAerumNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAerumNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAerumNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
