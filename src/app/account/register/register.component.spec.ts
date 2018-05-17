// /* tslint:disable:no-unused-variable */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';

// import { RegisterComponent } from './register.component';

// describe('RegisterComponent', () => {
//   let component: RegisterComponent;
//   let fixture: ComponentFixture<RegisterComponent>;


//   beforeEach(async(() => {
//     // let sevice = new RouteDataService;
//     TestBed.configureTestingModule({
//       declarations: [ RegisterComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(RegisterComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should return one object', async () => {
//     const event = {
//       "target": {
//         "value": "Hello"
//       }};
//     const result = "VERY_WEAK";
//     jest.spyOn(component, 'onKey').mockImplementation(() => result);
//     // component.onKey(event);
//     expect(component.onKey(event)).toBe(result);
//   });

// });
// import { RegisterComponent } from './register.component';

const taiPasswordStrength = require("tai-password-strength")

class PasswordCheckerService {
  strengthTester: any;

  constructor() {
      this.strengthTester = new taiPasswordStrength.PasswordStrength();
      this.strengthTester.addCommonPasswords(taiPasswordStrength.commonPasswords);
      this.strengthTester.addTrigraphMap(taiPasswordStrength.trigraphs);
  }

  checkPassword( password: string ) {
      return this.strengthTester.check(password);
  }
}

class RegisterComponent {
  passClass = {
    'VERY_WEAK': 'red',
    'WEAK': 'yellow',
    'REASONABLE': 'green',
    'STRONG': 'blue',
    'VERY_STRONG': 'blue'
  }
  passwordStrength = {
    strength: 'VERY_WEAK',
    class: 'red',
  };
  constructor(
    public passCheck: PasswordCheckerService) { }

  onKey(event: any) {
    if (event.target.value == "") {
      this.passwordStrength.class = "red";
      this.passwordStrength.strength = "VERY_WEAK";
    } else {
      this.passwordStrength.strength = this.passCheck.checkPassword(event.target.value).strengthCode;
      this.passwordStrength.class = this.passClass[this.passCheck.checkPassword(event.target.value).strengthCode];
    }
    return this.passwordStrength.strength;
  }
}


describe('Component: Login', () => {

  let component: RegisterComponent;
  let passCheck: PasswordCheckerService;
  let response: Object = {
    'VERY_WEAK':"Hello", 
    'WEAK': "HelloWor", 
    'REASONABLE':'Ma.@Ki<3', 
    'STRONG':'Ma.@Ki<35^D',
    'VERY_STRONG':'Ma.@Ki<35^DoT'};

  beforeEach(() => { 
    passCheck = new PasswordCheckerService;
    component = new RegisterComponent(passCheck);
  });

  afterEach(() => {
    passCheck = null;
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (var item in response) {
    it('should return ' + item, async () => {
      const event = {
        "target": {
          "value": response[item]
        }};
      const result = item;
      expect(component.onKey(event)).toBe(result);
    });
  }
});