import { environment } from "@env/environment";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  style,
  trigger,
  state,
  transition,
  animate
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";

import { Cookie } from "ng2-cookies/ng2-cookies";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { PasswordCheckerService } from "@app/core/authentication/password-checker-service/password-checker.service";
import { SessionStorageService } from "ngx-webstorage";
import { StorageService } from "@core/general/storage-service/storage.service";

@Component({
  selector: "app-access-recovery",
  templateUrl: "./access-recovery.component.html",
  styleUrls: ["./access-recovery.component.scss"],
  animations: [
    trigger("slide", [
      state("left", style({ transform: "translateX(0)" })),
      state("right", style({ transform: "translateX(-50%)" })),
      transition("* => *", animate(300))
    ])
  ]
})
export class AccessRecoveryComponent implements OnInit, OnDestroy {
  activePane = 'left';
  isScanMode = false;
  address = "";
  avatar: string;
  private: string;
  recoverForm: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();
  step = "step_1";
  seedFileText: string;
  passwordStrength = {
    strength: "",
    class: ""
  };

  constructor(
    public authServ: AuthenticationService,
    private router: Router,
    public formBuilder: FormBuilder,
    public cd: ChangeDetectorRef,
    public passCheckService: PasswordCheckerService,
    public sessionStorage: SessionStorageService,
    private storageService: StorageService
  ) {}

  openBackupFile(event, type) {


    const input = event.target;
    const fileTypes = ["txt", "aer"];
    if (input.files && input.files[0]) {
      const extension = input.files[0].name
          .split(".")
          .pop()
          .toLowerCase(), //file extension from input file
        allowedFile = fileTypes.indexOf(extension) > -1; //is extension in acceptable types
      if (allowedFile) {
        for (let index = 0; index < input.files.length; index++) {
          const reader: any = new FileReader();
          reader.onload = () => {
            if (type === "seed") {
              if (reader.result.split(" ").length === 12) {
                this.seedFileText = reader.result;
                this.recoverForm.controls["seed"].setValue(this.seedFileText);
              }
            } else if (type === "full") {
              const results = JSON.parse(reader.result);
              this.cleanCookies();
              this.storageService.setCookie(
                "aerum_base",
                results.aerumBase,
                false,
                7
              );
              this.storageService.setCookie(
                "aerum_keyStore",
                results.aerumKeyStore,
                false,
                7
              );
              this.storageService.setCookie("tokens", results.tokens, false, 7);
              this.storageService.setCookie(
                "transactions",
                results.transactions,
                false,
                7
              );
              this.storageService.setCookie(
                "settings",
                results.settings,
                false,
                3650
              );
              this.storageService.setCookie(
                "ethereum_accounts",
                results.ethereumAccounts,
                false,
                7
              );
              this.storageService.setCookie(
                "cross_chain_swaps",
                results.crossChainSwaps,
                false,
                7
              );
              this.router.navigate(["/account/unlock"]);
            }
          };
          reader.readAsText(input.files[index]);
        }
      }
    }
  }

  cleanCookies() {
    this.storageService.setCookie("aerum_base", null, false, 7);
    this.storageService.setCookie("aerum_keyStore", null, false, 7);
    this.storageService.setCookie("tokens", null, false, 7);
    this.storageService.setCookie("transactions", null, false, 7);
    this.storageService.setCookie("settings", null, false, 7);
    this.storageService.setCookie("ethereum_accounts", null, false, 7);
    this.storageService.setCookie("cross_chain_swaps", null, false, 7);
  }

  ngOnInit() {
    this.recoverForm = this.formBuilder.group(
      {
        seed: ["", [Validators.required]],
        // password: [ "", [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower ] ],
        password: ["", [Validators.required]],
        confirmpassword: ["", [Validators.required]]
      },
      {
        validator: this.matchingPasswords("password", "confirmpassword")
      }
    );
    this._processFormData();
  }

  private _processFormData() {
    const seedControl = this.recoverForm.controls["seed"];
    seedControl.valueChanges
      .takeUntil(this.componentDestroyed$)
      .subscribe(async v => {
        if (v && v.length > 2) {
          let cleanSeed = v.trim(); // trim starting and ending spaces
          cleanSeed = cleanSeed.replace(/[^\w\s]/gi, " "); // clean all special characters
          cleanSeed.replace(/\s\s+/g, " "); // remove double spaces
          this.authServ.generateAddressLogin(cleanSeed).then(async res => {
            this.address = res.address;
            this.avatar = res.avatar;
            this.private = res.private;
          });
        }
        this.address = "";
        this.cd.detectChanges();
      });
  }

  // Custom validator to make sure the password and confirm password match /
  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      }
    };
  }

  onSubmitAddress() {
    if (this.recoverForm.valid) {
      this.cleanCookies();

      this.storageService.setSessionData("acc_address", this.address);
      this.storageService.setSessionData(
        "acc_avatar",
        this.authServ.generateCryptedAvatar(this.address)
      );
      this.storageService.setSessionData("seed", this.recoverForm.value.seed);
      this.storageService.setSessionData("private_key", this.private);
      this.storageService.setSessionData(
        "password",
        this.recoverForm.value.password
      );
      this.storageService.setSessionData("transactions", []);
      this.storageService.setSessionData("tokens", []);
      this.storageService.setSessionData("ethereum_accounts", []);
      this.storageService.setSessionData("cross_chain_swaps", []);

      this.authServ.saveKeyStore(
        this.private,
        this.recoverForm.value.password,
        this.recoverForm.value.seed
      );
      this.router.navigate(["/wallet/home"]); // improvements need to be made here but for now the auth guard should work just fine
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  onKey(event: any) {
    this.passwordStrength = this.passCheckService.checkPassword(event);
  }

  togglePanels() {
    this.activePane = this.activePane === 'left' ? 'right' : 'left';

    if(this.activePane === 'right') {
      // Init camera

    }
  }
}
