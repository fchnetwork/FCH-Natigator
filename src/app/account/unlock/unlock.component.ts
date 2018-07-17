import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs/Subject";
import { SessionStorageService } from "ngx-webstorage";
import { PasswordValidator } from "../../shared/helpers/validator.password";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { InternalNotificationService } from "@app/core/general/internal-notification-service/internal-notification.service";

@Component({
  selector: "app-unlock",
  templateUrl: "./unlock.component.html",
  styleUrls: ["./unlock.component.scss"]
})
export class UnlockComponent implements OnInit {
  unlockForm: FormGroup = this.formBuilder.group({});
  address: string;
  password: string;
  avatar: string;
  query: string;
  passwordIncorrect = false;
  returnUrl: string;

  windowState: boolean;

  constructor(
    public authServ: AuthenticationService,
    private router: Router,
    public formBuilder: FormBuilder,
    public sessionStorageService: SessionStorageService,
    private route: ActivatedRoute,
    private notificationService: InternalNotificationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || null;
    this.unlockForm = this.formBuilder.group({
      password: ["", [Validators.required]]
    });
  }

  onSubmitAddress() {
    this.authServ
      .login(this.password)
      .then(res => {
        this.router.navigateByUrl(this.returnUrl || '/');
      })
      .catch(reason => {
        console.log(reason);
        this.passwordIncorrect = true;

        this.translateService
          .get("UNLOCK.INVALID_PASSWORD")
          .subscribe(message => {
            this.notificationService.showMessage(message, "Error");
          });
      });
  }
}
