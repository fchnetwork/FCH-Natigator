import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './components/error404/error404.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { I18nComponent } from './components/i18n/i18n.component';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap'; 
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
import { TruncatePipe } from '@app/shared/pipes/truncate.pipe';
import { DecimalPipe } from '@angular/common';

import { AppUIModule } from '@app/app.ui.module';
import { SidebarAccountSelectComponent } from '@shared/components/sidebar-account-select/sidebar-account-select.component';
import { ChartComponent } from '@app/shared/components/chart/chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { WeiToGweiPipe } from '@app/shared/pipes/wei-to-gwei.pipe';
import { CropAddressPipe } from '@app/shared/pipes/crop-address.pipe';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { TransactionModalComponent } from '@app/shared/modals/transaction-modal/transaction-modal.component';
import { GetBlockModalComponent } from '@app/shared/modals/get-block-modal/get-block-modal.component';
import { BlockModalComponent } from '@app/shared/modals/block-modal/block-modal.component';
import { TransactionSignModalComponent } from '@app/shared/modals/transaction-sign-modal/transaction-sign-modal.component';
import { FormsModule } from '@angular/forms';

import { AddTokenComponent } from '@app/external/ethereum-wallet/add-token/add-token.component';
 
const modalWindows = [
  TransactionModalComponent,
  GetBlockModalComponent,
  BlockModalComponent,
  TransactionSignModalComponent  
];

@NgModule({
  entryComponents: [
    modalWindows
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    AppUIModule,
    BootstrapModalModule,
    FormsModule, 
    NgxEchartsModule,
    TranslateModule
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
    HextoDecimalPipe,
    SidebarAccountSelectComponent,
    TruncatePipe,
    WeiToGweiPipe,
    ChartComponent,
    CropAddressPipe,
    LoaderComponent,
    modalWindows,
    BigNumbersPipe,
    AddressClipboardComponent,
    AddTokenComponent
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
    AddTokenComponent
  ]
})

export class SharedModule { 
}
