import { Injectable } from '@angular/core';
import { LoggerService } from '@app/core/general/logger-service/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { NotificationService, DialogResult } from '@aerum/ui';
import { SwapListService } from '@app/core/swap/on-chain/swap-list-service/swap-list.service';
import { ERC20TokenService } from '@app/core/swap/on-chain/erc20-token-service/erc20-token.service';
import { AeroToErc20SwapService } from '@app/core/swap/on-chain/aero-to-erc20-swap-service/aero-to-erc20-swap.service';
import { Erc20ToAeroSwapService } from '@app/core/swap/on-chain/erc20-to-aero-swap-service/erc20-to-aero-swap.service';
import { Erc20ToErc20SwapService } from '@app/core/swap/on-chain/erc20-to-erc20-swap-service/erc20-to-erc20-swap.service';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { CreateSwapModalContext } from '@app/wallet/swap/components/create-swap/create-swap.component';
import { toBigNumberString } from '@app/shared/helpers/number-utils';
import { EnvironmentService } from "@core/general/environment-service/environment.service";

@Injectable()
export class CreateSwapService {

    constructor(private logger: LoggerService,
        private translateService: TranslateService,
        private authService: AuthenticationService,
        private internalNotificationService: InternalNotificationService,
        private notificationService: NotificationService,
        private swapListService: SwapListService,
        private erc20TokenService: ERC20TokenService,
        private aeroToErc20SwapService: AeroToErc20SwapService,
        private erc20ToAeroSwapService: Erc20ToAeroSwapService,
        private erc20ToErc20SwapService: Erc20ToErc20SwapService,
        private modalService: ModalService,
        private aensService: AerumNameService,
        private environment: EnvironmentService) { }

    async createSwap() {
        const swapCreateResponse = await this.modalService.openSwapCreate();

        if (swapCreateResponse.dialogResult === DialogResult.OK) {
            const confirmResponse = await this.modalService.openSwapCreateConfirm(swapCreateResponse.result);

            if (confirmResponse.dialogResult === DialogResult.Cancel) {
                this.logger.logMessage('Swap creation canceled');
                return;
            }

            this.notificationService.notify(this.translateService.instant('SWAP.CREATE.SWAP_CREATION_IN_PROGRESS'), `${this.translateService.instant('SWAP.CREATE.SWAP_ID_')} ${swapCreateResponse.result.swapId}`, 'aerum', 3000);
            await this.createSwapBasedOnMode(swapCreateResponse.result);
            this.notificationService.notify(this.translateService.instant('SWAP.CREATE.SWAP_CREATED'), `${this.translateService.instant('SWAP.CREATE.SWAP_ID_')} ${swapCreateResponse.result.swapId}`, 'aerum');
        }
    }

    private async createSwapBasedOnMode(data: CreateSwapModalContext) {
        if (data.mode === 'aero_to_erc20') {
            await this.createAeroToErc20Swap(data);
        } else if (data.mode === 'erc20_to_aero') {
            await this.createErc20ToAeroSwap(data);
        } else if (data.mode === 'erc20_to_erc20') {
            await this.createErc20ToErc20Swap(data);
        } else {
            throw new Error(`Unknown swap mode: ${data.mode}`);
        }
    }

    private async createAeroToErc20Swap(data: CreateSwapModalContext) {
        const counterpartyTokenAmount = this.getCounterpartyTokenAmountIncludingDecimals(data);
        await this.aeroToErc20SwapService.openSwap(
            data.swapId,
            toBigNumberString(data.tokenAmount),
            toBigNumberString(counterpartyTokenAmount),
            await this.aensService.safeResolveNameOrAddress(data.counterpartyAddress),
            data.counterpartyToken.address
        );
    }

    private async createErc20ToAeroSwap(data: CreateSwapModalContext) {
        const tokenAmount = this.getTokenAmountIncludingDecimals(data);
        await this.ensureAllowance(data.token.address, this.environment.get().contracts.swap.address.Erc20ToAero, tokenAmount, data);
        await this.erc20ToAeroSwapService.openSwap(
            data.swapId,
            toBigNumberString(tokenAmount),
            data.token.address,
            toBigNumberString(data.counterpartyTokenAmount),
            await this.aensService.safeResolveNameOrAddress(data.counterpartyAddress),
        );
    }

    private async createErc20ToErc20Swap(data: CreateSwapModalContext) {
        const tokenAmount = this.getTokenAmountIncludingDecimals(data);
        const counterpartyTokenAmount = this.getCounterpartyTokenAmountIncludingDecimals(data);
        await this.ensureAllowance(data.token.address, this.environment.get().contracts.swap.address.Erc20ToErc20, tokenAmount, data);
        await this.erc20ToErc20SwapService.openSwap(
            data.swapId,
            toBigNumberString(tokenAmount),
            data.token.address,
            toBigNumberString(counterpartyTokenAmount),
            await this.aensService.safeResolveNameOrAddress(data.counterpartyAddress),
            data.counterpartyToken.address
        );
    }

    private getTokenAmountIncludingDecimals(data: CreateSwapModalContext) {
        return Number(data.tokenAmount) * Math.pow(10, Number(data.token.decimals));
    }

    private getCounterpartyTokenAmountIncludingDecimals(data: CreateSwapModalContext) {
        return Number(data.counterpartyTokenAmount) * Math.pow(10, Number(data.counterpartyToken.decimals));
    }

    private async ensureAllowance(tokenContractAddress: string, spender: string, amount: number, data: CreateSwapModalContext) {
        const allowance = await this.erc20TokenService.allowance(tokenContractAddress, data.currentAddress, spender);
        if (Number(allowance) < amount) {
            this.logger.logMessage(`Allowance value: ${allowance}. Needed: ${amount}`);
            await this.erc20TokenService.approve(tokenContractAddress, spender, toBigNumberString(amount));
        }
    }
}
