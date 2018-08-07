import { PendingTransactionsService } from './transactions/pending-transactions/pending-transactions.service';
import { QrScannerService } from './general/qr-scanner/qr-scanner.service';
import { AddressKeyValidationService } from './validation/address-key-validation.service';
import { AuthenticationGuard } from './authentication/auth-guards/authentication.guard';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { AensFixedPriceRegistrarContractService } from '@app/core/aens/aens-fixed-price-registrar-contract-service/aens-fixed-price-registrar-contract.service';
import { AensPublicResolverContractService } from '@app/core/aens/aens-public-resolver-contract-service/aens-public-resolver-contract.service';
import { AensRegistryContractService } from '@app/core/aens/aens-registry-contract-service/aens-registry-contract.service';
import { AeroToErc20SwapService } from '@app/core/swap/on-chain/aero-to-erc20-swap-service/aero-to-erc20-swap.service';
import { Erc20ToAeroSwapService } from '@app/core/swap/on-chain/erc20-to-aero-swap-service/erc20-to-aero-swap.service';
import { Erc20ToErc20SwapService } from '@app/core/swap/on-chain/erc20-to-erc20-swap-service/erc20-to-erc20-swap.service';
import { ERC20TokenService } from '@app/core/swap/on-chain/erc20-token-service/erc20-token.service';
import { AccountIdleService } from '@app/core/authentication/account-idle-service/account-idle.service';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { ContractExecutorService } from '@app/core/contract/contract-executor-service/contract-executor.service';
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { RouteDataService } from '@app/core/general/route-data-service/route-data.service';
import { PasswordCheckerService } from '@app/core/authentication/password-checker-service/password-checker.service';
import { ExplorerService } from '@app/core/explorer/explorer-service/explorer.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';
import { AerumStatsService } from '@app/core/stats/aerum-stats-service/aerum-stats.service';
import { AerumStatsWebsocketsService } from '@app/core/stats/aerum-stats-websockets-service/aerum-stats-websockets.service';
import { LoggerService } from '@app/core/general/logger-service/logger.service';
import { LoaderService } from '@app/core/general/loader-service/loader.service';
import { ValidateService } from '@app/core/validation/validate.service';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { ConnectionCheckerService } from '@core/general/connection-checker-service/connection-checker.service';
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
import { OpenErc20SwapService } from "@core/swap/cross-chain/open-erc20-swap-service/open-erc20-swap.service";
import { OpenAerumErc20SwapService } from "@core/swap/cross-chain/open-aerum-erc20-swap-service/open-aerum-erc20-swap.service";
import { CounterAerumErc20SwapService } from "@core/swap/cross-chain/counter-aerum-erc20-swap-service/counter-aerum-erc20-swap.service";
import { CounterEtherSwapService } from "@core/swap/cross-chain/counter-ether-swap-service/counter-ether-swap.service";
import { CounterErc20SwapService } from "@core/swap/cross-chain/counter-erc20-swap-service/counter-erc20-swap.service";
import { SwapTemplateService } from "@core/swap/cross-chain/swap-template-service/swap-template.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { SettingsBackupService } from '@app/core/settings/settingsBackup.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from "@core/general/storage-service/storage.service";
import { SwapListService as OnChainSwapListService } from "@core/swap/on-chain/swap-list-service/swap-list.service";
import { SwapListService as CrossChainSwapListService } from "@core/swap/cross-chain/swap-list-service/swap-list.service";
import { CreateSwapService } from '@app/core/swap/on-chain/create-swap-service/create-swap.service';
import { LoadSwapService } from '@app/core/swap/on-chain/load-swap-service/load-swap.service';
import { ImportWalletService } from '@app/core/transactions/import-wallet-service/import-wallet.service';
import { GlobalEventService } from "@core/general/global-event-service/global-event.service";
import { StakingAerumService } from "@core/staking/staking-aerum-service/staking-aerum.service";
import { StakingGovernanceService } from "@core/staking/staking-governance-service/staking-governance.service";
import { MobileQrScannerService } from "@app/core/general/mobile-qr-scanner/mobile-qr-scanner.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ContractExecutorService,
    EthereumContractExecutorService,
    InjectedWeb3ContractExecutorService,
    AccountIdleService,
    ClipboardService,
    ExplorerService,
    ModalService,
    RouteDataService,
    TokenService,
    TransactionService,
    AerumStatsService,
    AerumStatsWebsocketsService,
    AerumNameService,
    AensFixedPriceRegistrarContractService,
    AensPublicResolverContractService,
    AensRegistryContractService,
    AeroToErc20SwapService,
    Erc20ToAeroSwapService,
    Erc20ToErc20SwapService,
    ERC20TokenService,
    PasswordCheckerService,
    LoggerService,
    ValidateService,
    OpenEtherSwapService,
    OpenErc20SwapService,
    OpenAerumErc20SwapService,
    CounterAerumErc20SwapService,
    CounterEtherSwapService,
    CounterErc20SwapService,
    SwapTemplateService,
    SwapLocalStorageService,
    SettingsBackupService,
    SettingsService,
    OnChainSwapListService,
    CrossChainSwapListService,
    CreateSwapService,
    LoadSwapService,
    AuthenticationGuard,
    GlobalEventService,
    StakingAerumService,
    StakingGovernanceService,
    AddressKeyValidationService,
    ImportWalletService,
    QrScannerService,
    GlobalEventService,
    MobileQrScannerService
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        LoaderService,
        ConnectionCheckerService,
        InternalNotificationService,
        NotificationMessagesService,
        AuthenticationService,
        EthereumAuthenticationService,
        EthereumTokenService,
        TranslateService,
        StorageService,
        PendingTransactionsService
      ]
    };
  }
}
