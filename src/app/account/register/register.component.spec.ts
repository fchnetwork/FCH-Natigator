/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegisterComponent } from './register.component';

class RouteDataService<T> { 
  routeData: T; 
    clear() {
        this.routeData = null;
    }
    hasData() : boolean {
        return this.routeData != null && this.routeData != undefined;
    }
    constructor() { }
}

describe('RegisterComponent', () => {
  // let service: RouteDataService<T>;
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;


  beforeEach(async(() => {
    // let sevice = new RouteDataService;
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ]
    })
    .compileComponents();
  }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(RegisterComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should return one object', async () => {
  //   const event = {
  //     "target": {
  //       "value": "Hello"
  //     }};
  //   const result = "VERY_WEAK";
  //   jest.spyOn(component, 'onKey').mockImplementation(() => result);;
  //   // component.onKey(event);
  //   expect(component.onKey(event)).toBe(result);
  // });

});
