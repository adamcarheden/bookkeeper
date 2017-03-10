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
	var Period_1 = __webpack_require__(5);
	var BankruptError_1 = __webpack_require__(10);
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
	        this.generalLedger = new Account_1.default('GeneralLedger', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	        // https://en.wikipedia.org/wiki/Normal_balance
	        this.assets = this.generalLedger.subAccount('Assets', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	        this.liabilities = this.generalLedger.subAccount('Liabilities', ACCOUNT_TYPE_1.default.CREDIT_NORMAL);
	        this.equity = this.generalLedger.subAccount('Equity', ACCOUNT_TYPE_1.default.CREDIT_NORMAL);
	        this.income = this.generalLedger.subAccount('Income', ACCOUNT_TYPE_1.default.CREDIT_NORMAL);
	        this.expenses = this.generalLedger.subAccount('Expenses', ACCOUNT_TYPE_1.default.DEBIT_NORMAL);
	    }
	    ChartOfAccounts.prototype.toString = function () {
	        return this.generalLedger.print('');
	    };
	    return ChartOfAccounts;
	}());
	exports.default = ChartOfAccounts;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ACCOUNT_TYPE_1 = __webpack_require__(3);
	var Report_1 = __webpack_require__(4);
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
	    Account.prototype.debit = function (amount) {
	        this.debits.push(amount);
	        this._debit_total += amount;
	    };
	    Object.defineProperty(Account.prototype, "debits", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc.concat(subAcct.debits);
	            }, this._debits);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Account.prototype, "debit_total", {
	        get: function () {
	            return this.subAccounts.reduce(function (acc, subAcct, i) {
	                return acc + subAcct._debit_total;
	            }, this._debit_total);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Account.prototype.credit = function (amount) {
	        this.credits.push(amount);
	        this._credit_total += amount;
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
	    Account.prototype.subAccount = function (name, accountType) {
	        if (arguments.length < 2)
	            accountType = this.accountType;
	        var sub = new Account(name, accountType);
	        this.subAccounts.push(sub);
	        return sub;
	    };
	    Account.prototype._balance = function () {
	        var bal;
	        switch (this.accountType) {
	            case ACCOUNT_TYPE_1.default.CREDIT_NORMAL:
	                bal = this._credit_total - this._debit_total;
	                break;
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
	    Account.prototype._prepForPrint = function (prefix, indent) {
	        if (prefix === void 0) { prefix = ''; }
	        if (indent === void 0) { indent = '  '; }
	        var acct = [{ name: "" + prefix + this.name, balance: this.balance }];
	        for (var i = 0; i < this.subAccounts.length; i++) {
	            acct = acct.concat(this.subAccounts[i]._prepForPrint("" + prefix + indent, indent));
	        }
	        return acct;
	    };
	    Account.prototype.print = function (prefix, indent) {
	        if (prefix === void 0) { prefix = ''; }
	        if (indent === void 0) { indent = '  '; }
	        return Report_1.printReport(this._prepForPrint(prefix, indent));
	    };
	    Account.prototype.toString = function () {
	        return this.print();
	    };
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
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var digits = function (num) {
	    return num.toFixed(2).split(/\./)[0].length;
	};
	var printReport = function (items) {
	    var max = 0;
	    var balMax = 0;
	    return items.map(function (item) {
	        var bal = item.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	        bal = bal.replace(/\$/, '$ ');
	        if (item.balance < 0) {
	            bal = bal.replace(/-/, '').replace(/ /, '(') + ')';
	        }
	        else {
	            bal = bal + " ";
	        }
	        var i = {
	            name: item.name,
	            balance: bal,
	        };
	        max = Math.max(max, item.name.length);
	        balMax = Math.max(balMax, i.balance.length);
	        return i;
	    }).map(function (item) {
	        var lbl = item.name;
	        while (lbl.length < max)
	            lbl += ' ';
	        var padLen = balMax - item.balance.length;
	        var pad = '';
	        while (pad.length < padLen)
	            pad += ' ';
	        var bal = item.balance.replace(/\$/, "$" + pad);
	        return lbl.substring(0, max) + "\t" + bal;
	    }).join("\n");
	};
	exports.printReport = printReport;
	var Report = (function () {
	    function Report(balance, accts) {
	        this.balance = balance;
	        this.subAccounts = {};
	        for (var i in accts) {
	            var acct = accts[i];
	            this.subAccounts[accts[i].name] = accts[i].statement;
	        }
	    }
	    Report.prototype.print = function (summary, postTotalAccounts) {
	        var _this = this;
	        if (summary === void 0) { summary = 'Total'; }
	        if (postTotalAccounts === void 0) { postTotalAccounts = []; }
	        var accts = [];
	        Object.keys(this.subAccounts).forEach(function (acct) {
	            accts.push({ name: acct, balance: _this.subAccounts[acct].balance });
	        });
	        accts.push({ name: summary, balance: this.balance });
	        accts = accts.concat(postTotalAccounts);
	        return printReport(accts);
	    };
	    Report.prototype.toString = function () {
	        return this.print();
	    };
	    return Report;
	}());
	exports.default = Report;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var JournalEntry_1 = __webpack_require__(6);
	var IncomeStatement_1 = __webpack_require__(7);
	var BalanceSheet_1 = __webpack_require__(8);
	var FinancialStatements_1 = __webpack_require__(9);
	var Period = (function () {
	    function Period(period, coa, autoClose) {
	        var _this = this;
	        this.period = period;
	        this.coa = coa;
	        this.journal = [];
	        this.autoClose = typeof autoClose === 'function'
	            ? autoClose
	            : function () {
	                var debits = [{ amount: coa.income.balance, account: coa.income }];
	                var credits = [{ amount: coa.expenses.balance, account: coa.expenses }];
	                var pnl = coa.income.balance - coa.expenses.balance;
	                if (pnl > 0) {
	                    credits.push({ amount: pnl, account: coa.equity });
	                }
	                else if (pnl < 0) {
	                    if (coa.assets.balance < -pnl)
	                        throw new Error("You're bankrupt!");
	                    debits.push({ amount: pnl, account: coa.equity });
	                }
	                _this.compoundJournalEntry('Close Period', debits, credits);
	            };
	        this.closed = false;
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
	        this.financialStatements = new FinancialStatements_1.default(incomeStatement, balanceSheet);
	    };
	    Period.prototype.journalEntry = function (description, amount, debit, credit) {
	        this.compoundJournalEntry(description, [{ amount: amount, account: debit }], [{ amount: amount, account: credit }]);
	    };
	    Period.prototype.compoundJournalEntry = function (description, debits, credits) {
	        this.journal.push(new JournalEntry_1.default(description, debits, credits));
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
/* 6 */
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
	var Report_1 = __webpack_require__(4);
	var IncomeStatement = (function (_super) {
	    __extends(IncomeStatement, _super);
	    function IncomeStatement(coa) {
	        var _this = _super.call(this, coa.income.balance - coa.expenses.balance, [coa.income, coa.expenses]) || this;
	        _this._netIncome = 0;
	        return _this;
	    }
	    Object.defineProperty(IncomeStatement.prototype, "netIncome", {
	        get: function () { return this.balance; },
	        enumerable: true,
	        configurable: true
	    });
	    IncomeStatement.prototype.toString = function () {
	        return this.print('Profit/(Loss)');
	    };
	    return IncomeStatement;
	}(Report_1.default));
	exports.default = IncomeStatement;


/***/ },
/* 8 */
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
	var Report_1 = __webpack_require__(4);
	var BalanceSheet = (function (_super) {
	    __extends(BalanceSheet, _super);
	    function BalanceSheet(coa) {
	        var _this = _super.call(this, coa.assets.balance - coa.liabilities.balance, [coa.assets, coa.liabilities]) || this;
	        _this.coa = coa;
	        _this._netWorth = 0;
	        return _this;
	    }
	    Object.defineProperty(BalanceSheet.prototype, "netWorth", {
	        get: function () { return this.balance; },
	        enumerable: true,
	        configurable: true
	    });
	    BalanceSheet.prototype.toString = function () {
	        return this.print('Net Worth', [this.coa.equity]);
	    };
	    return BalanceSheet;
	}(Report_1.default));
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