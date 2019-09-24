import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { EnvMode } from '@app/core/general/environment-service/environment.model';
import { SettingsService } from '@app/core/settings/settings.service';

@Component({
  selector: 'app-network-select',
  templateUrl: './network-select.component.html',
  styleUrls: ['./network-select.component.scss']
})
export class NetworkSelectComponent implements OnInit {
  enumEnvMode = EnvMode;
  liveMode = {mode: EnvMode.Live, text: ''};
  testMode = {mode: EnvMode.Test, text: ''};
  selectedMode;

  constructor(private environment: EnvironmentService,
    private translate: TranslateService,
    private settingsService: SettingsService)
  {
    this.liveMode.text = this.translate.instant('HEADER.NETWORK-SELECT.LIVE');
    this.testMode.text = this.translate.instant('HEADER.NETWORK-SELECT.TEST');
  }

  ngOnInit() {
    this.selectedMode = this.liveMode.mode === this.environment.getMode() ? this.liveMode : this.testMode;
  }

  onModeChange() {
    if(this.selectedMode.mode !== this.environment.getMode()) {
      this.environment.setMode(this.selectedMode.mode);
      const systemSettings = {
        aerumNodeWsURI: this.environment.get().WebsocketProvider,
        aerumNodeRpcURI: this.environment.get().rpcApiProvider,
        ethereumNodeURI: this.environment.get().ethereum.endpoint
      };
      this.settingsService.saveSettings('systemSettings', systemSettings);
      window.location.href = '';
    }
  }
}
