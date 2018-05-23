import { iTransaction } from "@app/shared/app.interfaces";

export class TransactionListModel {
    public transactions: iTransaction[] = [];
    public lowBlock: number;
    public highBlock: number;
}