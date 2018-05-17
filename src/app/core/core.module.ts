import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';    
import { AerumNameService } from '@app/core/aens/aerum-name.service';
import { AensFixedPriceRegistrarContractService } from '@app/core/aens/aens-fixed-price-registrar-contract.service';
import { AensPublicResolverContractService } from '@app/core/aens/aens-public-resolver-contract.service';
import { AensRegistryContractService } from '@app/core/aens/aens-registry-contract.service';
import { AeroToErc20SwapService } from '@app/core/swap/aero-to-erc20-swap.service';
import { Erc20ToAeroSwapService } from '@app/core/swap/erc20-to-aero-swap.service';
import { Erc20ToErc20SwapService } from '@app/core/swap/erc20-to-erc20-swap.service';
import { ERC20TokenService } from '@app/core/swap/erc20-token.service';
import { AccountIdleService } from '@app/core/authentication/account-idle-service/account-idle.service';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { CanActivateAccountAuthGuard } from '@app/core/authentication/auth-guards/can-activate-account.guard';
import { CanActivateViaAuthGuard } from '@app/core/authentication/auth-guards/can-activate-auth.guard';
import { BaseContractService } from '@app/core/contract/base-contract-service';
import { ContractExecutorService } from '@app/core/contract/contract-executor.service';
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
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule
  ], 
  providers: [
    ContractExecutorService, 
    AccountIdleService,
    AuthenticationService,    
    ClipboardService,
    ExplorerService,
    ModalService,
    InternalNotificationService,
    RouteDataService,
    TokenService,
    TransactionService,
    CanActivateAccountAuthGuard,
    CanActivateViaAuthGuard,
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
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderService,
      multi: true
    }
  ],
})
export class CoreModule { }
