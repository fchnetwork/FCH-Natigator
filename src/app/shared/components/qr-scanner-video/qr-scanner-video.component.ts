import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from "@angular/core";
import { RouteDataService } from "@app/core/general/route-data-service/route-data.service";

@Component({
  selector: "app-qr-scanner-video",
  templateUrl: "./qr-scanner-video.component.html",
  styleUrls: ["./qr-scanner-video.component.scss"]
})
export class QrScannerVideoComponent implements OnInit, OnDestroy {
  @Input()errorMessage: string;
  @ViewChild("scanner") scanner: any;
  hasCameras = false;
  hasPermission = false;
  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  @Output() codeScanned = new EventEmitter<string>();

  constructor() {}

  ngOnDestroy() {
    this.scanner.resetScan();
  }

  ngOnInit(): void {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;
      this.availableDevices = devices;
      this.selectedDevice = devices[0];
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
    this.codeScanned.emit(resultString);
  }
}
