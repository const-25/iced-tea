export interface TransactionAmount {
    amount: string,
    currency: string,
}

export interface IncomingTransaction {
    userId: string,
    transactionId: string,
    valueDate: string,
    transactionAmount: TransactionAmount,
    remittanceInformationUnstructured: string,
};

export interface Transaction {
    userId: string,
    transactionId: string,
    valueDate: Date,
    amountInMinorUnit: number,
    currency: string,
    remittanceInformationUnstructured: string,
};