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
  Info,
  X,
  Wallet
} from 'lucide-react';

interface FinanceAppProps {
  onBack: () => void;
}

export const FinanceApp: React.FC<FinanceAppProps> = ({ onBack }) => {
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
    payMonthlyLoanDue,
    financeVehicle,
    buyTransportation,
    fileBankruptcyRebuild,
    buyGemsWithPaystack,
    exchangeGemsForCash,
    useGemPerk,
    totalDebt,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'banking' | 'credit' | 'loans' | 'vehicles' | 'store'>('banking');
  
  // Banking transfer modal state
  const [bankActionModal, setBankActionModal] = useState<{
    type: 'deposit' | 'withdraw';
    accountId: 'checking' | 'savings' | 'emergency';
  } | null>(null);
  const [transferAmount, setTransferAmount] = useState<string>('5000');
  
  // Loan application modal state
  const [showLoanModal, setShowLoanModal] = useState<boolean>(false);
  const [newLoanType, setNewLoanType] = useState<'personal' | 'business'>('personal');
  const [newLoanAmount, setNewLoanAmount] = useState<number>(5000);
  const [newLoanTerm, setNewLoanTerm] = useState<number>(12);

  // Store tab state
  const [storeCurrency, setStoreCurrency] = useState<'USD' | 'NGN'>('USD');
  const [isProcessingStore, setIsProcessingStore] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const creditTier = getCreditScoreTier(player.creditScore);

  // Total credit limit & utilization
  const totalCreditLimit = creditCards.filter((c) => c.unlocked).reduce((sum, c) => sum + c.limit, 0);
  const totalCardBalance = creditCards.reduce((sum, c) => sum + c.balance, 0);
  const creditUtilization = totalCreditLimit > 0 ? Math.round((totalCardBalance / totalCreditLimit) * 100) : 0;

  const vehiclesToFinance = TRANSPORTATION_TIERS.filter((t) => t.canFinance);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBankTransfer = () => {
    if (!bankActionModal) return;
    const amount = parseInt(transferAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    if (bankActionModal.type === 'deposit') {
      if (depositBank(bankActionModal.accountId, amount)) {
        triggerToast(`Deposited ${formatCurrency(amount)} into ${bankActionModal.accountId}!`);
        setBankActionModal(null);
      } else {
        triggerToast('Insufficient liquid cash for deposit!');
      }
    } else {
      if (withdrawBank(bankActionModal.accountId, amount)) {
        triggerToast(`Withdrew ${formatCurrency(amount)} from ${bankActionModal.accountId}!`);
        setBankActionModal(null);
      } else {
        triggerToast('Insufficient account balance!');
      }
    }
  };

  const handleApplyLoan = () => {
    if (takeLoan(newLoanType, newLoanAmount, newLoanTerm)) {
      triggerToast(`Loan of ${formatCurrency(newLoanAmount)} approved and credited!`);
      setShowLoanModal(false);
    } else {
      triggerToast('Loan rejected! Check credit score or existing debt.');
    }
  };

  const [selectedBundleForCheckout, setSelectedBundleForCheckout] = useState<GemBundle | null>(null);

  const handleBuyBundle = (bundle: GemBundle) => {
    setSelectedBundleForCheckout(bundle);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* App Header */}
      <div className="bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 border-b border-emerald-500/20 px-4 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-wide">Vance Mobile Bank</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  FDIC Insured
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Total Balance: <strong className="text-emerald-400">{formatCurrency(player.cash)}</strong></div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400">Credit Score</div>
            <div className="text-xs font-black text-emerald-400 flex items-center gap-1 justify-end">
              <span>{player.creditScore}</span>
              <span className="text-[9px] font-semibold text-slate-400">({creditTier.label})</span>
            </div>
          </div>
        </div>

        {/* Segment Tabs */}
        <div className="mt-2.5 flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
          <button
            onClick={() => setActiveTab('banking')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
              activeTab === 'banking' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Accounts
          </button>
          <button
            onClick={() => setActiveTab('credit')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
              activeTab === 'credit' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cards ({creditUtilization}%)
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
              activeTab === 'loans' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Loans
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
              activeTab === 'vehicles' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center text-cyan-400 flex items-center justify-center gap-0.5 ${
              activeTab === 'store' ? 'bg-cyan-600 text-white shadow' : 'text-cyan-400/80 hover:text-cyan-300'
            }`}
          >
            <Gem className="w-2.5 h-2.5" />
            <span>Store</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="px-3 pt-2 shrink-0 animate-in fade-in">
          <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold text-center shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 no-scrollbar">
        {/* TAB 1: BANK ACCOUNTS */}
        {activeTab === 'banking' && (
          <div className="space-y-3">
            {bankAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">{acc.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {acc.interestRate > 0 ? `${(acc.interestRate * 100).toFixed(1)}% APY Yield` : 'Standard Liquid'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">{formatCurrency(acc.balance)}</div>
                    <div className="text-[9px] text-emerald-400 font-semibold">Protected</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setBankActionModal({ type: 'deposit', accountId: acc.id });
                      setTransferAmount('5000');
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Deposit</span>
                  </button>
                  <button
                    onClick={() => {
                      setBankActionModal({ type: 'withdraw', accountId: acc.id });
                      setTransferAmount('5000');
                    }}
                    disabled={acc.balance <= 0}
                    className={`flex-1 py-1.5 rounded-xl border font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 active:scale-95 ${
                      acc.balance > 0
                        ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CREDIT CARDS */}
        {activeTab === 'credit' && (
          <div className="space-y-3">
            {/* Utilization Gauge */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Credit Limit</span>
                <span className="font-black text-white">{formatCurrency(totalCreditLimit)}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    creditUtilization <= 30 ? 'bg-emerald-400' : creditUtilization <= 70 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${Math.min(100, creditUtilization)}%` }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>Balance: <strong className="text-slate-200">{formatCurrency(totalCardBalance)}</strong></span>
                <span className={creditUtilization <= 30 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {creditUtilization}% Utilization ({creditUtilization <= 30 ? 'Excellent' : 'High'})
                </span>
              </div>
            </div>

            {/* Cards List */}
            {creditCards.map((card) => {
              const minScoreRequired = card.tier === 1 ? 300 : card.tier === 2 ? 620 : card.tier === 3 ? 700 : 760;
              const canApply = player.creditScore >= minScoreRequired;

              return (
                <div
                  key={card.id}
                  className={`p-3.5 rounded-2xl border transition space-y-2 ${
                    card.unlocked ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-900/40 border-slate-800/60 opacity-85'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{card.name}</span>
                        {card.unlocked && (
                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Limit: <strong className="text-slate-200">{formatCurrency(card.limit)}</strong> • APR: {(card.interestRate * 100).toFixed(0)}% • Cashback: {(card.rewardsRate * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="text-right">
                      {card.unlocked ? (
                        <div>
                          <div className="text-xs font-black text-rose-400">{formatCurrency(card.balance)}</div>
                          <div className="text-[9px] text-slate-400">Min Due: {formatCurrency(card.minPayment)}</div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400">Req: {minScoreRequired} Score</span>
                      )}
                    </div>
                  </div>

                  {card.unlocked ? (
                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          if (payCreditCard(card.id, card.balance)) {
                            triggerToast(`Paid off entire balance of ${formatCurrency(card.balance)}!`);
                          } else {
                            triggerToast('Insufficient cash to pay balance!');
                          }
                        }}
                        disabled={card.balance <= 0 || player.cash < card.balance}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          card.balance > 0 && player.cash >= card.balance
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Pay Full ({formatCurrency(card.balance)})
                      </button>
                      <button
                        onClick={() => {
                          if (payCreditCard(card.id, card.minPayment)) {
                            triggerToast(`Paid minimum payment of ${formatCurrency(card.minPayment)}!`);
                          } else {
                            triggerToast('Insufficient cash!');
                          }
                        }}
                        disabled={card.balance <= 0 || player.cash < card.minPayment}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                          card.balance > 0 && player.cash >= card.minPayment
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        Pay Min
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (applyCreditCard(card.tier)) {
                          triggerToast(`Approved for ${card.name}! Limit: ${formatCurrency(card.limit)}.`);
                        } else {
                          triggerToast('Credit application denied.');
                        }
                      }}
                      disabled={!canApply}
                      className={`w-full py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                        canApply
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canApply ? 'Apply for Card' : `Needs ${minScoreRequired} Credit Score`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: LOANS & DEBT */}
        {activeTab === 'loans' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Outstanding Debt</span>
                <span className="text-base font-black text-rose-400">{formatCurrency(totalDebt)}</span>
              </div>
              <button
                onClick={() => setShowLoanModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Borrow Loan</span>
              </button>
            </div>

            {loans.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
                You currently have zero active loan debt!
              </div>
            ) : (
              loans.map((loan) => (
                <div key={loan.id} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-xs text-white block">{loan.name}</span>
                      <span className="text-[10px] text-slate-400">
                        APR: {(loan.interestRate * 100).toFixed(1)}% • {loan.monthsRemaining} mo remaining
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-rose-400 block">
                        {formatCurrency(loan.remainingBalance)}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        Due: {formatCurrency(loan.monthlyPayment)}/mo
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        if (payMonthlyLoanDue(loan.id)) {
                          triggerToast(`Paid monthly payment of ${formatCurrency(loan.monthlyPayment)}!`);
                        } else {
                          triggerToast('Insufficient funds for monthly payment!');
                        }
                      }}
                      disabled={player.cash < loan.monthlyPayment}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        player.cash >= loan.monthlyPayment
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      Pay Monthly ({formatCurrency(loan.monthlyPayment)})
                    </button>
                    <button
                      onClick={() => {
                        if (payLoan(loan.id, loan.remainingBalance)) {
                          triggerToast(`Paid off entire loan balance!`);
                        } else {
                          triggerToast('Insufficient cash to pay off loan!');
                        }
                      }}
                      disabled={player.cash < loan.remainingBalance}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        player.cash >= loan.remainingBalance
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                          : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      Pay Full ({formatCurrency(loan.remainingBalance)})
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Bankruptcy Rebuild Card */}
            {totalDebt > 25000 && player.cash < 2000 && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Drowning in Debt? Chapter 7 Rebuild</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Liquidates all active debts to $0, but reduces credit score to 400 for fresh rebuilding.
                </p>
                <button
                  onClick={() => {
                    fileBankruptcyRebuild();
                    triggerToast('Filed bankruptcy rebuild. All debt forgiven.');
                  }}
                  className="w-full py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow"
                >
                  Execute Debt Forgiveness Rebuild
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: VEHICLES FINANCING SHOWROOM */}
        {activeTab === 'vehicles' && (
          <div className="space-y-3">
            {vehiclesToFinance.map((veh) => {
              const isOwned = player.transportationTier >= veh.tier;
              const downPaymentRate = veh.downPaymentPercent || 0.20;
              const downPayment = Math.round(veh.cost * downPaymentRate);
              const minCredit = veh.minCreditScore || 580;
              const canFinance = player.creditScore >= minCredit && player.cash >= downPayment;
              const termMonths = veh.financeTermMonths || 36;
              const monthlyNote = Math.round((veh.cost - downPayment) / termMonths);

              return (
                <div
                  key={veh.tier}
                  className={`p-3.5 rounded-2xl border transition space-y-2 ${
                    isOwned ? 'bg-slate-900/90 border-emerald-500/40' : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 text-lg">
                        🚗
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{veh.name}</span>
                          {isOwned && (
                            <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 uppercase">
                              Owned
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Purchase: <strong className="text-slate-200">{formatCurrency(veh.cost)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400">
                        {formatCurrency(monthlyNote)}/mo
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Down: {formatCurrency(downPayment)}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400">{veh.description}</p>

                  {!isOwned && (
                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          if (financeVehicle(veh.tier)) {
                            triggerToast(`Financed ${veh.name}! Down payment: ${formatCurrency(downPayment)}.`);
                          } else {
                            triggerToast('Financing denied! Check credit or cash.');
                          }
                        }}
                        disabled={!canFinance}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          canFinance
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Finance ({formatCurrency(downPayment)} Down)
                      </button>
                      <button
                        onClick={() => {
                          if (buyTransportation(veh.tier)) {
                            triggerToast(`Bought ${veh.name} for ${formatCurrency(veh.cost)} cash!`);
                          } else {
                            triggerToast('Insufficient cash for outright purchase!');
                          }
                        }}
                        disabled={player.cash < veh.cost}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                          player.cash >= veh.cost
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        Buy Cash
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 5: DIAMOND STORE */}
        {activeTab === 'store' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 rounded-2xl">
              <div>
                <span className="text-[10px] text-cyan-300 uppercase font-bold block">Available Gems</span>
                <span className="text-xl font-black text-cyan-300 flex items-center gap-1">
                  <Gem className="w-4 h-4 text-cyan-400" />
                  <span>{player.gems || 0}</span>
                </span>
              </div>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                <button
                  onClick={() => setStoreCurrency('USD')}
                  className={`px-2 py-0.5 rounded ${storeCurrency === 'USD' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setStoreCurrency('NGN')}
                  className={`px-2 py-0.5 rounded ${storeCurrency === 'NGN' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                >
                  NGN (₦)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {GEM_BUNDLES.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col justify-between ${
                    b.popular ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md' : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xl font-black text-cyan-300">{b.gems} 💎</div>
                    <div className="font-bold text-xs text-white mt-0.5">{b.name}</div>
                  </div>
                  <button
                    onClick={() => handleBuyBundle(b)}
                    className="mt-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer shadow active:scale-95"
                  >
                    {storeCurrency === 'USD' ? `$${b.priceUSD}` : `₦${b.priceNGN.toLocaleString()}`}
                  </button>
                </div>
              ))}
            </div>

            {/* Cash Exchange */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
              <span className="font-bold text-xs text-white block">Instant Gem-to-Cash Exchange</span>
              <div className="space-y-1.5">
                {GEM_CASH_EXCHANGES.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                    <div>
                      <span className="font-bold text-emerald-400">+{formatCurrency(ex.cashReward)}</span>
                      <span className="text-[10px] text-slate-400 block">{ex.title}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (exchangeGemsForCash(ex.gemsCost, ex.cashReward)) {
                          triggerToast(`Exchanged ${ex.gemsCost} Gems for +${formatCurrency(ex.cashReward)}!`);
                        } else {
                          triggerToast('Insufficient Gems!');
                        }
                      }}
                      disabled={player.gems < ex.gemsCost}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                        player.gems >= ex.gemsCost
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {ex.gemsCost} 💎
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BANK ACTION MODAL */}
      {bankActionModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-sm p-4 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setBankActionModal(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="font-bold text-sm capitalize">{bankActionModal.type} — {bankActionModal.accountId}</div>
            <div className="mt-3">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2 mt-2">
                {[1000, 5000, 25000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTransferAmount(amt.toString())}
                    className="flex-1 py-1 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    +${amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleBankTransfer}
              className="mt-3 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Confirm {bankActionModal.type}
            </button>
          </div>
        </div>
      )}

      {/* LOAN APPLICATION MODAL */}
      {showLoanModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-sm p-4 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowLoanModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="font-bold text-sm">Borrow Term Loan</div>
            <div className="mt-3 space-y-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Loan Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewLoanType('personal')}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs border ${
                      newLoanType === 'personal' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Personal (12% APR)
                  </button>
                  <button
                    onClick={() => setNewLoanType('business')}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs border ${
                      newLoanType === 'business' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Business (8.5% APR)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Amount: {formatCurrency(newLoanAmount)}</label>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={newLoanAmount}
                  onChange={(e) => setNewLoanAmount(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Term: {newLoanTerm} Months</label>
                <div className="flex gap-2">
                  {[6, 12, 24, 36].map((term) => (
                    <button
                      key={term}
                      onClick={() => setNewLoanTerm(term)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold ${
                        newLoanTerm === term ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {term}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyLoan}
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Submit Loan Application
            </button>
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
          triggerToast(`Success! +${totalGems} Gems added!`);
        }}
      />
    </div>
  );
};
