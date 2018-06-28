import { Component, OnInit, ViewChild, Output, EventEmitter } from "@angular/core";
import { RouteDataService } from "@app/core/general/route-data-service/route-data.service";

@Component({
  selector: "app-qr-code-scanner",
  templateUrl: "./qr-code-scanner.component.html",
  styleUrls: ["./qr-code-scanner.component.scss"]
})
export class QrCodeScannerComponent implements OnInit {
  @ViewChild("scanner") scanner: any;
  hasCameras = false;
  hasPermission = false;
  isValidSeedQr = true;
  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  @Output() codeScanned = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;
      this.availableDevices = devices;
      this.selectedDevice = devices[0];

      // selects the devices's back camera by default
      // for (const device of devices) {
      //     if (/back|rear|environment/gi.test(device.label)) {
      //         this.scanner.changeDevice(device);
      //         this.selectedDevice = device;
      //         break;
      //     }
      // }
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error(
        "An error has occurred when trying to enumerate your video-stream-enabled devices."
      );
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  handleQrCodeResult(resultString: string) {
    if(resultString && resultString.split(' ').length !== 12) {
      this.isValidSeedQr = false;
      return;
    }

    this.codeScanned.emit(resultString);
  }
}
