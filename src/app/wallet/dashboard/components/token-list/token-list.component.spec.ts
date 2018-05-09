/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TokenListComponent } from './token-list.component';

describe('TokenListComponent', () => {
  let component: TokenListComponent;
  let fixture: ComponentFixture<TokenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
