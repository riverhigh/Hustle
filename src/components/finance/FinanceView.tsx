import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, getCreditScoreTier } from '../../utils/formatters';
import { 
  Landmark, 
  CreditCard, 
  ShieldCheck, 
  Percent, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  DollarSign, 
  Plus, 
  CheckCircle2,
  Lock,
  RotateCcw
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const {
    player,
    bankAccounts,
    creditCards,
    loans,
    depositBank,
    withdrawBank,
    payCreditCard,
    applyCreditCard,
    takeLoan,
    payLoan,
    fileBankruptcyRebuild,
    totalDebt,
  } = useGame();

  const [activeSegment, setActiveSegment] = useState<'banking' | 'credit' | 'loans'>('banking');
  const [bankActionModal, setBankActionModal] = useState<{
    type: 'deposit' | 'withdraw';
    accountId: 'checking' | 'savings' | 'emergency';
  } | null>(null);
  const [transferAmount, setTransferAmount] = useState<string>('');

  const [showLoanModal, setShowLoanModal] = useState<boolean>(false);
  const [newLoanType, setNewLoanType] = useState<'personal' | 'business'>('personal');
  const [newLoanAmount, setNewLoanAmount] = useState<number>(3000);
  const [newLoanTerm, setNewLoanTerm] = useState<number>(12);

  const creditTier = getCreditScoreTier(player.creditScore);

  // Total credit limit & utilization
  const totalCreditLimit = creditCards.filter((c) => c.unlocked).reduce((sum, c) => sum + c.limit, 0);
  const totalCardBalance = creditCards.reduce((sum, c) => sum + c.balance, 0);
  const creditUtilization = totalCreditLimit > 0 ? Math.round((totalCardBalance / totalCreditLimit) * 100) : 0;

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Top Segmented Navigation */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveSegment('banking')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'banking' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Banking</span>
        </button>

        <button
          onClick={() => setActiveSegment('credit')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'credit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Credit ({player.creditScore})</span>
        </button>

        <button
          onClick={() => setActiveSegment('loans')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'loans' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Loans & Debt</span>
        </button>
      </div>

      {/* BANKING TAB */}
      {activeSegment === 'banking' && (
        <div className="space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  LIQUID CAPITAL
                </span>
                <h3 className="text-base font-bold text-slate-100">Depository Accounts</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Total In Bank</span>
                <div className="text-sm font-bold text-emerald-400">
                  {formatCurrency(bankAccounts.reduce((sum, a) => sum + a.balance, 0))}
                </div>
              </div>
            </div>

            {/* Account List */}
            <div className="space-y-2.5 pt-1">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100">{account.name}</h4>
                      <span className="text-[11px] text-emerald-400 font-semibold">
                        {(account.interestRate * 100).toFixed(1)}% APY Yield
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-100">
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setBankActionModal({ type: 'deposit', accountId: account.id })}
                      className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1 cursor-pointer transition active:scale-95"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>Deposit</span>
                    </button>

                    <button
                      onClick={() => setBankActionModal({ type: 'withdraw', accountId: account.id })}
                      className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1 cursor-pointer transition active:scale-95"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREDIT TAB */}
      {activeSegment === 'credit' && (
        <div className="space-y-4">
          {/* Credit Score Gauge & Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  FICO CREDIT SCORE
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-100">{player.creditScore}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${creditTier.bg} ${creditTier.color} border ${creditTier.border}`}>
                    {creditTier.label}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Card Utilization</span>
                <div className={`text-sm font-bold ${creditUtilization > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {creditUtilization}%
                </div>
              </div>
            </div>

            {/* Score Factors */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Payment History</span>
                <span className="font-semibold text-emerald-400">100% On-Time</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Available Credit</span>
                <span className="font-semibold text-slate-200">
                  {formatCurrency(totalCreditLimit - totalCardBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Credit Cards list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Your Revolving Credit Lines
            </h4>
            {creditCards.map((card) => {
              const canPay = player.cash >= card.balance && card.balance > 0;
              return (
                <div
                  key={card.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-slate-100">{card.name}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Limit: {formatCurrency(card.limit)} • {(card.interestRate * 100).toFixed(0)}% APR
                      </span>
                    </div>

                    {card.unlocked ? (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Balance Owed</span>
                        <div className={`text-sm font-bold ${card.balance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {formatCurrency(card.balance)}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => applyCreditCard(card.tier)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition active:scale-95"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>

                  {card.unlocked && card.balance > 0 && (
                    <div className="flex gap-2 pt-1">
                      <button
                        disabled={player.cash < card.minPayment}
                        onClick={() => payCreditCard(card.id, card.minPayment)}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Pay Min ({formatCurrency(card.minPayment)})
                      </button>

                      <button
                        disabled={player.cash < card.balance}
                        onClick={() => payCreditCard(card.id, card.balance)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition active:scale-95"
                      >
                        Pay Full ({formatCurrency(card.balance)})
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LOANS & DEBT TAB */}
      {activeSegment === 'loans' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  TOTAL LIABILITIES
                </span>
                <h3 className="text-base font-bold text-slate-100">Loans & Mortgages</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Total Debt</span>
                <div className="text-sm font-bold text-rose-400">
                  {formatCurrency(totalDebt)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLoanModal(true)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for New Loan</span>
            </button>
          </div>

          {/* Active Loans list */}
          {loans.length === 0 ? (
            <div className="bg-slate-900/80 border border-dashed border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-400">You are debt-free! No outstanding personal or business loans.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{loan.name}</h4>
                      <span className="text-[10px] text-slate-400">
                        {(loan.interestRate * 100).toFixed(1)}% Rate • {loan.monthsRemaining} mos remaining
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-rose-400">
                        {formatCurrency(loan.remainingBalance)}
                      </div>
                      <span className="text-[10px] text-slate-400">{formatCurrency(loan.monthlyPayment)}/mo</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      disabled={player.cash < loan.monthlyPayment}
                      onClick={() => payLoan(loan.id, loan.monthlyPayment)}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Pay Monthly ({formatCurrency(loan.monthlyPayment)})
                    </button>

                    <button
                      disabled={player.cash < loan.remainingBalance}
                      onClick={() => payLoan(loan.id, loan.remainingBalance)}
                      className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Pay Off Total
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bankruptcy / Safety net button if heavily burdened */}
          {totalDebt > 10000 && (
            <div className="p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-2xl space-y-2 text-center">
              <span className="text-xs font-bold text-rose-300">Overleveraged or Insolvent?</span>
              <p className="text-[11px] text-slate-400">
                You can file for financial restructuring to discharge debt, reset credit to 420, and rebuild.
              </p>
              <button
                onClick={() => fileBankruptcyRebuild()}
                className="px-4 py-1.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer transition"
              >
                File Debt Relief Rebuild
              </button>
            </div>
          )}
        </div>
      )}

      {/* BANK DEPOSIT / WITHDRAW MODAL */}
      {bankActionModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 capitalize">
              {bankActionModal.type} Capital
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Amount to {bankActionModal.type}
              </label>
              <input
                type="number"
                placeholder="Enter amount (e.g. 500)"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setBankActionModal(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = parseFloat(transferAmount);
                  if (val > 0) {
                    if (bankActionModal.type === 'deposit') {
                      depositBank(bankActionModal.accountId, val);
                    } else {
                      withdrawBank(bankActionModal.accountId, val);
                    }
                    setBankActionModal(null);
                    setTransferAmount('');
                  }
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW LOAN APPLICATION MODAL */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Apply for Financing</h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setNewLoanType('personal')}
                className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  newLoanType === 'personal'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Personal Loan
              </button>
              <button
                onClick={() => setNewLoanType('business')}
                className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  newLoanType === 'business'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Business Credit
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Loan Amount: {formatCurrency(newLoanAmount)}
              </label>
              <input
                type="range"
                min={1000}
                max={50000}
                step={1000}
                value={newLoanAmount}
                onChange={(e) => setNewLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLoanModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  takeLoan(newLoanType, newLoanAmount, newLoanTerm);
                  setShowLoanModal(false);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
