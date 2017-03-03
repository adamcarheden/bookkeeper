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
	var Period_1 = __webpack_require__(4);
	var BankruptError_1 = __webpack_require__(9);
	var ACCOUNT_TYPE_1 = __webpack_require__(3);
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
	var Account_1 = __webpack_require__(2);
	var ACCOUNT_TYPE_1 = __webpack_require__(3);
	var ChartOfAccounts = (function () {
	    function ChartOfAccounts() {
	        this.assets = new Account_1.default('Assets', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	        this.liabilities = new Account_1.default('Liabilities', ACCOUNT_TYPE_1.default.CREDIT_NORMAL);
	        this.income = new Account_1.default('Income', ACCOUNT_TYPE_1.default.CREDIT_NORMAL);
	        this.expenses = new Account_1.default('Expenses', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	        this.equity = new Account_1.default('Equity', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	    }
	    return ChartOfAccounts;
	}());
	exports.default = ChartOfAccounts;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ACCOUNT_TYPE_1 = __webpack_require__(3);
	var Account = (function () {
	    function Account(name, accountType) {
	        this.name = name;
	        this.accountType = accountType;
	        this._debits = [];
	        this._debit_total = 0;
	        this._credits = [];
	        this._credit_total = 0;
	        this.subAccounts = [];
	    }
	    Account.prototype.debit = function (je) {
	        this.debits.push(je);
	        this._debit_total += je.amount;
	    };
	    Object.defineProperty(Account.prototype, "debit_total", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc + subAcct._debit_total;
	            }, this._debit_total);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Account.prototype, "debits", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc.concat(subAcct.debits);
	            }, []);
	            //	}, this._debits)
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Account.prototype.credit = function (je) {
	        this.credits.push(je);
	        this._credit_total += je.amount;
	    };
	    Object.defineProperty(Account.prototype, "credits", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc.concat(subAcct.credits);
	            }, this._credits);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Account.prototype, "credit_total", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc + subAcct._credit_total;
	            }, this._credit_total);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Account.prototype.subAccount = function (name, acctType) {
	        var sub = new Account(name, acctType);
	        this.subAccounts.push(sub);
	        return sub;
	    };
	    Account.prototype._balance = function () {
	        var bal;
	        switch (this.accountType) {
	            case ACCOUNT_TYPE_1.default.CREDIT_NORMAL:
	                bal = this._credit_total - this._debit_total;
	            case ACCOUNT_TYPE_1.default.DEBIT_NORMAL:
	                bal = this._debit_total - this._credit_total;
	                break;
	            default:
	                throw new Error("Unknown account type: " + this.accountType);
	        }
	        return bal;
	    };
	    Object.defineProperty(Account.prototype, "balance", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc + subAcct.balance;
	            }, this._balance());
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Account.prototype, "statement", {
	        get: function () {
	            var stmt = {
	                balance: this._balance(),
	                subAccounts: {}
	            };
	            for (var i = 0; i < this.subAccounts.length; i++) {
	                stmt.subAccounts[this.subAccounts[i].name] = this.subAccounts[i].statement;
	                stmt.balance += stmt.subAccounts[this.subAccounts[i].name].balance;
	            }
	            return stmt;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Account;
	}());
	exports.default = Account;


/***/ },
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var JournalEntry_1 = __webpack_require__(5);
	var IncomeStatement_1 = __webpack_require__(6);
	var BalanceSheet_1 = __webpack_require__(7);
	var FinancialStatements_1 = __webpack_require__(8);
	var Period = (function () {
	    function Period(period, coa, autoClose) {
	        this.period = period;
	        this.coa = coa;
	        this.journal = [];
	        this.autoClose = typeof autoClose === 'function'
	            ? autoClose
	            : function () { throw new Error('You called balanceSheet or incomeStatement prior to closing the period, but you did not provide an autoClose function at instantiation'); };
	        this.closed = false;
	    }
	    Period.prototype.close = function (closer) {
	        var incomeStatement = new IncomeStatement_1.default(this.coa);
	        closer();
	        var isaccts = [this.coa.income, this.coa.expenses];
	        for (var i = 0; i < isaccts.length; i++) {
	            if (isaccts[i].balance !== 0)
	                throw new Error("Income Statement account '" + isaccts[i].name + "' has non-zero balance after close");
	        }
	        var balanceSheet = new BalanceSheet_1.default(this.coa);
	        this.closed = true;
	        this.financialStatements = new FinancialStatements_1.default(incomeStatement, balanceSheet);
	    };
	    Period.prototype.journalEntry = function (description, amount, debit, credit) {
	        var je = new JournalEntry_1.default(description, amount, debit, credit);
	        this.journal.push(je);
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
/* 5 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var JournalEntry = (function () {
	    function JournalEntry(description, amount, debit, credit) {
	        this.description = description;
	        this.amount = amount;
	        this.debit = debit;
	        this.credit = credit;
	        debit.debit(this);
	        credit.credit(this);
	    }
	    return JournalEntry;
	}());
	exports.default = JournalEntry;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var IncomeStatement = (function () {
	    function IncomeStatement(coa) {
	        this.subAccounts = {};
	        this._netIncome = 0;
	        var isaccts = [coa.income, coa.expenses];
	        for (var i in isaccts) {
	            var acct = isaccts[i];
	            this.subAccounts[isaccts[i].name] = isaccts[i].statement;
	        }
	        this._netIncome = this.subAccounts[coa.income.name].balance - this.subAccounts[coa.expenses.name].balance;
	    }
	    Object.defineProperty(IncomeStatement.prototype, "netIncome", {
	        get: function () { return this._netIncome; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(IncomeStatement.prototype, "balance", {
	        get: function () { return this._netIncome; },
	        enumerable: true,
	        configurable: true
	    });
	    return IncomeStatement;
	}());
	exports.default = IncomeStatement;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var BalanceSheet = (function () {
	    function BalanceSheet(coa) {
	        this.subAccounts = {};
	        this._netWorth = 0;
	        var bsaccts = [coa.assets, coa.liabilities, coa.equity];
	        for (var i in bsaccts) {
	            var acct = bsaccts[i];
	            this.subAccounts[bsaccts[i].name] = bsaccts[i].statement;
	        }
	        this._netWorth = this.subAccounts[coa.assets.name].balance - this.subAccounts[coa.liabilities.name].balance;
	    }
	    Object.defineProperty(BalanceSheet.prototype, "netWorth", {
	        get: function () { return this._netWorth; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BalanceSheet.prototype, "balance", {
	        get: function () { return this._netWorth; },
	        enumerable: true,
	        configurable: true
	    });
	    return BalanceSheet;
	}());
	exports.default = BalanceSheet;


/***/ },
/* 8 */
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
/* 9 */
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