(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("BookKeeper", [], factory);
	else if(typeof exports === 'object')
		exports["BookKeeper"] = factory();
	else
		root["BookKeeper"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ChartOfAccounts_1 = __webpack_require__(1);
	var Period_1 = __webpack_require__(7);
	var BankruptError_1 = __webpack_require__(11);
	var ACCOUNT_TYPE_1 = __webpack_require__(5);
	exports.default = {
	    ChartOfAccounts: ChartOfAccounts_1.default,
	    Period: Period_1.default,
	    BankruptError: BankruptError_1.default,
	    ACCOUNT_TYPE: ACCOUNT_TYPE_1.default,
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var SummaryAccount_1 = __webpack_require__(2);
	var ACCOUNT_TYPE_1 = __webpack_require__(5);
	var Report_1 = __webpack_require__(6);
	var ChartOfAccounts = (function () {
	    function ChartOfAccounts() {
	        // https://en.wikipedia.org/wiki/Normal_balance
	        this.assets = new SummaryAccount_1.default('Assets', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	        this.liabilities = new SummaryAccount_1.default('Liabilities', ACCOUNT_TYPE_1.default.CREDIT_NORMAL);
	        this.equity = new SummaryAccount_1.default('Equity', ACCOUNT_TYPE_1.default.CREDIT_NORMAL);
	        this.income = new SummaryAccount_1.default('Income', ACCOUNT_TYPE_1.default.CREDIT_NORMAL);
	        this.expenses = new SummaryAccount_1.default('Expenses', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	        this.contraEquity = new SummaryAccount_1.default('Contra Equity', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	        this.generalLedger = new SummaryAccount_1.default('GeneralLedger', ACCOUNT_TYPE_1.default.DEBIT_NORMAL, [
	            this.assets,
	            this.liabilities,
	            this.equity,
	            this.income,
	            this.expenses,
	            this.contraEquity,
	        ]);
	    }
	    ChartOfAccounts.prototype.toString = function () {
	        var report = Report_1.formatSnapshots({ gl: [Report_1.snapshotAccount(this.generalLedger)] });
	        return report.gl.join("\n");
	    };
	    return ChartOfAccounts;
	}());
	exports.default = ChartOfAccounts;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Account_1 = __webpack_require__(3);
	var SubAccount_1 = __webpack_require__(4);
	var SummaryAccount = (function (_super) {
	    __extends(SummaryAccount, _super);
	    function SummaryAccount(name, defaultSubAccountType, subAccounts) {
	        if (subAccounts === void 0) { subAccounts = []; }
	        var _this = _super.call(this, name, defaultSubAccountType) || this;
	        _this.name = name;
	        _this.defaultSubAccountType = defaultSubAccountType;
	        _this.subAccounts = subAccounts;
	        return _this;
	    }
	    Object.defineProperty(SummaryAccount.prototype, "debits", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc.concat(subAcct.debits);
	            }, []);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SummaryAccount.prototype, "credits", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc.concat(subAcct.credits);
	            }, []);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SummaryAccount.prototype, "balance", {
	        get: function () {
	            var _this = this;
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc + ((subAcct instanceof SubAccount_1.default && subAcct.accountType !== _this.accountType) ? -subAcct.balance : subAcct.balance);
	            }, 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SummaryAccount.prototype.subAccount = function (name, accountType) {
	        if (accountType === void 0) { accountType = this.accountType; }
	        var sub = new SubAccount_1.default(name, accountType);
	        this.subAccounts.push(sub);
	        return sub;
	    };
	    return SummaryAccount;
	}(Account_1.default));
	exports.default = SummaryAccount;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Account = (function () {
	    function Account(name, accountType) {
	        this.name = name;
	        this.accountType = accountType;
	    }
	    Account.prototype.toString = function () {
	        return this.name + "\t$" + this.balance.toFixed(2);
	    };
	    Account.prototype.print = function () {
	        var maxWidth = 0;
	        var debits = [];
	        var balance = this.balance.toFixed(2);
	        for (var i = 0; i < this.debits.length; i++) {
	            var e = "" + this.debits[i].toFixed(2);
	            maxWidth = Math.max(maxWidth, e.length);
	            debits.push(e);
	        }
	        var credits = [];
	        for (var i = 0; i < this.credits.length; i++) {
	            var e = "" + this.credits[i].toFixed(2);
	            maxWidth = Math.max(maxWidth, e.length);
	            credits.push(e);
	        }
	        maxWidth = Math.max(balance.length, maxWidth);
	        var pad = '';
	        while (pad.length < maxWidth)
	            pad += ' ';
	        var ledger = 'Debits:\n';
	        for (var i = 0; i < debits.length; i++) {
	            ledger += "\t$" + (pad + debits[i]).slice(-maxWidth) + "\n";
	        }
	        ledger += 'Credits:\n';
	        for (var i = 0; i < credits.length; i++) {
	            ledger += "\t$" + (pad + credits[i]).slice(-maxWidth) + "\n";
	        }
	        ledger += 'Balance:\n';
	        ledger += "\t$" + (pad + balance).slice(-maxWidth) + "\n";
	        return ledger;
	    };
	    return Account;
	}());
	exports.default = Account;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var ACCOUNT_TYPE_1 = __webpack_require__(5);
	var Account_1 = __webpack_require__(3);
	var SubAccount = (function (_super) {
	    __extends(SubAccount, _super);
	    function SubAccount() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this._debits = [];
	        _this._debit_total = 0;
	        _this._credits = [];
	        _this._credit_total = 0;
	        _this._balance = 0;
	        return _this;
	    }
	    SubAccount.prototype.debit = function (amount) {
	        this._debits.push(amount);
	        this._debit_total += amount;
	        this._balance += (this.accountType === ACCOUNT_TYPE_1.default.DEBIT_NORMAL) ? amount : -amount;
	    };
	    Object.defineProperty(SubAccount.prototype, "debits", {
	        get: function () {
	            return this._debits;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SubAccount.prototype.credit = function (amount) {
	        this._credits.push(amount);
	        this._credit_total += amount;
	        this._balance += (this.accountType === ACCOUNT_TYPE_1.default.CREDIT_NORMAL) ? amount : -amount;
	    };
	    Object.defineProperty(SubAccount.prototype, "credits", {
	        get: function () {
	            return this._credits;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SubAccount.prototype, "balance", {
	        get: function () { return this._balance; },
	        enumerable: true,
	        configurable: true
	    });
	    return SubAccount;
	}(Account_1.default));
	exports.default = SubAccount;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ACCOUNT_TYPE;
	(function (ACCOUNT_TYPE) {
	    ACCOUNT_TYPE[ACCOUNT_TYPE["DEBIT_NORMAL"] = 0] = "DEBIT_NORMAL";
	    ACCOUNT_TYPE[ACCOUNT_TYPE["CREDIT_NORMAL"] = 1] = "CREDIT_NORMAL";
	})(ACCOUNT_TYPE || (ACCOUNT_TYPE = {}));
	exports.default = ACCOUNT_TYPE;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var SummaryAccount_1 = __webpack_require__(2);
	var snapshotAccount = function (acct) {
	    var snapshot = {
	        name: acct.name,
	        balance: acct.balance,
	        subAccounts: []
	    };
	    if (acct instanceof SummaryAccount_1.default) {
	        var sa = acct;
	        for (var i = 0; i < sa.subAccounts.length; i++) {
	            snapshot.subAccounts.push(snapshotAccount(sa.subAccounts[i]));
	        }
	    }
	    return snapshot;
	};
	exports.snapshotAccount = snapshotAccount;
	var formatSnapshots = function (accts) {
	    var tmpAccts = {};
	    var maxName = 0, maxBal = 0;
	    Object.keys(accts).forEach(function (k) {
	        tmpAccts[k] = [];
	        var makeTmp = function (acct, indent) {
	            if (indent === void 0) { indent = ''; }
	            var bal = acct.balance;
	            var a = { name: indent + acct.name, balance: bal, balanceStr: bal.toFixed(2) };
	            if (bal < 0) {
	                a.balanceStr = a.balanceStr.replace(/-/, '(') + ')';
	            }
	            else {
	                a.balanceStr = ' ' + a.balanceStr + ' ';
	            }
	            maxName = Math.max(maxName, a.name.length);
	            maxBal = Math.max(maxBal, a.balanceStr.length);
	            tmpAccts[k].push(a);
	            for (var j = 0; j < acct.subAccounts.length; j++) {
	                makeTmp(acct.subAccounts[j], indent + '  ');
	            }
	        };
	        for (var i = 0; i < accts[k].length; i++) {
	            makeTmp(accts[k][i]);
	        }
	    });
	    var namePad = '';
	    while (namePad.length < maxName)
	        namePad += ' ';
	    var balPad = '';
	    while (balPad.length < maxBal)
	        balPad += ' ';
	    var fmtd = {};
	    Object.keys(accts).forEach(function (k) {
	        fmtd[k] = tmpAccts[k].map(function (acct) {
	            var str = '';
	            str += (acct.name + namePad).slice(0, maxName) + ' ';
	            str += '$' + (balPad + acct.balanceStr).slice(-maxBal);
	            return str;
	        });
	    });
	    return fmtd;
	};
	exports.formatSnapshots = formatSnapshots;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var JournalEntry_1 = __webpack_require__(8);
	var IncomeStatement_1 = __webpack_require__(9);
	var BalanceSheet_1 = __webpack_require__(10);
	var Period = (function () {
	    function Period(period, coa, autoClose) {
	        this.period = period;
	        this.coa = coa;
	        this.journal = [];
	        this.closed = false;
	        this._financialStatements = { balanceSheet: null, incomeStatement: null };
	        this.autoClose = arguments.length >= 3 ? autoClose : function () { throw new Error("You must either provide an autoClose function at instantiation or close explicitly prior to accessing financial statements"); };
	    }
	    Period.prototype.close = function (closer) {
	        var incomeStatement = new IncomeStatement_1.default(this.coa);
	        if (arguments.length >= 1) {
	            closer();
	        }
	        else {
	            this.autoClose();
	        }
	        var isaccts = [this.coa.income, this.coa.expenses];
	        for (var i = 0; i < isaccts.length; i++) {
	            if (isaccts[i].balance !== 0)
	                throw new Error("Income Statement account '" + isaccts[i].name + "' has non-zero balance $" + isaccts[i].balance + " after close");
	        }
	        var balanceSheet = new BalanceSheet_1.default(this.coa);
	        this.closed = true;
	        this._financialStatements = { incomeStatement: incomeStatement, balanceSheet: balanceSheet };
	    };
	    Period.prototype.journalEntry = function (description, amount, debit, credit) {
	        this.compoundJournalEntry(description, [{ amount: amount, account: debit }], [{ amount: amount, account: credit }]);
	    };
	    Period.prototype.compoundJournalEntry = function (description, debits, credits) {
	        if (this.closed)
	            throw new Error('This period has already been closed. You may not add any additional journal entires.');
	        this.journal.push(new JournalEntry_1.default(description, debits, credits));
	    };
	    Object.defineProperty(Period.prototype, "financialStatements", {
	        get: function () { return this._financialStatements; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Period.prototype, "balanceSheet", {
	        get: function () {
	            if (this.closed === false) {
	                this.close(this.autoClose);
	            }
	            return this.financialStatements.balanceSheet;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Period.prototype, "incomeStatement", {
	        get: function () {
	            if (this.closed === false) {
	                this.close(this.autoClose);
	            }
	            return this.financialStatements.incomeStatement;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Period.prototype.printJournal = function () {
	        //               $xXXX,XXX.XX $xXXX,XXX.XX 
	        var journal = ["\t      Debits     Credits  Account"];
	        for (var i = 0; i < this.journal.length; i++) {
	            journal.push(this.journal[i].print(12, 2, "\t"));
	        }
	        return journal.join("\n");
	    };
	    Period.prototype.toString = function () { return this.printJournal(); };
	    return Period;
	}());
	exports.default = Period;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var JournalEntry = (function () {
	    function JournalEntry(description, debits, credits) {
	        this.description = description;
	        this.debits = debits;
	        this.credits = credits;
	        var debit_total = 0;
	        for (var i = 0; i < debits.length; i++) {
	            debit_total += debits[i].amount;
	            debits[i].account.debit(debits[i].amount);
	        }
	        var credit_total = 0;
	        for (var i = 0; i < credits.length; i++) {
	            credit_total += credits[i].amount;
	            credits[i].account.credit(credits[i].amount);
	        }
	        if (debit_total != credit_total)
	            throw new Error("Debits (" + debit_total + ") != Credits (" + credit_total + ")");
	    }
	    JournalEntry.prototype.print = function (maxLen, decimals, indent) {
	        if (maxLen === void 0) { maxLen = 12; }
	        if (decimals === void 0) { decimals = 2; }
	        if (indent === void 0) { indent = "\t"; }
	        var placeholder = '';
	        while (placeholder.length < maxLen)
	            placeholder += ' ';
	        var fmtNum = function (num) {
	            var fmtd = num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	            fmtd = fmtd.substring(0, Math.max(fmtd.length, maxLen));
	            while (fmtd.length < maxLen)
	                fmtd = " " + fmtd;
	            return fmtd;
	        };
	        var je = this.description + "\n";
	        for (var i = 0; i < this.debits.length; i++) {
	            var v = this.debits[i];
	            je += "" + indent + fmtNum(v.amount) + placeholder + "  " + v.account.name + "\n";
	        }
	        for (var i = 0; i < this.credits.length; i++) {
	            var v = this.credits[i];
	            je += "" + indent + placeholder + fmtNum(v.amount) + "  " + v.account.name + "\n";
	        }
	        return je;
	    };
	    JournalEntry.prototype.toString = function () { return this.print(); };
	    return JournalEntry;
	}());
	exports.default = JournalEntry;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Report_1 = __webpack_require__(6);
	var IncomeStatement = (function () {
	    function IncomeStatement(coa) {
	        this.income = Report_1.snapshotAccount(coa.income);
	        this.expenses = Report_1.snapshotAccount(coa.expenses);
	        this.contraEquity = Report_1.snapshotAccount(coa.contraEquity);
	        this.netIncome = this.income.balance - this.expenses.balance;
	    }
	    IncomeStatement.prototype.toString = function () {
	        var report = Report_1.formatSnapshots({
	            income: [this.income],
	            expenses: [this.expenses],
	            contraEquity: [this.contraEquity],
	        });
	        return "Income:\n" + report.income.join('\n') + "\nExpenses:\n" + report.expenses.join('\n') + "\nProfit/(Loss): $" + this.netIncome + "\nPayments to/from Owners:\n" + report.contraEquity.join('\n') + "\n";
	    };
	    return IncomeStatement;
	}());
	exports.default = IncomeStatement;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Report_1 = __webpack_require__(6);
	var BalanceSheet = (function () {
	    function BalanceSheet(coa) {
	        this.assets = Report_1.snapshotAccount(coa.assets);
	        this.liabilities = Report_1.snapshotAccount(coa.liabilities);
	        this.equity = Report_1.snapshotAccount(coa.equity);
	        this.netWorth = this.assets.balance - this.liabilities.balance;
	    }
	    BalanceSheet.prototype.toString = function () {
	        var report = Report_1.formatSnapshots({
	            assets: [this.assets],
	            liabilities: [this.liabilities],
	            equity: [this.equity],
	        });
	        return "Assets:\n" + report.assets.join('\n') + "\nLiabilities:\n" + report.liabilities.join('\n') + "\nNet Worth: $" + this.netWorth + "\nOwner's Equity:\n" + report.equity.join('\n') + "\n";
	    };
	    return BalanceSheet;
	}());
	exports.default = BalanceSheet;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var BankruptError = (function (_super) {
	    __extends(BankruptError, _super);
	    function BankruptError(message, period) {
	        var _this = _super.call(this, message) || this;
	        _this.period = period;
	        return _this;
	    }
	    return BankruptError;
	}(Error));
	exports.default = BankruptError;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=BookKeeper.js.map