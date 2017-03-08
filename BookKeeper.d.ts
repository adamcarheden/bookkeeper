// Generated by dts-bundle v0.7.2

declare module 'BookKeeper' {
    import ChartOfAccounts from 'BookKeeper/ChartOfAccounts';
    import Period from 'BookKeeper/Period';
    import BankruptError from 'BookKeeper/BankruptError';
    import ACCOUNT_TYPE from 'BookKeeper/ACCOUNT_TYPE';
    var _default: {
        ChartOfAccounts: typeof ChartOfAccounts;
        Period: typeof Period;
        BankruptError: typeof BankruptError;
        ACCOUNT_TYPE: typeof ACCOUNT_TYPE;
    };
    export default _default;
}

declare module 'BookKeeper/ChartOfAccounts' {
    import Account from 'BookKeeper/Account';
    export default class ChartOfAccounts {
        readonly generalLedger: Account;
        readonly assets: Account;
        readonly liabilities: Account;
        readonly income: Account;
        readonly expenses: Account;
        readonly equity: Account;
        constructor();
        toString(): string;
    }
}

declare module 'BookKeeper/Period' {
    import ChartOfAccounts from 'BookKeeper/ChartOfAccounts';
    import Account from 'BookKeeper/Account';
    import { default as JournalEntry, JournalEntryItem } from 'BookKeeper/JournalEntry';
    import IncomeStatement from 'BookKeeper/IncomeStatement';
    import BalanceSheet from 'BookKeeper/BalanceSheet';
    import FinancialStatements from 'BookKeeper/FinancialStatements';
    export type closeFunction = () => void;
    export default class Period {
        readonly period: any;
        readonly coa: ChartOfAccounts;
        journal: JournalEntry[];
        autoClose: closeFunction;
        closed: boolean;
        financialStatements: FinancialStatements;
        constructor(period: any, coa: ChartOfAccounts, autoClose?: closeFunction);
        close(closer: closeFunction): void;
        journalEntry(description: string, amount: number, debit: Account, credit: Account): void;
        journalEntryComplex(description: string, debits: JournalEntryItem[], credits: JournalEntryItem[]): void;
        readonly balanceSheet: BalanceSheet;
        readonly incomeStatement: IncomeStatement;
        printJournal(): string;
        toString(): string;
    }
}

declare module 'BookKeeper/BankruptError' {
    import Period from 'BookKeeper/Period';
    export default class BankruptError extends Error {
        readonly period: Period;
        constructor(message: string, period: Period);
    }
}

declare module 'BookKeeper/ACCOUNT_TYPE' {
    enum ACCOUNT_TYPE {
        DEBIT_NORMAL = 0,
        CREDIT_NORMAL = 1,
    }
    export default ACCOUNT_TYPE;
}

declare module 'BookKeeper/Account' {
    import ACCOUNT_TYPE from 'BookKeeper/ACCOUNT_TYPE';
    export default class Account {
        readonly name: string;
        readonly accountType: ACCOUNT_TYPE;
        readonly subAccounts: Account[];
        constructor(name: string, accountType: ACCOUNT_TYPE);
        debit(amount: number): void;
        readonly debits: number[];
        readonly debit_total: number;
        credit(amount: number): void;
        readonly credits: number[];
        readonly credit_total: number;
        subAccount(name: string, accountType?: ACCOUNT_TYPE): Account;
        readonly balance: number;
        readonly statement: any;
        print(prefix?: string, indent?: string): string;
        toString(): string;
    }
}

declare module 'BookKeeper/JournalEntry' {
    import Account from 'BookKeeper/Account';
    export interface JournalEntryItem {
        amount: number;
        account: Account;
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

declare module 'BookKeeper/IncomeStatement' {
    import ChartOfAccounts from 'BookKeeper/ChartOfAccounts';
    import Report from 'BookKeeper/Report';
    export default class IncomeStatement extends Report {
        constructor(coa: ChartOfAccounts);
        readonly netIncome: number;
        toString(): string;
    }
}

declare module 'BookKeeper/BalanceSheet' {
    import ChartOfAccounts from 'BookKeeper/ChartOfAccounts';
    import Report from 'BookKeeper/Report';
    export default class BalanceSheet extends Report {
        constructor(coa: ChartOfAccounts);
        readonly netWorth: number;
        toString(): string;
    }
}

declare module 'BookKeeper/FinancialStatements' {
    import IncomeStatement from 'BookKeeper/IncomeStatement';
    import BalanceSheet from 'BookKeeper/BalanceSheet';
    export default class FinancialStatements {
        readonly incomeStatement: IncomeStatement;
        readonly balanceSheet: BalanceSheet;
        constructor(incomeStatement: IncomeStatement, balanceSheet: BalanceSheet);
    }
}

declare module 'BookKeeper/Report' {
    import Account from 'BookKeeper/Account';
    interface lineItem {
        name: string;
        balance: number;
    }
    let printReport: (items: lineItem[]) => string;
    abstract class Report {
        readonly balance: number;
        readonly subAccounts: {
            [id: string]: Account;
        };
        constructor(balance: number, accts: Account[]);
        print(summary?: string): string;
        toString(): string;
    }
    export { Report as default, lineItem, printReport };
}

