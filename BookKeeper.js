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
	var Period_1 = __webpack_require__(3);
	var BankruptError_1 = __webpack_require__(10);
	var DebitAccount_1 = __webpack_require__(7);
	var CreditAccount_1 = __webpack_require__(5);
	exports.default = {
	    ChartOfAccounts: ChartOfAccounts_1.default,
	    DebitAccount: DebitAccount_1.default,
	    CreditAccount: CreditAccount_1.default,
	    Period: Period_1.default,
	    BankruptError: BankruptError_1.default
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var JournalEntry_1 = __webpack_require__(2);
	var ChartOfAccounts = (function () {
	    function ChartOfAccounts() {
	        this.bsaccts = [];
	        this.isaccts = [];
	        this.eqaccts = [];
	        this.journal = [];
	        this.total = 0;
	    }
	    Object.defineProperty(ChartOfAccounts.prototype, "incomeStatementAccounts", {
	        get: function () { return this.isaccts; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ChartOfAccounts.prototype, "balanceSheetAccounts", {
	        get: function () { return this.bsaccts; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ChartOfAccounts.prototype, "equityAccounts", {
	        get: function () { return this.eqaccts; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ChartOfAccounts.prototype, "accounts", {
	        get: function () {
	            return this.bsaccts.concat(this.isaccts, this.eqaccts);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ChartOfAccounts.prototype.incomeStatementAccount = function (acct) {
	        this.isaccts.push(acct);
	    };
	    ChartOfAccounts.prototype.balanceSheetAccount = function (acct) {
	        this.bsaccts.push(acct);
	    };
	    ChartOfAccounts.prototype.equityAccount = function (acct) {
	        this.eqaccts.push(acct);
	    };
	    ChartOfAccounts.prototype.journalEntry = function (period, descr, amount, debit, credit) {
	        return new JournalEntry_1.default(this, period, descr, amount, debit, credit);
	    };
	    ChartOfAccounts.prototype.logJournalEntry = function (je) {
	        this.journal.push(je);
	        this.total += je.amount;
	    };
	    return ChartOfAccounts;
	}());
	exports.default = ChartOfAccounts;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var JournalEntry = (function () {
	    function JournalEntry(coa, period, description, amount, debit, credit) {
	        this.period = period;
	        this.description = description;
	        this.amount = amount;
	        this.debit = debit;
	        this.credit = credit;
	        debit.debit(this);
	        credit.credit(this);
	        period.logJournalEntry(this);
	        coa.logJournalEntry(this);
	    }
	    return JournalEntry;
	}());
	exports.default = JournalEntry;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var IncomeStatement_1 = __webpack_require__(4);
	var BalanceSheet_1 = __webpack_require__(8);
	var FinancialStatements_1 = __webpack_require__(9);
	var Period = (function () {
	    function Period(period, coa, autoClose) {
	        this.journal = [];
	        this.total = 0;
	        this.period = period;
	        this.coa = coa;
	        this.autoClose = typeof autoClose === 'function'
	            ? autoClose
	            : function () { throw new Error('You called balanceSheet or incomeStatement prior to closing the period, but you did not provide an autoClose function at instantiation'); };
	        this.closed = false;
	    }
	    Period.prototype.logJournalEntry = function (je) {
	        this.journal.push(je);
	        this.total += je.amount;
	    };
	    Period.prototype.close = function (closer) {
	        var incomeStatement = new IncomeStatement_1.default(this.coa.incomeStatementAccounts);
	        closer();
	        for (var i in this.coa.incomeStatementAccounts) {
	            var acct = this.coa.incomeStatementAccounts[i];
	            if (acct.balance !== 0)
	                throw new Error("Income Statement account " + acct.name + " has non-zero balance after close");
	        }
	        var balanceSheet = new BalanceSheet_1.default(this.coa.balanceSheetAccounts, this.coa.equityAccounts);
	        this.closed = true;
	        this.financialStatements = new FinancialStatements_1.default(incomeStatement, balanceSheet);
	    };
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
	    return Period;
	}());
	exports.default = Period;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var CreditAccount_1 = __webpack_require__(5);
	var DebitAccount_1 = __webpack_require__(7);
	var IncomeStatement = (function () {
	    function IncomeStatement(isaccts) {
	        this.income = {};
	        this.incomeTotal = 0;
	        this.expenses = {};
	        this.expensesTotal = 0;
	        this.netIncome = 0;
	        for (var i in isaccts) {
	            var acct = isaccts[i];
	            if (acct instanceof CreditAccount_1.default) {
	                this.income[acct.name] = acct.balance;
	                this.incomeTotal += acct.balance;
	            }
	            else if (acct instanceof DebitAccount_1.default) {
	                this.expenses[acct.name] = acct.balance;
	                this.expensesTotal += acct.balance;
	            }
	            else {
	                cl = acct.constructor;
	                throw new Error("Unknown account type: " + cl.name);
	            }
	        }
	        this.netIncome = this.incomeTotal - this.expensesTotal;
	    }
	    return IncomeStatement;
	}());
	exports.default = IncomeStatement;


/***/ },
/* 5 */
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
	var Account_1 = __webpack_require__(6);
	var CreditAccount = (function (_super) {
	    __extends(CreditAccount, _super);
	    function CreditAccount() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    Object.defineProperty(CreditAccount.prototype, "balance", {
	        get: function () {
	            return this.credit_total - this.debit_total;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return CreditAccount;
	}(Account_1.default));
	exports.default = CreditAccount;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Account = (function () {
	    function Account(name) {
	        this.debits = [];
	        this.debit_total = 0;
	        this.credits = [];
	        this.credit_total = 0;
	        this.name = name;
	    }
	    Account.prototype.debit = function (je) {
	        this.debits.push(je);
	        this.debit_total += je.amount;
	    };
	    Account.prototype.credit = function (je) {
	        this.credits.push(je);
	        this.credit_total += je.amount;
	    };
	    return Account;
	}());
	exports.default = Account;


/***/ },
/* 7 */
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
	var Account_1 = __webpack_require__(6);
	var DebitAccount = (function (_super) {
	    __extends(DebitAccount, _super);
	    function DebitAccount() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    Object.defineProperty(DebitAccount.prototype, "balance", {
	        get: function () {
	            return this.debit_total - this.credit_total;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return DebitAccount;
	}(Account_1.default));
	exports.default = DebitAccount;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var CreditAccount_1 = __webpack_require__(5);
	var DebitAccount_1 = __webpack_require__(7);
	var BalanceSheet = (function () {
	    function BalanceSheet(bsaccts, eqaccts) {
	        this.assets = {};
	        this.assetsTotal = 0;
	        this.liabilities = {};
	        this.liabilitiesTotal = 0;
	        this.equity = {};
	        this.equityTotal = 0;
	        this.netWorth = 0;
	        for (var i in bsaccts) {
	            var acct = bsaccts[i];
	            if (acct instanceof CreditAccount_1.default) {
	                this.liabilities[acct.name] = acct.balance;
	                this.liabilitiesTotal += acct.balance;
	            }
	            else if (acct instanceof DebitAccount_1.default) {
	                this.assets[acct.name] = acct.balance;
	                this.assetsTotal += acct.balance;
	            }
	            else {
	                cl = acct.constructor;
	                throw new Error("Unknown account type: " + cl.name);
	            }
	        }
	        this.netWorth = this.assetsTotal - this.liabilitiesTotal;
	        for (var i in eqaccts) {
	            var acct = eqaccts[i];
	            console.log({ i: i, acct: acct });
	            if (acct instanceof CreditAccount_1.default) {
	                this.equity[acct.name] = acct.balance;
	                this.equityTotal += acct.balance;
	            }
	            else if (acct instanceof DebitAccount_1.default) {
	                cl = acct.constructor;
	                throw new Error("Equity account " + acct.name + " is a " + cl.name + ". It should be a credit.");
	            }
	            else {
	                cl = acct.constructor;
	                throw new Error("Unknown account type: " + cl.name);
	            }
	        }
	    }
	    return BalanceSheet;
	}());
	exports.default = BalanceSheet;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var FinancialStatements = (function () {
	    function FinancialStatements(incomeStatement, balanceSheet) {
	        this.incomeStatement = incomeStatement;
	        this.balanceSheet = balanceSheet;
	    }
	    return FinancialStatements;
	}());
	exports.default = FinancialStatements;


/***/ },
/* 10 */
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