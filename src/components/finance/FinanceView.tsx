import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, getCreditScoreTier } from '../../utils/formatters';
import { TRANSPORTATION_TIERS } from '../../constants/gameData';
import { 
  GEM_BUNDLES, 
  GEM_CASH_EXCHANGES, 
  GEM_PERKS, 
  GemBundle 
} from '../../utils/paystack';
import { PaystackCheckoutModal } from '../modals/PaystackCheckoutModal';
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
  Car,
  TrendingUp,
  Gem,
  Sparkles,
  ArrowRight,
  Zap,
  Crown,
  History,
  Info
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const {
    player,
    bankAccounts,
    creditCards,
    loans,
    openBankAccount,
    depositBank,
    withdrawBank,
    payCreditCard,
    applyCreditCard,
    takeLoan,
    payLoan,
    payMonthlyLoanDue,
    financeVehicle,
    buyTransportation,
    fileBankruptcyRebuild,
    buyGemsWithPaystack,
    exchangeGemsForCash,
    useGemPerk,
    setIsStoreModalOpen,
    totalDebt,
  } = useGame();

  const [activeSegment, setActiveSegment] = useState<'banking' | 'credit' | 'loans' | 'store'>('banking');
  const [bankActionModal, setBankActionModal] = useState<{
    type: 'deposit' | 'withdraw';
    accountId: 'checking' | 'savings';
  } | null>(null);
  const [transferAmount, setTransferAmount] = useState<string>('');

  const [showLoanModal, setShowLoanModal] = useState<boolean>(false);
  const [newLoanType, setNewLoanType] = useState<'personal' | 'business'>('personal');
  const [newLoanAmount, setNewLoanAmount] = useState<number>(3000);
  const [newLoanTerm, setNewLoanTerm] = useState<number>(12);

  // Store tab states
  const [storeCurrency, setStoreCurrency] = useState<'USD' | 'NGN'>('NGN');
  const [selectedBundleForCheckout, setSelectedBundleForCheckout] = useState<GemBundle | null>(null);

  const creditTier = getCreditScoreTier(player.creditScore);

  // Total credit limit & utilization
  const totalCreditLimit = creditCards.filter((c) => c.unlocked).reduce((sum, c) => sum + c.limit, 0);
  const totalCardBalance = creditCards.reduce((sum, c) => sum + c.balance, 0);
  const creditUtilization = totalCreditLimit > 0 ? Math.round((totalCardBalance / totalCreditLimit) * 100) : 0;

  // Calculators for vehicle financing showroom
  const vehiclesToFinance = TRANSPORTATION_TIERS.filter((t) => t.canFinance);

  const handleBuyBundle = (bundle: GemBundle) => {
    setSelectedBundleForCheckout(bundle);
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Top Segmented Navigation */}
      <div className="grid grid-cols-4 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 gap-1">
        <button
          onClick={() => setActiveSegment('banking')}
          className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'banking' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Banking</span>
          <span className="sm:hidden">Bank</span>
        </button>

        <button
          onClick={() => setActiveSegment('credit')}
          className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'credit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>FICO {player.creditScore}</span>
        </button>

        <button
          onClick={() => setActiveSegment('loans')}
          className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'loans' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Loans & Auto</span>
          <span className="sm:hidden">Loans</span>
        </button>

        <button
          onClick={() => setActiveSegment('store')}
          className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'store' 
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md' 
              : 'text-cyan-400 hover:text-cyan-300'
          }`}
        >
          <Gem className="w-3.5 h-3.5 text-cyan-400" />
          <span>Store</span>
          <span className="text-[10px] bg-cyan-950/80 border border-cyan-500/40 px-1 rounded text-cyan-300 hidden xs:inline">
            {player.gems || 0}
          </span>
        </button>
      </div>

      {/* 1. BANKING TAB */}
      {activeSegment === 'banking' && (
        <div className="space-y-3">
          {!player.hasBankAccount ? (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-xl text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Landmark className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Open Vance Banking Account</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Activate high-yield savings (4.5% APY) & everyday checking accounts. One-time opening fee applies.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs text-left">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Account Opening Fee:</span>
                  <span className="font-bold text-emerald-400">$500 Cash</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Standard Checking:</span>
                  <span className="font-semibold text-slate-200">Included (0.1% APY)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">High-Yield Savings:</span>
                  <span className="font-semibold text-emerald-400">Included (4.5% APY)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Your Liquid Cash:</span>
                  <span className={`font-bold ${player.cash >= 500 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(player.cash)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => openBankAccount()}
                disabled={player.cash < 500}
                className={`w-full py-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                  player.cash >= 500
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {player.cash >= 500 ? 'Pay $500 & Open Bank Account' : `Need $500 Cash to Open (Short: $${(500 - player.cash).toLocaleString()})`}
                </span>
              </button>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* 2. CREDIT TAB */}
      {activeSegment === 'credit' && (
        <div className="space-y-4">
          {/* Credit Score Gauge & Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  FICO CREDIT BUREAU
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

            {/* Realistic Credit Growth Rules Notice */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3 text-xs text-indigo-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <Info className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>How Credit Grows in Hustle Empire</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Credit score growth is earned through real credit history: take personal loans, finance vehicles like sedans or vans, and pay your scheduled monthly installments on time. Keeping card utilization under 30% also prevents score penalties.
              </p>
            </div>

            {/* Score Factors */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">On-Time Streak</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {player.consecutiveOnTimePayments || 0} mos
                </span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Total Paid On-Time</span>
                <span className="font-bold text-slate-200 mt-0.5 block">
                  {player.totalOnTimePayments || 0} bills
                </span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Late Marks</span>
                <span className={`font-bold mt-0.5 block ${(player.missedPaymentsCount || 0) > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                  {player.missedPaymentsCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Credit Cards list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Revolving Credit Lines
            </h4>
            {creditCards.map((card) => {
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

      {/* 3. LOANS & AUTO FINANCING TAB */}
      {activeSegment === 'loans' && (
        <div className="space-y-4">
          {/* Active Loans & Debt Summary */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  CURRENT LIABILITIES
                </span>
                <h3 className="text-base font-bold text-slate-100">Active Installment Accounts</h3>
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
              <span>Apply for Personal / Commercial Loan</span>
            </button>
          </div>

          {/* Active Loans list */}
          {loans.length === 0 ? (
            <div className="bg-slate-900/80 border border-dashed border-slate-800 rounded-3xl p-5 text-center space-y-2">
              <ShieldCheck className="w-7 h-7 text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-300 font-semibold">No active loan installments.</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Finance a vehicle below or take a business loan to start establishing your on-time payment track record!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Active Loans ({loans.length})
              </h4>
              {loans.map((loan) => {
                const canPayMonthly = player.cash >= loan.monthlyPayment;
                return (
                  <div
                    key={loan.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          {loan.type === 'auto' ? (
                            <Car className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Percent className="w-4 h-4 text-indigo-400" />
                          )}
                          <h4 className="text-xs sm:text-sm font-bold text-slate-100">{loan.name}</h4>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {(loan.interestRate * 100).toFixed(1)}% APR • {loan.monthsRemaining} months remaining • {loan.paymentsMade || 0} payments made
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-rose-400">
                          {formatCurrency(loan.remainingBalance)}
                        </div>
                        <span className="text-[10px] text-slate-400">{formatCurrency(loan.monthlyPayment)}/mo</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        disabled={!canPayMonthly}
                        onClick={() => payMonthlyLoanDue(loan.id)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer ${
                          canPayMonthly
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                        title="Pays monthly scheduled due. Boosts FICO credit score +4 to +6 on-time!"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pay Due ({formatCurrency(loan.monthlyPayment)})</span>
                      </button>

                      <button
                        disabled={player.cash < 200}
                        onClick={() => payLoan(loan.id, Math.min(loan.remainingBalance, Math.max(200, loan.monthlyPayment * 2)))}
                        className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition"
                      >
                        Prepay Principal
                      </button>
                    </div>

                    <div className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Paying monthly due boosts your credit score & extends your on-time streak!</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Vehicle Financing Showroom */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>Vehicle Financing & Auto Loans</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Drive now with a 20% down payment. Build credit with monthly on-time installments!
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {vehiclesToFinance.map((vehicle) => {
                const isOwned = player.transportationTier >= vehicle.tier;
                const downPercent = vehicle.downPaymentPercent || 0.20;
                const downPayment = Math.round(vehicle.cost * downPercent);
                const financedPrincipal = vehicle.cost - downPayment;
                const termMonths = vehicle.financeTermMonths || 36;
                const minScore = vehicle.minCreditScore || 580;
                const qualifies = player.creditScore >= minScore;
                const hasDownPayment = player.cash >= downPayment;

                // Estimate monthly payment
                const apr = player.creditScore >= 750 ? 0.055 : player.creditScore >= 680 ? 0.075 : player.creditScore >= 620 ? 0.11 : player.creditScore >= 580 ? 0.15 : 0.19;
                const monthlyRate = apr / 12;
                const estimatedMonthly = Math.round(
                  (financedPrincipal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                    (Math.pow(1 + monthlyRate, termMonths) - 1)
                );

                return (
                  <div
                    key={vehicle.tier}
                    className={`rounded-2xl p-4 border transition ${
                      isOwned
                        ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                        : qualifies
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                        : 'bg-slate-950/80 border-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{vehicle.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {vehicle.speedMultiplier}x Speed
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{vehicle.description}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-200">
                          {formatCurrency(vehicle.cost)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Total MSRP</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-slate-800/50 rounded-xl text-[11px] border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Down Payment (20%)</span>
                        <span className={`font-bold ${hasDownPayment ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {formatCurrency(downPayment)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Monthly Note</span>
                        <span className="font-bold text-amber-400">
                          {formatCurrency(estimatedMonthly)}/mo
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Min Credit</span>
                        <span className={`font-bold ${qualifies ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {minScore}+ FICO
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isOwned ? (
                        <div className="w-full py-2 bg-slate-800 rounded-xl text-xs font-bold text-emerald-400 text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Vehicle Already In Fleet</span>
                        </div>
                      ) : (
                        <>
                          <button
                            disabled={!qualifies || !hasDownPayment}
                            onClick={() => financeVehicle(vehicle.tier)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
                              qualifies && hasDownPayment
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Car className="w-3.5 h-3.5" />
                            <span>Finance ({formatCurrency(downPayment)} Down)</span>
                          </button>

                          <button
                            disabled={player.cash < vehicle.cost}
                            onClick={() => buyTransportation(vehicle.tier)}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            title="Buy cash outright"
                          >
                            Cash Outright
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bankruptcy safety net */}
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

      {/* 4. PREMIUM STORE TAB (PAYSTACK) */}
      {activeSegment === 'store' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/40">
                  <Gem className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Diamond Store</h3>
                  <p className="text-xs text-slate-400">Powered by Paystack</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Available Gems</span>
                <span className="text-base font-black text-cyan-300 flex items-center gap-1 justify-end">
                  <Gem className="w-4 h-4 text-cyan-400" />
                  {player.gems || 0}
                </span>
              </div>
            </div>

            {/* Currency selector */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setStoreCurrency('USD')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    storeCurrency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setStoreCurrency('NGN')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    storeCurrency === 'NGN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  NGN (₦)
                </button>
              </div>

              <button
                onClick={() => setIsStoreModalOpen(true)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Modal View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bundles Grid */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Acquire Gem Bundles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GEM_BUNDLES.map((bundle) => {
                const total = bundle.gems + bundle.bonusGems;
                const priceFormatted = storeCurrency === 'NGN' ? `₦${bundle.priceNGN.toLocaleString()}` : `$${bundle.priceUSD.toFixed(2)}`;

                return (
                  <div
                    key={bundle.id}
                    className={`rounded-2xl p-4 border flex flex-col justify-between transition ${
                      bundle.popular
                        ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-950/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">{bundle.name}</h4>
                        {bundle.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {bundle.badge}
                          </span>
                        )}
                      </div>
                      <div className="my-2.5 flex items-baseline gap-1.5">
                        <Gem className="w-4 h-4 text-cyan-400" />
                        <span className="text-lg font-black text-white">{total.toLocaleString()}</span>
                        <span className="text-xs font-bold text-cyan-300">Gems</span>
                        {bundle.bonusGems > 0 && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-1 rounded">
                            +{bundle.bonusGems} Free
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyBundle(bundle)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition active:scale-95"
                    >
                      Buy {priceFormatted} (Paystack)
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exchange gems for in-game money */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Convert Gems into Game Money</span>
            </h4>
            <div className="space-y-2">
              {GEM_CASH_EXCHANGES.slice(0, 3).map((opt) => {
                const canAfford = (player.gems || 0) >= opt.gemsCost;
                return (
                  <div
                    key={opt.id}
                    className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-bold text-white text-xs">{opt.title}</h5>
                      <p className="text-[10px] text-slate-400">{opt.description}</p>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => exchangeGemsForCash(opt.gemsCost, opt.cashReward)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Gem className="w-3 h-3 text-cyan-300" />
                      <span>{opt.gemsCost} 💎</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
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

      {/* Paystack Checkout & Real-Time Verification Modal */}
      <PaystackCheckoutModal
        isOpen={Boolean(selectedBundleForCheckout)}
        onClose={() => setSelectedBundleForCheckout(null)}
        bundle={selectedBundleForCheckout}
        currency={storeCurrency}
        onSuccess={(ref, totalGems) => {
          buyGemsWithPaystack(totalGems, ref);
        }}
      />
    </div>
  );
};
