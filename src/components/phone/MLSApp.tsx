import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { Property } from '../../types/game';
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Wrench, 
  Bookmark, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Percent, 
  Home, 
  X,
  Gem
} from 'lucide-react';

interface MLSAppProps {
  onBack: () => void;
}

export const MLSApp: React.FC<MLSAppProps> = ({ onBack }) => {
  const { 
    player, 
    marketProperties, 
    buyProperty, 
    buyPropertyWithGems,
    toggleWatchlistProperty 
  } = useGame();

  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'condition' | 'cap_rate'>('price_asc');
  const [analyzingProperty, setAnalyzingProperty] = useState<Property | null>(null);
  const [negotiationOffer, setNegotiationOffer] = useState<number>(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTermYears, setLoanTermYears] = useState<15 | 30>(30);
  const [mlsToast, setMlsToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  // Available neighborhoods
  const neighborhoods = ['all', 'Southside', 'East District', 'Riverside', 'Downtown'];

  // Unowned properties only
  const activeListings = marketProperties.filter((p) => !p.isOwned);

  // Filtered & Sorted
  const displayedProperties = activeListings
    .filter((p) => neighborhoodFilter === 'all' || p.neighborhood === neighborhoodFilter)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.askingPrice - b.askingPrice;
      if (sortBy === 'price_desc') return b.askingPrice - a.askingPrice;
      if (sortBy === 'condition') return b.overallCondition - a.overallCondition;
      if (sortBy === 'cap_rate') {
        const capA = (a.estimatedRent * 12) / a.askingPrice;
        const capB = (b.estimatedRent * 12) / b.askingPrice;
        return capB - capA;
      }
      return 0;
    });

  const handleOpenAnalyzer = (prop: Property) => {
    setAnalyzingProperty(prop);
    setNegotiationOffer(prop.askingPrice);
    setDownPaymentPercent(20);
  };

  // Seller reaction logic
  const getSellerReaction = (offer: number, asking: number) => {
    const ratio = offer / asking;
    const negotiationLevel = player.skills.negotiation?.level || 1;
    const adjustedRatio = ratio + (negotiationLevel - 1) * 0.02;

    if (adjustedRatio >= 0.98) return { text: 'Accepting enthusiastically!', color: 'text-emerald-400', badge: 'High Acceptance' };
    if (adjustedRatio >= 0.92) return { text: 'Favorable & competitive offer', color: 'text-teal-400', badge: 'Likely Accept' };
    if (adjustedRatio >= 0.85) return { text: 'Uncertain, negotiating closely', color: 'text-amber-400', badge: 'Moderate Chance' };
    if (adjustedRatio >= 0.75) return { text: 'Reluctant, borderline lowball', color: 'text-orange-400', badge: 'Low Chance' };
    return { text: 'Offended! High risk of rejection', color: 'text-rose-400', badge: 'Insulting Offer' };
  };

  // Underwriting calculation
  const calcUnderwriting = (prop: Property, offer: number, downPct: number, termYears: 15 | 30) => {
    const downPayment = Math.round(offer * (downPct / 100));
    const loanAmount = Math.max(0, offer - downPayment);
    const annualInterest = player.creditScore >= 720 ? 0.055 : player.creditScore >= 640 ? 0.068 : 0.082;
    const monthlyRate = annualInterest / 12;
    const totalPayments = termYears * 12;

    const monthlyMortgage = loanAmount > 0
      ? Math.round(loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1))
      : 0;

    const totalMonthlyCost = monthlyMortgage + prop.monthlyExpenses;
    const netCashFlow = prop.estimatedRent - totalMonthlyCost;
    const annualRent = prop.estimatedRent * 12;
    const capRate = ((annualRent - prop.monthlyExpenses * 12) / offer) * 100;
    const cashOnCash = downPayment > 0 ? ((netCashFlow * 12) / downPayment) * 100 : 0;

    return {
      downPayment,
      loanAmount,
      annualInterest,
      monthlyMortgage,
      totalMonthlyCost,
      netCashFlow,
      capRate,
      cashOnCash,
    };
  };

  const handlePurchase = (prop: Property) => {
    const uw = calcUnderwriting(prop, negotiationOffer, downPaymentPercent, loanTermYears);

    if (player.cash < uw.downPayment) {
      setMlsToast({
        message: `Insufficient funds! Need ${formatCurrency(uw.downPayment)} for down payment.`,
        type: 'warning',
      });
      setTimeout(() => setMlsToast(null), 3000);
      return;
    }

    const success = buyProperty(prop.id, negotiationOffer, downPaymentPercent, loanTermYears);
    if (success) {
      setMlsToast({
        message: `Deal closed! Acquired ${prop.address} into your Real Estate portfolio!`,
        type: 'success',
      });
      setAnalyzingProperty(null);
      setTimeout(() => setMlsToast(null), 3500);
    }
  };

  const handleGemsBuy = (prop: Property) => {
    const success = buyPropertyWithGems(prop.id);
    if (success) {
      setMlsToast({
        message: `VIP Cash Close! ${prop.address} acquired instantly with 0 mortgage debt!`,
        type: 'success',
      });
      setAnalyzingProperty(null);
      setTimeout(() => setMlsToast(null), 3500);
    } else {
      setMlsToast({
        message: 'Need 120 Gems for instant acquisition.',
        type: 'warning',
      });
      setTimeout(() => setMlsToast(null), 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* MLS Header */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-b border-indigo-500/20 px-3.5 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white tracking-wide">MLS Portal</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Verified
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Multiple Listing Service • {activeListings.length} Active</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-indigo-900/40 border border-indigo-500/30 px-2 py-1 rounded-xl">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-black text-emerald-300">{formatCurrency(player.cash)}</span>
          </div>
        </div>

        {/* Neighborhood Filters */}
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
          {neighborhoods.map((n) => (
            <button
              key={n}
              onClick={() => setNeighborhoodFilter(n)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                neighborhoodFilter === n
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {n === 'all' ? 'All Areas' : n}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Alert */}
      {mlsToast && (
        <div className={`mx-3 mt-2 p-2 rounded-xl text-xs font-bold text-center border ${
          mlsToast.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
            : 'bg-amber-950/90 text-amber-300 border-amber-500/40'
        }`}>
          {mlsToast.message}
        </div>
      )}

      {/* Sort & Count Bar */}
      <div className="px-3.5 py-2 bg-slate-900/40 border-b border-white/5 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <span>Showing {displayedProperties.length} properties</span>
        <div className="flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[11px] font-bold text-indigo-300 focus:outline-none cursor-pointer"
          >
            <option value="price_asc" className="bg-slate-900">Price: Low to High</option>
            <option value="price_desc" className="bg-slate-900">Price: High to Low</option>
            <option value="condition" className="bg-slate-900">Best Condition</option>
            <option value="cap_rate" className="bg-slate-900">Highest Yield</option>
          </select>
        </div>
      </div>

      {/* Property Listings Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 no-scrollbar">
        {displayedProperties.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <Building2 className="w-10 h-10 mx-auto text-slate-600" />
            <div className="text-sm font-bold text-slate-300">No active MLS listings</div>
            <p className="text-xs">Check back tomorrow as new properties are listed.</p>
          </div>
        ) : (
          displayedProperties.map((prop) => {
            const capRate = (((prop.estimatedRent * 12) - (prop.monthlyExpenses * 12)) / prop.askingPrice) * 100;
            const isAffordable = player.cash >= prop.askingPrice * 0.20;

            return (
              <div
                key={prop.id}
                className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-indigo-500/40 transition group"
              >
                {/* Photo & Badge Banner */}
                <div className="relative h-36 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={prop.image}
                    alt={prop.address}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                      {prop.neighborhood}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/80 backdrop-blur-sm text-[9px] font-black text-white">
                      {prop.daysOnMarket}d on MLS
                    </span>
                  </div>

                  <button
                    onClick={() => toggleWatchlistProperty(prop.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-amber-400 border border-white/10 hover:scale-110 transition cursor-pointer"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${prop.isWatchlist ? 'fill-amber-400' : ''}`} />
                  </button>

                  {/* Bottom Price Tag */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-slate-300 font-medium">Asking Price</div>
                      <div className="text-lg font-black text-white leading-tight">
                        {formatCurrency(prop.askingPrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-bold">Est. Rent</div>
                      <div className="text-xs font-black text-emerald-300">
                        +{formatCurrency(prop.estimatedRent)}/mo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details Bar */}
                <div className="p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">{prop.address}</h4>
                      <p className="text-[11px] text-slate-400">Monthly Expenses: ~{formatCurrency(prop.monthlyExpenses)}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold">Est. Cap Rate</div>
                      <div className="text-xs font-black text-indigo-300">{capRate.toFixed(1)}% ROI</div>
                    </div>
                  </div>

                  {/* Condition Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-amber-400" />
                        <span>Overall Condition</span>
                      </span>
                      <span className={`font-black ${
                        prop.overallCondition >= 80 ? 'text-emerald-400' : prop.overallCondition >= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {prop.overallCondition}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          prop.overallCondition >= 80 ? 'bg-emerald-500' : prop.overallCondition >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${prop.overallCondition}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAnalyzer(prop)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Inspect & Underwrite</span>
                    </button>

                    <button
                      onClick={() => handleGemsBuy(prop)}
                      className="py-2 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-black transition active:scale-95 cursor-pointer flex items-center gap-1"
                      title="Buy with 120 Gems (No mortgage needed)"
                    >
                      <Gem className="w-3.5 h-3.5 text-amber-400" />
                      <span>120</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Property Underwriting & Offer Analyzer Modal */}
      {analyzingProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
            {/* Modal Header */}
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">{analyzingProperty.address}</h3>
                  <p className="text-[10px] text-slate-400">{analyzingProperty.neighborhood} • Asking {formatCurrency(analyzingProperty.askingPrice)}</p>
                </div>
              </div>

              <button
                onClick={() => setAnalyzingProperty(null)}
                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 no-scrollbar">
              {/* Offer Price Slider */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Your Negotiation Offer</span>
                  <span className="font-black text-indigo-400 text-sm">{formatCurrency(negotiationOffer)}</span>
                </div>

                <input
                  type="range"
                  min={Math.round(analyzingProperty.askingPrice * 0.70)}
                  max={Math.round(analyzingProperty.askingPrice * 1.15)}
                  step={1000}
                  value={negotiationOffer}
                  onChange={(e) => setNegotiationOffer(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                {/* Seller Reaction */}
                {(() => {
                  const reaction = getSellerReaction(negotiationOffer, analyzingProperty.askingPrice);
                  return (
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">Seller Reaction:</span>
                      <span className={`font-bold ${reaction.color}`}>{reaction.text}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Down Payment & Loan Terms */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">Financing Structure</div>

                <div>
                  <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Down Payment</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(Math.round(negotiationOffer * (downPaymentPercent / 100)))} ({downPaymentPercent}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 20, 30, 50].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setDownPaymentPercent(pct)}
                        className={`py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                          downPaymentPercent === pct
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Mortgage Loan Term</span>
                    <span className="font-bold text-indigo-300">{loanTermYears} Years Fixed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[15, 30].map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTermYears(term as 15 | 30)}
                        className={`py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                          loanTermYears === term
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {term} Years
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pro-Forma Cash Flow Analyzer */}
              {(() => {
                const uw = calcUnderwriting(analyzingProperty, negotiationOffer, downPaymentPercent, loanTermYears);
                const hasCash = player.cash >= uw.downPayment;

                return (
                  <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-indigo-500/30 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-black text-indigo-300">
                      <span>Pro-Forma Monthly Cash Flow</span>
                      <span className="text-[10px] font-bold text-slate-400">Underwriting Ledger</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Expected Monthly Rent</span>
                        <span className="font-bold text-emerald-400">+{formatCurrency(analyzingProperty.estimatedRent)}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Monthly Mortgage (P&I)</span>
                        <span className="font-medium text-rose-400">-{formatCurrency(uw.monthlyMortgage)}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Taxes, Insurance & OpEx</span>
                        <span className="font-medium text-rose-400">-{formatCurrency(analyzingProperty.monthlyExpenses)}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between font-black text-sm">
                        <span>Net Monthly Cash Flow</span>
                        <span className={uw.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {uw.netCashFlow >= 0 ? '+' : ''}{formatCurrency(uw.netCashFlow)}/mo
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-center">
                      <div className="p-2 bg-slate-900 rounded-xl">
                        <div className="text-[10px] text-slate-400">Cap Rate</div>
                        <div className="text-xs font-black text-indigo-300">{uw.capRate.toFixed(1)}%</div>
                      </div>
                      <div className="p-2 bg-slate-900 rounded-xl">
                        <div className="text-[10px] text-slate-400">Cash-on-Cash ROI</div>
                        <div className="text-xs font-black text-emerald-400">{uw.cashOnCash.toFixed(1)}%</div>
                      </div>
                    </div>

                    {/* Down Payment Check */}
                    <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                      hasCash ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300' : 'bg-rose-950/50 border border-rose-500/30 text-rose-300'
                    }`}>
                      <span>Down Payment Required:</span>
                      <span className="font-black">{formatCurrency(uw.downPayment)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Area Renovation Inspection */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>Property Area Inspection</span>
                </div>

                <div className="space-y-2">
                  {analyzingProperty.areas.map((area) => (
                    <div key={area.id} className="p-2 bg-slate-900/60 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{area.name}</div>
                        <div className="text-[10px] text-slate-400">Repair Cost: ~{formatCurrency(area.repairCost)}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-black ${
                          area.condition >= 80 ? 'text-emerald-400' : area.condition >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {area.condition}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <button
                onClick={() => handlePurchase(analyzingProperty)}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-4 h-4" />
                <span>Submit Offer & Close Deal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
