import { iTransaction } from "@app/shared/app.interfaces";

export class TransactionModalData {
    hash?: string;
    transaction?: iTransaction;
    external?: boolean;
    urls?: any;
    orderId: string;
  }
