// Generated by dts-bundle v0.7.2

declare module 'BookKeeper' {
    import ACCOUNT_TYPE from 'BookKeeper/ACCOUNT_TYPE';
    import BankruptError from 'BookKeeper/BankruptError';
    import ChartOfAccounts from 'BookKeeper/ChartOfAccounts';
    import Period from 'BookKeeper/Period';
    export { ACCOUNT_TYPE, BankruptError, ChartOfAccounts, Period };
}

declare module 'BookKeeper/ACCOUNT_TYPE' {
    enum ACCOUNT_TYPE {
        DEBIT_NORMAL = 0,
        CREDIT_NORMAL = 1,
    }
    export default ACCOUNT_TYPE;
}

declare module 'BookKeeper/BankruptError' {
    import Period from 'BookKeeper/Period';
    export default class BankruptError extends Error {
        readonly period: Period;
        constructor(message: string, period: Period);
    }
}

declare module 'BookKeeper/ChartOfAccounts' {
    import SummaryAccount from 'BookKeeper/SummaryAccount';
    export default class ChartOfAccounts {
        readonly assets: SummaryAccount;
        readonly liabilities: SummaryAccount;
        readonly income: SummaryAccount;
        readonly expenses: SummaryAccount;
        readonly equity: SummaryAccount;
        readonly changesToEquity: SummaryAccount;
        readonly generalLedger: SummaryAccount;
        constructor();
        toString(): string;
    }
}

declare module 'BookKeeper/Period' {
    import BalanceSheet from 'BookKeeper/BalanceSheet';
    import ChartOfAccounts from 'BookKeeper/ChartOfAccounts';
    import IncomeStatement from 'BookKeeper/IncomeStatement';
    import { default as JournalEntry, JournalEntryItem } from 'BookKeeper/JournalEntry';
    import SubAccount from 'BookKeeper/SubAccount';
    export type closeFunction = () => void;
    export default class Period {
        readonly period: any;
        readonly coa: ChartOfAccounts;
        readonly journal: JournalEntry[];
        readonly autoClose: closeFunction;
        constructor(period: any, coa: ChartOfAccounts, autoClose?: closeFunction);
        close(closer?: closeFunction): void;
        readonly financialStatements: {
            balanceSheet: BalanceSheet;
            incomeStatement: IncomeStatement;
        };
        readonly isClosed: boolean;
        journalEntry(description: string, amount: number, debit: SubAccount, credit: SubAccount): void;
        compoundJournalEntry(description: string, debits: JournalEntryItem[], credits: JournalEntryItem[]): void;
        readonly balanceSheet: BalanceSheet;
        readonly incomeStatement: IncomeStatement;
        printJournal(): string;
        toString(): string;
    }
}

declare module 'BookKeeper/SummaryAccount' {
    import Account from 'BookKeeper/Account';
    import ACCOUNT_TYPE from 'BookKeeper/ACCOUNT_TYPE';
    import SubAccount from 'BookKeeper/SubAccount';
    export default class SummaryAccount extends Account {
        readonly name: string;
        readonly defaultSubAccountType: ACCOUNT_TYPE;
        readonly subAccounts: Account[];
        constructor(name: string, defaultSubAccountType: ACCOUNT_TYPE, subAccounts?: Account[]);
        readonly debits: number[];
        readonly credits: number[];
        readonly balance: number;
        subAccount(name: string, isSummary?: boolean, accountType?: ACCOUNT_TYPE): SummaryAccount | SubAccount;
        eachAccount(fun: (acct: Account) => any): void;
    }
}

declare module 'BookKeeper/BalanceSheet' {
    import ChartOfAccounts from 'BookKeeper/ChartOfAccounts';
    import { AccountSnapshot } from 'BookKeeper/Report';
    export default class BalanceSheet {
        readonly assets: AccountSnapshot;
        readonly liabilities: AccountSnapshot;
        readonly equity: AccountSnapshot;
        readonly netWorth: number;
        constructor(coa: ChartOfAccounts);
        toString(): string;
    }
}

declare module 'BookKeeper/IncomeStatement' {
    import ChartOfAccounts from 'BookKeeper/ChartOfAccounts';
    import { AccountSnapshot } from 'BookKeeper/Report';
    export default class IncomeStatement {
        readonly income: AccountSnapshot;
        readonly expenses: AccountSnapshot;
        readonly changesToEquity: AccountSnapshot;
        readonly netIncome: number;
        constructor(coa: ChartOfAccounts);
        toString(): string;
    }
}

declare module 'BookKeeper/JournalEntry' {
    import SubAccount from 'BookKeeper/SubAccount';
    export interface JournalEntryItem {
        amount: number;
        account: SubAccount;
    }
    export default class JournalEntry {
        readonly description: string;
        readonly debits: JournalEntryItem[];
        readonly credits: JournalEntryItem[];
        constructor(description: string, debits: JournalEntryItem[], credits: JournalEntryItem[]);
        print(maxLen?: number, decimals?: number, indent?: string): string;
        toString(): string;
    }
}

declare module 'BookKeeper/SubAccount' {
    import Account from 'BookKeeper/Account';
    export default class SubAccount extends Account {
        readonly debits: number[];
        readonly credits: number[];
        debit(amount: number): void;
        credit(amount: number): void;
        readonly balance: number;
    }
}

declare module 'BookKeeper/Account' {
    import ACCOUNT_TYPE from 'BookKeeper/ACCOUNT_TYPE';
    abstract class Account {
        readonly name: string;
        readonly accountType: ACCOUNT_TYPE;
        constructor(name: string, accountType: ACCOUNT_TYPE);
        readonly abstract debits: number[];
        readonly abstract credits: number[];
        readonly abstract balance: number;
        toString(): string;
        print(): string;
    }
    export default Account;
}

declare module 'BookKeeper/Report' {
    import Account from 'BookKeeper/Account';
    interface AccountSnapshot {
        name: string;
        balance: number;
        subAccounts: AccountSnapshot[];
        subAccountsByName: {
            [id: string]: AccountSnapshot;
        };
    }
    const formatCurrency: (amount: number) => string;
    const snapshotAccount: (acct: Account) => AccountSnapshot;
    const snapshotBalance: (name: string, balance: number) => AccountSnapshot;
    const formatSnapshots: (accts: {
        [id: string]: AccountSnapshot[];
    }) => {
        [id: string]: string[];
    };
    export { AccountSnapshot, snapshotAccount, snapshotBalance, formatSnapshots, formatCurrency };
}

