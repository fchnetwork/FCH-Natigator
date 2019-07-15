import { Component } from '@angular/core';
import { SettingsService } from '@app/core/settings/settings.service';

@Component({
  selector: 'app-derivation-path',
  templateUrl: './derivation-path.component.html',
  styleUrls: ['./derivation-path.component.scss']
})
export class DerivationPathComponent {
  activeDerivation: string;

  constructor(private settingsService: SettingsService) {
    const settings = this.settingsService.getSettings();
    this.activeDerivation = settings.generalSettings.derivationPath;
  }
}
