import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ModalService } from '@app/core/modal-service/modal.service';
import { RouteDataService } from '@app/core/route-data-service/route-data.service';
import { ClipboardService } from '@app/core/clipboard-service/clipboard.service'; 
import { AccountIdleService } from '@app/core/account-idle-service/account-idle.service';
import { AuthenticationService } from '@app/core/authentication-service/authentication.service';
import { TransactionService } from '@app/core/transaction-service/transaction-service.service';
import { ExplorerService } from '@app/core/explorer-service/explorer.service';
import { TokenService } from '@app/core/token-service/token.service'; 
import { InternalNotificationService } from '@app/core/internal-notification-service/internal-notification.service';
import { CanActivateAccountAuthGuard } from '@app/core/auth-guards/can-activate-account.guard';
import { CanActivateViaAuthGuard } from '@app/core/auth-guards/can-activate-auth.guard';
import { AerumStatsService } from '@app/core/aerum-stats-service/aerum-stats.service';
import { AerumStatsWebsocketsService } from '@app/core/aerum-stats-websockets-service/aerum-stats-websockets.service';

@NgModule({
  imports: [
    CommonModule
  ], 
  providers: [
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
    AerumStatsWebsocketsService
  ],
})
export class CoreModule { }
