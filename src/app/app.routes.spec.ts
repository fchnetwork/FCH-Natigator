import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { RegisterComponent } from "@app/account/register/register.component";
import { UnlockComponent } from "@app/account/unlock/unlock.component";
import { HomeComponent } from "@app/wallet/home/home.component";
import { WalletComponent } from "@app/wallet/wallet.component";

describe('Router: App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([
          {
              path: '/account/register',
              component: RegisterComponent
          },
          {
              path: '/account/unlock',
              component: UnlockComponent
          },
          {
              path: '/wallet/home',
              component: HomeComponent
          }
      ])],
      declarations: [
        WalletComponent,
        RegisterComponent,
        UnlockComponent
      ]
    });
  });

  it('fakeAsync works', fakeAsync(() => {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => done = true);
    tick(50);
    expect(done).toBeTruthy();
  }));
});
