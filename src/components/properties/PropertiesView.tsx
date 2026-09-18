import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Property, PropertyAreaId, Tenant } from '../../types/game';
import { formatCurrency } from '../../utils/formatters';
import { 
  Building2, 
  Home, 
  Search, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  Heart, 
  X, 
  Check, 
  Gavel, 
  Users, 
  ShieldCheck, 
  AlertTriangle,
  Bookmark,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PropertiesView: React.FC = () => {
  const {
    player,
    marketProperties,
    ownedProperties,
    buyProperty,
    renovatePropertyArea,
    setTenantToProperty,
    evictTenant,
    collectRent,
    toggleWatchlistProperty,
    activeAuction,
    startAuction,
    bidInAuction,
    closeAuction,
    autoCollectRentUnlocked,
    unlockAutoCollectManager,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'scanner' | 'portfolio' | 'auctions'>('portfolio');
  const [scannerIndex, setScannerIndex] = useState<number>(0);
  const [selectedPropertyToAnalyze, setSelectedPropertyToAnalyze] = useState<Property | null>(null);
  const [negotiationOffer, setNegotiationOffer] = useState<number>(85000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [inspectingProperty, setInspectingProperty] = useState<Property | null>(null);
  const [leasingProperty, setLeasingProperty] = useState<Property | null>(null);

  const currentScannedProperty = marketProperties[scannerIndex % Math.max(1, marketProperties.length)];

  // Portfolio total stats
  const totalPortfolioValue = ownedProperties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalDebt = ownedProperties.reduce((sum, p) => sum + (p.mortgage ? p.mortgage.remainingBalance : 0), 0);
  const totalEquity = totalPortfolioValue - totalDebt;
  const totalMonthlyRent = ownedProperties.reduce((sum, p) => sum + (p.tenant ? p.tenant.agreedRent : 0), 0);
  const totalMonthlyExpenses = ownedProperties.reduce((sum, p) => sum + p.monthlyExpenses + (p.mortgage ? p.mortgage.monthlyPayment : 0), 0);
  const netMonthlyCashFlow = totalMonthlyRent - totalMonthlyExpenses;
  const totalUnclaimedRent = ownedProperties.reduce((sum, p) => sum + (p.collectedRentUnclaimed || 0), 0);

  // Seller reaction logic based on offer vs asking price
  const getSellerReaction = (offer: number, asking: number) => {
    const ratio = offer / asking;
    const negotiationLevel = player.skills.negotiation.level;
    const adjustedRatio = ratio + (negotiationLevel - 1) * 0.02;

    if (adjustedRatio >= 0.98) return { text: 'Accepting with enthusiasm!', color: 'text-emerald-400', chance: 95 };
    if (adjustedRatio >= 0.92) return { text: 'Interested & favorable', color: 'text-teal-400', chance: 80 };
    if (adjustedRatio >= 0.85) return { text: 'Uncertain, contemplating', color: 'text-amber-400', chance: 50 };
    if (adjustedRatio >= 0.75) return { text: 'Reluctant, borderline offended', color: 'text-orange-400', chance: 20 };
    return { text: 'Offended! High risk of rejection', color: 'text-rose-400', chance: 5 };
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Top Segmented Tabs */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'portfolio' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Portfolio ({ownedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'scanner' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Market Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('auctions')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'auctions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Distressed Auctions</span>
        </button>
      </div>

      {/* PORTFOLIO TAB */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          {/* Overview Dashboard Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  REAL ESTATE PORTFOLIO
                </span>
                <h3 className="text-base font-bold text-slate-100">Asset & Income Summary</h3>
              </div>

              {/* Collect Rent Action */}
              <div className="flex items-center gap-2">
                {!autoCollectRentUnlocked && (
                  <button
                    onClick={() => unlockAutoCollectManager()}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-[11px] font-semibold cursor-pointer transition"
                    title="Hire Property Manager to auto-collect rent daily"
                  >
                    Hire Manager ($2.5k)
                  </button>
                )}
                <button
                  onClick={() => collectRent()}
                  disabled={totalUnclaimedRent === 0}
                  className={`px-3 py-1.5 font-bold rounded-xl text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1 ${
                    totalUnclaimedRent > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-75'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Collect Rent {totalUnclaimedRent > 0 ? `(${formatCurrency(totalUnclaimedRent)})` : ''}</span>
                </button>
              </div>
            </div>

            {/* Metric Grids */}
            <div className="grid grid-cols-3 gap-2 bg-slate-800/60 p-3 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400">PORTFOLIO</span>
                <div className="text-xs sm:text-sm font-bold text-slate-100">
                  {formatCurrency(totalPortfolioValue)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">EQUITY</span>
                <div className="text-xs sm:text-sm font-bold text-indigo-400">
                  {formatCurrency(totalEquity)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">NET CASH FLOW</span>
                <div className={`text-xs sm:text-sm font-bold ${netMonthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(netMonthlyCashFlow)}/mo
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-0.5">
              <span>Gross Rent: <strong className="text-emerald-400">{formatCurrency(totalMonthlyRent)}/mo</strong></span>
              <span>Debt & OpEx: <strong className="text-slate-300">{formatCurrency(totalMonthlyExpenses)}/mo</strong></span>
            </div>
          </div>

          {/* Owned Property Cards */}
          {ownedProperties.length === 0 ? (
            <div className="bg-slate-900/80 border border-dashed border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <Home className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                You don't own any properties yet. Head to the <strong className="text-indigo-300">Market Scanner</strong> to inspect your first fixer-upper or turn-key rental!
              </p>
              <button
                onClick={() => setActiveTab('scanner')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Scan Properties
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {ownedProperties.map((property) => {
                return (
                  <div
                    key={property.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-lg space-y-3 p-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={property.image}
                        alt={property.address}
                        className="w-24 h-24 object-cover rounded-2xl border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                            {property.neighborhood}
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            {formatCurrency(property.currentValue)}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-100 truncate mt-0.5">
                          {property.address}
                        </h4>

                        <div className="flex items-center gap-2 mt-1.5 text-xs">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                            Condition: {property.overallCondition}%
                          </span>
                          {property.tenant ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-semibold">
                              Occupied (${property.tenant.agreedRent}/mo)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-400 border border-amber-800/40 font-semibold">
                              Vacant
                            </span>
                          )}
                        </div>

                        {property.collectedRentUnclaimed > 0 ? (
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              <span>Pending Rent: {formatCurrency(property.collectedRentUnclaimed)}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                collectRent(property.id);
                              }}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition active:scale-95 cursor-pointer shadow-sm"
                            >
                              Collect
                            </button>
                          </div>
                        ) : property.tenant ? (
                          <div className="text-[11px] text-slate-400 mt-1">
                            Rent current (${property.tenant.agreedRent}/mo)
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setInspectingProperty(property)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        <span>Inspect & Renovate</span>
                      </button>

                      <button
                        onClick={() => setLeasingProperty(property)}
                        className="py-2 px-3 bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-800/60 rounded-xl text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                      >
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{property.tenant ? 'Manage Tenant' : 'Find Tenant'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SCANNER TAB (TINDER-STYLE CARDS) */}
      {activeTab === 'scanner' && (
        <div className="space-y-4">
          {marketProperties.length === 0 ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">All available deals in the market have been reviewed!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Card deck */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3">
                <div className="relative h-48 sm:h-56 w-full">
                  <img
                    src={currentScannedProperty.image}
                    alt={currentScannedProperty.address}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                  {/* Top tags */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-xs font-bold text-indigo-300 border border-slate-700/60">
                      {currentScannedProperty.neighborhood}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-xs font-bold text-slate-300 border border-slate-700/60">
                      {currentScannedProperty.daysOnMarket} days listed
                    </span>
                  </div>

                  <button
                    onClick={() => toggleWatchlistProperty(currentScannedProperty.id)}
                    className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-md rounded-xl text-slate-300 hover:text-amber-400 border border-slate-700/60 cursor-pointer"
                    title="Bookmark"
                  >
                    <Bookmark className={`w-4 h-4 ${currentScannedProperty.isWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  {/* Bottom title & price overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white drop-shadow">
                        {currentScannedProperty.address}
                      </h3>
                      <span className="text-xs text-slate-300">
                        Est. Rent: <strong className="text-emerald-400">{formatCurrency(currentScannedProperty.estimatedRent)}/mo</strong>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg sm:text-xl font-black text-emerald-400 drop-shadow">
                        {formatCurrency(currentScannedProperty.askingPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details breakdown */}
                <div className="p-4 pt-1 space-y-3">
                  <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-2.5 rounded-2xl border border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400">CONDITION</span>
                      <div className="text-xs font-bold text-slate-100">
                        {currentScannedProperty.overallCondition}%
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">EXPENSES</span>
                      <div className="text-xs font-bold text-rose-400">
                        {formatCurrency(currentScannedProperty.monthlyExpenses)}/mo
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">EST. EQUITY UPSIDE</span>
                      <div className="text-xs font-bold text-indigo-400">
                        +$25,000+
                      </div>
                    </div>
                  </div>

                  {/* Swipe Control Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setScannerIndex((prev) => prev + 1)}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                    >
                      <X className="w-4 h-4 text-rose-400" />
                      <span>Pass (Swipe Left)</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPropertyToAnalyze(currentScannedProperty);
                        setNegotiationOffer(currentScannedProperty.askingPrice);
                      }}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Analyze & Offer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AUCTIONS TAB */}
      {activeTab === 'auctions' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Live Distressed Foreclosure Auctions</h3>
                <p className="text-xs text-slate-400">Compete against AI investors (Marcus, Sarah, Nina)</p>
              </div>
            </div>

            {activeAuction && activeAuction.active ? (
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Bidding in Progress • 30s Countdown
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                    Highest: {activeAuction.highestBidder}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{activeAuction.property.address}</h4>
                    <span className="text-xs text-slate-400">Market Value: {formatCurrency(activeAuction.property.currentValue)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Current Bid</span>
                    <div className="text-lg font-black text-emerald-400">
                      {formatCurrency(activeAuction.currentBid)}
                    </div>
                  </div>
                </div>

                {/* Bidding Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => bidInAuction(activeAuction.currentBid + 2500)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition active:scale-95"
                  >
                    Bid +$2,500 ({formatCurrency(activeAuction.currentBid + 2500)})
                  </button>
                  <button
                    onClick={() => closeAuction()}
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
                  >
                    Withdraw / Conclude
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-2">
                <p className="text-xs text-slate-300">Select an available distressed asset to open bidding floor:</p>
                {marketProperties.slice(0, 3).map((prop) => (
                  <div
                    key={prop.id}
                    className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{prop.address}</h4>
                      <span className="text-[11px] text-slate-400">Asking: {formatCurrency(prop.askingPrice)}</span>
                    </div>
                    <button
                      onClick={() => startAuction(prop.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl cursor-pointer transition active:scale-95"
                    >
                      Start Bidding
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CASH FLOW ANALYSIS & DEAL NEGOTIATOR MODAL */}
      {selectedPropertyToAnalyze && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase">
                  Deal Negotiator & Underwriting
                </span>
                <h3 className="text-base font-bold text-slate-100">{selectedPropertyToAnalyze.address}</h3>
              </div>
              <button
                onClick={() => setSelectedPropertyToAnalyze(null)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Offer Slider */}
            <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Offer Price</span>
                <span className="text-base font-bold text-emerald-400">
                  {formatCurrency(negotiationOffer)}
                </span>
              </div>

              <input
                type="range"
                min={Math.round(selectedPropertyToAnalyze.askingPrice * 0.7)}
                max={Math.round(selectedPropertyToAnalyze.askingPrice * 1.15)}
                step={1000}
                value={negotiationOffer}
                onChange={(e) => setNegotiationOffer(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Asking: {formatCurrency(selectedPropertyToAnalyze.askingPrice)}</span>
                <span className={`font-semibold ${getSellerReaction(negotiationOffer, selectedPropertyToAnalyze.askingPrice).color}`}>
                  Seller: {getSellerReaction(negotiationOffer, selectedPropertyToAnalyze.askingPrice).text}
                </span>
              </div>
            </div>

            {/* Down Payment % Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Down Payment Structure</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 50, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDownPaymentPercent(pct)}
                    className={`py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition ${
                      downPaymentPercent === pct
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {pct === 100 ? 'All Cash' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Cash Flow Calculation */}
            {(() => {
              const downPaymentAmount = Math.round(negotiationOffer * (downPaymentPercent / 100));
              const loanPrincipal = negotiationOffer - downPaymentAmount;
              const closingCosts = Math.round(negotiationOffer * 0.03);
              const totalInitialCash = downPaymentAmount + closingCosts;

              const monthlyMortgage = loanPrincipal > 0
                ? Math.round((loanPrincipal * (0.065 / 12) * Math.pow(1 + 0.065 / 12, 360)) / (Math.pow(1 + 0.065 / 12, 360) - 1))
                : 0;

              const monthlyNet = selectedPropertyToAnalyze.estimatedRent - selectedPropertyToAnalyze.monthlyExpenses - monthlyMortgage;
              const annualCashFlow = monthlyNet * 12;
              const estimatedRoi = totalInitialCash > 0 ? ((annualCashFlow / totalInitialCash) * 100).toFixed(1) : '0';

              return (
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">CASH NEEDED</span>
                      <div className="font-bold text-slate-100">{formatCurrency(totalInitialCash)}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">EST. CASH FLOW</span>
                      <div className={`font-bold ${monthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(monthlyNet)}/mo
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">EST. CASH-ON-CASH</span>
                      <div className="font-bold text-indigo-400">{estimatedRoi}%</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const sellerChance = getSellerReaction(negotiationOffer, selectedPropertyToAnalyze.askingPrice).chance;
                        if (Math.random() * 100 > sellerChance) {
                          alert('Seller rejected the low offer! Try increasing your offer price or negotiation skill.');
                          return;
                        }
                        if (buyProperty(selectedPropertyToAnalyze.id, negotiationOffer, downPaymentPercent, 30)) {
                          setSelectedPropertyToAnalyze(null);
                          setActiveTab('portfolio');
                        }
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg cursor-pointer transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>Submit Purchase Contract</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* INSPECTION & RENOVATION MODAL */}
      {inspectingProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase">
                  Fixer-Upper Renovation Workshop
                </span>
                <h3 className="text-base font-bold text-slate-100">{inspectingProperty.address}</h3>
              </div>
              <button
                onClick={() => setInspectingProperty(null)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Renovate individual house areas to elevate tenant rent, appraisal equity, and property demand. Choose DIY to save cash or hire contractors for instant zero-energy execution.
            </p>

            {/* 7 Inspection areas */}
            <div className="space-y-2.5">
              {inspectingProperty.areas.map((area) => {
                const diyCost = Math.round(area.repairCost * 0.35);
                const hasDiySkill = player.skills.handyman.level >= area.diySkillReq;
                const hasDiyCash = player.cash >= diyCost;
                const hasDiyEnergy = player.energy >= area.diyEnergyCost;
                const canDiy = hasDiySkill && hasDiyCash && hasDiyEnergy && area.condition < 95;
                const canContractor = player.cash >= area.repairCost && area.condition < 95;

                return (
                  <div
                    key={area.id}
                    className="p-3 bg-slate-800/60 border border-slate-800 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{area.name}</span>
                      <span className={`text-xs font-semibold ${
                        area.condition >= 85 ? 'text-emerald-400' : area.condition >= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {area.condition}% Condition
                      </span>
                    </div>

                    <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          area.condition >= 85 ? 'bg-emerald-400' : area.condition >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${area.condition}%` }}
                      />
                    </div>

                    {area.condition < 95 ? (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          disabled={!canDiy}
                          onClick={() => {
                            if (renovatePropertyArea(inspectingProperty.id, area.id, 'diy')) {
                              // Update local state
                              setInspectingProperty((prev) => {
                                if (!prev) return null;
                                return ownedProperties.find((p) => p.id === prev.id) || null;
                              });
                            }
                          }}
                          className={`p-2 rounded-xl text-left border text-[11px] font-semibold cursor-pointer transition ${
                            canDiy
                              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-amber-400 font-bold">DIY Work ({formatCurrency(diyCost)})</div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            ⚡ {area.diyEnergyCost} En • Req: Lvl {area.diySkillReq} Handyman
                          </span>
                        </button>

                        <button
                          disabled={!canContractor}
                          onClick={() => {
                            if (renovatePropertyArea(inspectingProperty.id, area.id, 'contractor')) {
                              setInspectingProperty((prev) => {
                                if (!prev) return null;
                                return ownedProperties.find((p) => p.id === prev.id) || null;
                              });
                            }
                          }}
                          className={`p-2 rounded-xl text-left border text-[11px] font-semibold cursor-pointer transition ${
                            canContractor
                              ? 'bg-indigo-950/50 hover:bg-indigo-900/50 border-indigo-800/60 text-indigo-300'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-indigo-300 font-bold">Contractor ({formatCurrency(area.repairCost)})</div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Instant 100% • 0 Energy</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-400 font-semibold text-center py-1">
                        ✓ Restored to Mint Quality
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TENANT MANAGEMENT MODAL */}
      {leasingProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase">
                  Tenant Leasing Office
                </span>
                <h3 className="text-base font-bold text-slate-100">{leasingProperty.address}</h3>
              </div>
              <button
                onClick={() => setLeasingProperty(null)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {leasingProperty.tenant ? (
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100">{leasingProperty.tenant.name}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-950/40 text-emerald-400 rounded-lg border border-emerald-800/40">
                    {leasingProperty.tenant.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>Agreed Rent: <strong className="text-emerald-400">{formatCurrency(leasingProperty.tenant.agreedRent)}/mo</strong></div>
                  <div>Reliability: <strong className="text-indigo-300">{leasingProperty.tenant.reliability}%</strong></div>
                  <div>Lease Term: <strong>{leasingProperty.tenant.leaseMonths} months</strong></div>
                  <div>Deposit Held: <strong>{formatCurrency(leasingProperty.tenant.depositPaid)}</strong></div>
                </div>

                <button
                  onClick={() => {
                    evictTenant(leasingProperty.id);
                    setLeasingProperty(null);
                  }}
                  className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  End Lease / Evict Tenant
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Select an applicant to sign a 12-month lease agreement:</p>
                {[
                  { name: 'Dr. Liam Vance', type: 'Corporate' as const, budget: leasingProperty.estimatedRent + 150, rel: 95, deposit: 2000 },
                  { name: 'Chloe & Ben Miller', type: 'Family' as const, budget: leasingProperty.estimatedRent, rel: 90, deposit: 1200 },
                  { name: 'Sam Thorne', type: 'Young Professional' as const, budget: leasingProperty.estimatedRent - 50, rel: 85, deposit: 900 },
                  { name: 'College Roommates', type: 'Student' as const, budget: leasingProperty.estimatedRent - 150, rel: 75, deposit: 600 },
                ].map((applicant, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/40 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-200">{applicant.name}</span>
                        <span className="text-[10px] text-slate-400 block">{applicant.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400">{formatCurrency(applicant.budget)}/mo</span>
                        <span className="text-[10px] text-slate-400 block">{applicant.rel}% reliable</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const newTenant: Tenant = {
                          id: 'tenant_' + Date.now(),
                          name: applicant.name,
                          type: applicant.type,
                          monthlyBudget: applicant.budget,
                          reliability: applicant.rel,
                          satisfaction: 90,
                          leaseMonths: 12,
                          depositPaid: applicant.deposit,
                          agreedRent: applicant.budget,
                        };
                        setTenantToProperty(leasingProperty.id, newTenant);
                        setLeasingProperty(null);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Sign Lease Agreement (+{formatCurrency(applicant.deposit)} deposit)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
