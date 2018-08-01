import { QrScannerVideoComponent } from './components/qr-scanner-video/qr-scanner-video.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FromToAvatarComponent } from './components/from-to-avatar/from-to-avatar.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './components/error404/error404.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { I18nComponent } from './components/i18n/i18n.component';
import { DividerComponent } from './components/divider/divider.component';
import { TranslatePipe, TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AddressClipboardComponent } from './components/address-clipboard/address-clipboard.component';
import { EqualValidator } from './directives/equal-validator.directive';
import { SidebarHeaderComponent } from '@app/shared/components/sidebar-header/sidebar-header.component';
import { TransactionTimeAgoPipe } from '@shared/pipes/transaction-time-ago.pipe';
import { TransactionTimeStampPipe } from '@shared/pipes/transaction-time-stamp.pipe';
import { HexToTextPipe } from '@shared/pipes/hex-to-text.pipe';
import { SafeResourceUrlPipe } from '@shared/pipes/safeResourceUrl.pipe';
import { SafeUrlPipe } from '@shared/pipes/safeUrl.pipe';
import { SafeHTMLPipe } from '@shared/pipes/safeHTML.pipe';
import { GenerateAvatarPipe } from '@app/shared/pipes/generate-avatar.pipe';
import { OrderbyPipe } from '@shared/pipes/orderby.pipe';
import { ConvertToEtherPipe } from '@shared/pipes/convertToEther.pipe';
import { HextoAsciiPipe } from '@shared/pipes/hextoAscii.pipe';
import { HextoDecimalPipe } from '@shared/pipes/hextoDecimal.pipe';
import { BigNumbersPipe } from '@shared/pipes/big-numbers.pipe';
import { GetBlockSignerPipe } from '@shared/pipes/get-block-signer.pipe';
import { TruncatePipe } from '@app/shared/pipes/truncate.pipe';
import { DecimalPipe } from '@angular/common';
import { AppUIModule } from '@app/app.ui.module';
import { SidebarAccountSelectComponent } from '@shared/components/sidebar-account-select/sidebar-account-select.component';
import { ChartComponent } from '@app/shared/components/chart/chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { WeiToGweiPipe } from '@app/shared/pipes/wei-to-gwei.pipe';
import { CropAddressPipe } from '@app/shared/pipes/crop-address.pipe';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../assets/i18n/', '.json');
}

import { FormsModule } from '@angular/forms';
import { AddTokenComponent } from '@app/external/ethereum-wallet/add-token/add-token.component';
import { LinkClipboardComponent } from '@app/shared/components/link-clipboard/link-clipboard.component';
import { ImportWalletBoxComponent } from '@app/shared/components/import-wallet-box/import-wallet-box.component';
import { QrScannerComponent } from '@app/shared/components/qr-scanner/qr-scanner.component';

@NgModule({
  entryComponents: [
    FromToAvatarComponent
  ],
  imports: [
    CommonModule,
    AppUIModule,
    FormsModule,
    NgxEchartsModule,
    TranslateModule,
    ZXingScannerModule
  ],
  declarations: [
    I18nComponent,
    Error404Component,
    DividerComponent,
    EqualValidator,
    SidebarHeaderComponent,
    TransactionTimeAgoPipe,
    TransactionTimeStampPipe,
    HexToTextPipe,
    SafeResourceUrlPipe,
    SafeUrlPipe,
    SafeHTMLPipe,
    GenerateAvatarPipe,
    OrderbyPipe,
    ConvertToEtherPipe,
    HextoAsciiPipe,
    GetBlockSignerPipe,
    HextoDecimalPipe,
    SidebarAccountSelectComponent,
    TruncatePipe,
    WeiToGweiPipe,
    ChartComponent,
    CropAddressPipe,
    LoaderComponent,
    BigNumbersPipe,
    AddressClipboardComponent,
    AddTokenComponent,
    FromToAvatarComponent,
    LinkClipboardComponent,
    ImportWalletBoxComponent,
    QrScannerComponent,
    QrScannerVideoComponent
  ],
  providers: [DecimalPipe],
  exports:[
    I18nComponent,
    DividerComponent,
    LoaderComponent,
    TranslateModule,
    EqualValidator,
    SidebarHeaderComponent,
    TransactionTimeAgoPipe,
    TransactionTimeStampPipe,
    HexToTextPipe,
    GetBlockSignerPipe,
    SafeResourceUrlPipe,
    SafeUrlPipe,
    SafeHTMLPipe,
    GenerateAvatarPipe,
    OrderbyPipe,
    ConvertToEtherPipe,
    HextoAsciiPipe,
    HextoDecimalPipe,
    TruncatePipe,
    WeiToGweiPipe,
    SidebarAccountSelectComponent,
    ChartComponent,
    NgxEchartsModule,
    CropAddressPipe,
    BigNumbersPipe,
    AddressClipboardComponent,
    AddTokenComponent,
    FromToAvatarComponent,
    LinkClipboardComponent,
    ImportWalletBoxComponent,
    QrScannerComponent,
    QrScannerVideoComponent
  ]
})

export class SharedModule {
}
