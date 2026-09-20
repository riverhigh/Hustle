import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { 
  GEM_BUNDLES, 
  GEM_CASH_EXCHANGES, 
  GEM_PERKS, 
  GemBundle 
} from '../../utils/paystack';
import { PaystackCheckoutModal } from './PaystackCheckoutModal';
import { formatCurrency } from '../../utils/formatters';
import { 
  X, 
  Sparkles, 
  DollarSign, 
  CreditCard, 
  Zap, 
  Check, 
  ShieldCheck, 
  HelpCircle,
  Gem,
  ArrowRight,
  TrendingUp,
  Crown
} from 'lucide-react';

interface PremiumStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumStoreModal: React.FC<PremiumStoreModalProps> = ({ isOpen, onClose }) => {
  const { 
    player, 
    buyGemsWithPaystack, 
    exchangeGemsForCash, 
    useGemPerk 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'buy' | 'exchange' | 'perks'>('buy');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('NGN');
  const [selectedBundleForCheckout, setSelectedBundleForCheckout] = useState<GemBundle | null>(null);
  const [purchasedRef, setPurchasedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuyBundle = (bundle: GemBundle) => {
    setPurchasedRef(null);
    setSelectedBundleForCheckout(bundle);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-4 sm:p-5 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl">
              <Gem className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Premium Diamond Store
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Paystack Secured
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Support your empire: Acquire gems, exchange for game cash, & boost stats
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Balance Indicator */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Your Balance:</span>
            <span className="flex items-center gap-1 font-black text-cyan-300 px-2.5 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              {player.gems || 0} Gems
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Cash:</span>
            <span className="font-bold text-emerald-400">
              {formatCurrency(player.cash)}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'buy'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            <span>Buy Gems</span>
          </button>

          <button
            onClick={() => setActiveTab('exchange')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'exchange'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Convert to Cash</span>
          </button>

          <button
            onClick={() => setActiveTab('perks')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'perks'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perks & Cleanse</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: BUY GEMS */}
          {activeTab === 'buy' && (
            <div className="space-y-4">
              {/* Currency Selector & Paystack Notice */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    onClick={() => setCurrency('NGN')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currency === 'NGN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    NGN (₦)
                  </button>
                </div>

                <span className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Paystack Gateway Active (Encrypted)</span>
                </span>
              </div>

              {purchasedRef && (
                <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-3 text-xs text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gems added to your balance! (Ref: {purchasedRef.slice(0, 16)}...)</span>
                  </div>
                  <button
                    onClick={() => setPurchasedRef(null)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Gem Bundles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GEM_BUNDLES.map((bundle) => {
                  const total = bundle.gems + bundle.bonusGems;
                  const priceFormatted = currency === 'NGN' ? `₦${bundle.priceNGN.toLocaleString()}` : `$${bundle.priceUSD.toFixed(2)}`;

                  return (
                    <div
                      key={bundle.id}
                      className={`relative rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                        bundle.popular
                          ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/50'
                          : 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      {bundle.badge && (
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm">
                          {bundle.badge}
                        </span>
                      )}

                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-white text-sm">{bundle.name}</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">{bundle.description}</p>
                          </div>
                        </div>

                        <div className="my-3 flex items-baseline gap-1.5">
                          <Gem className="w-5 h-5 text-cyan-400" />
                          <span className="text-xl font-black text-white">{total.toLocaleString()}</span>
                          <span className="text-xs font-bold text-cyan-300">Gems</span>
                          {bundle.bonusGems > 0 && (
                            <span className="ml-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-1.5 py-0.5 rounded-md">
                              +{bundle.bonusGems} FREE
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyBundle(bundle)}
                        className={`w-full py-2.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                          bundle.popular
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay {priceFormatted} with Paystack</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-[11px] text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Official Paystack payment gateway. Transactions are securely confirmed before gems are credited.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: EXCHANGE GEMS FOR CASH */}
          {activeTab === 'exchange' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-300">Convert Gems to In-Game Cash</h4>
                  <p className="text-[11px] text-slate-400">Instantly wire liquid capital to your checking account!</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Available</span>
                  <span className="font-bold text-cyan-300">{player.gems || 0} 💎</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {GEM_CASH_EXCHANGES.map((option) => {
                  const canAfford = (player.gems || 0) >= option.gemsCost;

                  return (
                    <div
                      key={option.id}
                      className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 hover:border-slate-600 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{option.title}</h3>
                          {option.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{option.description}</p>
                      </div>

                      <button
                        onClick={() => exchangeGemsForCash(option.gemsCost, option.cashReward)}
                        disabled={!canAfford}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${
                          canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                            : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Gem className="w-3.5 h-3.5 text-cyan-300" />
                        <span>{option.gemsCost} Gems</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PERKS & STAT CLEANSE */}
          {activeTab === 'perks' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-slate-300">
                <h4 className="font-bold text-purple-300">Stat Perks & Credit Cleanse</h4>
                <p className="text-[11px] text-slate-400">Power up your hustle without waiting for long cooldowns.</p>
              </div>

              <div className="space-y-2.5">
                {GEM_PERKS.map((perk) => {
                  const canAfford = (player.gems || 0) >= perk.gemsCost;

                  return (
                    <div
                      key={perk.id}
                      className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 hover:border-slate-600 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-700/70 shrink-0 mt-0.5">
                          {perk.iconName === 'zap' && <Zap className="w-4 h-4 text-amber-400" />}
                          {perk.iconName === 'credit' && <TrendingUp className="w-4 h-4 text-blue-400" />}
                          {perk.iconName === 'crown' && <Crown className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm">{perk.name}</h3>
                            {perk.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-950 text-purple-300 border border-purple-700/60">
                                {perk.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{perk.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => useGemPerk(perk.id)}
                        disabled={!canAfford}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${
                          canAfford
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                            : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Gem className="w-3.5 h-3.5 text-cyan-300" />
                        <span>{perk.gemsCost} Gems</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Paystack Checkout & Real-Time Verification Modal */}
      <PaystackCheckoutModal
        isOpen={Boolean(selectedBundleForCheckout)}
        onClose={() => setSelectedBundleForCheckout(null)}
        bundle={selectedBundleForCheckout}
        currency={currency}
        onSuccess={(ref, gems) => {
          buyGemsWithPaystack(gems, ref);
          setPurchasedRef(ref);
        }}
      />
    </div>
  );
};
