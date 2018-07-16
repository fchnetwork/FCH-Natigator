import { Component, OnInit } from '@angular/core';
import { RegistrationRouteData } from '../models/RegistrationRouteData';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { RouteDataService } from '@app/core/general/route-data-service/route-data.service';

@Component({
  selector: 'app-backup-confirm',
  templateUrl: './backup-confirm.component.html',
  styleUrls: ['./backup-confirm.component.scss']
})
export class BackupConfirmComponent implements OnInit {
  seed = [];
  shuffledSeed : any[];
  selectedSeeds : any[];
  isEqual = false;

  constructor(private routeDataService: RouteDataService<RegistrationRouteData>,
              private router: Router,
              private authService: AuthenticationService) {

    if (!routeDataService.hasData()) {
      router.navigate(['account/register']);
    }
  }

  ngOnInit() {
    this.seed = this.routeDataService.routeData.mnemonic.split(' ');
    this.initializeSeedArrays();
  }

  confirm() {
    const data = this.routeDataService.routeData;
    this.authService.saveKeyStore( data.privateKey, data.password, this.seed);
    this.router.navigateByUrl(data.returnUrl);
    this.routeDataService.clear();
  }

  clear() {
    this.initializeSeedArrays();
  }

  private initializeSeedArrays() {
    this.shuffledSeed = this.shuffleArray(this.seed.slice()).map(x => ({ name: x, selected: false }));
    this.selectedSeeds = [];
  }

  private selectSeed(seed:any) {
    if(seed.selected) {
      return;
    }

    this.selectedSeeds.push(seed);
    seed.selected = true;

    if(this.shuffledSeed.length == this.selectedSeeds.length) {
      this.compareResult();
    }
  }

  private deselectSeed(seed: any, idx: number) {
		seed.selected = false;
    this.selectedSeeds.splice(idx, 1);

    this.compareResult();
	}

  private compareResult() {
		if (this.selectedSeeds.map(x => x.name).toString() === this.seed.toString()) {
			this.isEqual = true;
		} else {
			this.isEqual = false;
		}
	}

  private shuffleArray(arr) {
		for (let c = arr.length - 1; c > 0; c--) {
			const b = Math.floor(Math.random() * (c + 1));
			const a = arr[c];
			arr[c] = arr[b];
			arr[b] = a;
		}
		return arr;
	}
}
