import { ActivatedRoute, Router } from '@angular/router';
import { AccountIdleService } from './core/authentication/account-idle-service/account-idle.service';
import { async } from '@angular/core/testing';
import { AppComponent } from './app.component';
describe('AppComponent', () => {
  let component = AppComponent;
  let service: AccountIdleService;
  beforeEach((() => {
    service = new AccountIdleService();
    component = new AppComponent(service, ActivatedRoute, Router);
  }));
  it('should create the app component', async(() => {
    expect(component).toBeDefined();
  }));
});
