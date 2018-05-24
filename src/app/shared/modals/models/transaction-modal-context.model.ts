import { iTransaction } from "@app/shared/app.interfaces";

export interface TransactionModalContext {
    hash?: string;
    transaction?: iTransaction;
    external?: boolean;
    urls?: any;
  }