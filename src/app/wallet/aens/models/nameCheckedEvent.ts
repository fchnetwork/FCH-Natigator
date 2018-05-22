import { CheckStatus } from "@core/aens/aerum-name-service/check-status.enum";

export class NameCheckedEvent {
  constructor(readonly name: string, readonly status: CheckStatus) { }
}
