import React, { useState } from 'react';
import {
  Crown,
  ShieldCheck,
  Zap,
  Car,
  Plane,
  Anchor,
  Sparkles,
  Building2,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  BadgePercent,
  Coins,
  ArrowUpRight,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { LUXURY_ITEMS, LuxuryItem } from '../../constants/luxuryItems';

interface VipClubAppProps {
  onBack: () => void;
}

export const VipClubApp: React.FC<VipClubAppProps> = ({ onBack }) => {
  const {
    player,
    netWorth,
    subscribePropertyManagerPass,
    unlockVipClubAccess,
    buyLuxuryItem,
    buyPropertyWithGems,
    payYearlyTaxBill,
    marketProperties,
    taxRecords,
    currentYearGrossIncome,
    estimatedYearlyTaxOwed,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'pass' | 'luxury' | 'vip_realestate' | 'taxes'>('pass');
  const [selectedLuxuryCategory, setSelectedLuxuryCategory] = useState<'all' | 'car' | 'jet' | 'yacht'>('all');

  const filteredLuxury = LUXURY_ITEMS.filter(
    (item) => selectedLuxuryCategory === 'all' || item.category === selectedLuxuryCategory
  );

  const vipProperties = marketProperties.filter((p) => p.isVipExclusive || p.gemPrice);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Header */}
      <div className="bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-b border-amber-500/20 px-4 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-wide text-sm font-black text-amber-300">
                  BLACK CARD & VIP
                </span>
                {player.hasVipClubAccess && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold uppercase">
                    VIP MEMBER
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Exclusive Yields, Luxury & Passes</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 transition"
          >
            Done
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-3 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pass')}
            className={`flex-1 py-1 text-center text-[11px] font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'pass'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Manager Pass
          </button>
          <button
            onClick={() => setActiveTab('luxury')}
            className={`flex-1 py-1 text-center text-[11px] font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'luxury'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Luxury
          </button>
          <button
            onClick={() => setActiveTab('vip_realestate')}
            className={`flex-1 py-1 text-center text-[11px] font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'vip_realestate'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            VIP Estates
          </button>
          <button
            onClick={() => setActiveTab('taxes')}
            className={`flex-1 py-1 text-center text-[11px] font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'taxes'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            IRS Taxes
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 pb-8 space-y-3 no-scrollbar">
        {/* TAB 1: PROPERTY MANAGER PASS ($4.99–$9.99/mo) */}
        {activeTab === 'pass' && (
          <div className="space-y-3">
            {/* Status Hero Card */}
            <div
              className={`rounded-2xl p-4 border transition ${
                player.hasPropertyManagerPass
                  ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/50 shadow-lg'
                  : 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">Property Manager Pass</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Automated empire management & exclusive sovereign perks
                  </p>
                </div>
                <div
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    player.hasPropertyManagerPass
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {player.hasPropertyManagerPass
                    ? `ACTIVE (${player.propertyManagerPassDaysRemaining || 30}d left)`
                    : 'INACTIVE'}
                </div>
              </div>

              {/* 4 Core Features mandated by user */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-xl flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">Auto Rent Collect</div>
                    <div className="text-[10px] text-slate-400">Zero manual clicking</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-xl flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">Daily Cash Bonus</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">+$2,500 every sunrise</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">100% Tax Exemption</div>
                    <div className="text-[10px] text-slate-400">Shields 30% IRS yearly cut</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-xl flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">75% Maint. Cut</div>
                    <div className="text-[10px] text-slate-400">Deep upkeep discount</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Subscription Option:</span>
                  <span className="font-bold text-amber-300">25 💎 or $9.99 / 30 Days</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => subscribePropertyManagerPass('gems')}
                    className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Activate (25 💎)</span>
                  </button>
                  <button
                    onClick={() => subscribePropertyManagerPass('cash')}
                    className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-xl shadow transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Activate ($999)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* VIP Club Access Banner */}
            <div className="rounded-2xl p-4 bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-xs text-white">VIP Club Black Access</h4>
                    <p className="text-[10px] text-slate-400">Exclusive property zones & high-yield auctions</p>
                  </div>
                </div>
                <div
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    player.hasVipClubAccess
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {player.hasVipClubAccess ? 'UNLOCKED' : 'LOCKED'}
                </div>
              </div>

              {!player.hasVipClubAccess && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Unlock with 40 💎 or $25,000:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => unlockVipClubAccess('gems')}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 cursor-pointer shadow"
                    >
                      40 💎
                    </button>
                    <button
                      onClick={() => unlockVipClubAccess('cash')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-700 cursor-pointer"
                    >
                      $25k
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GEM-EXCLUSIVE LUXURY (Supercars, Jets, Mega Yachts) */}
        {activeTab === 'luxury' && (
          <div className="space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedLuxuryCategory('all')}
                className={`flex-1 py-1 text-center text-[10px] font-semibold rounded-lg transition cursor-pointer ${
                  selectedLuxuryCategory === 'all'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400'
                }`}
              >
                All Luxury
              </button>
              <button
                onClick={() => setSelectedLuxuryCategory('car')}
                className={`flex-1 py-1 text-center text-[10px] font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  selectedLuxuryCategory === 'car'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <Car className="w-3 h-3" />
                <span>Supercars</span>
              </button>
              <button
                onClick={() => setSelectedLuxuryCategory('jet')}
                className={`flex-1 py-1 text-center text-[10px] font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  selectedLuxuryCategory === 'jet'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <Plane className="w-3 h-3" />
                <span>Jets</span>
              </button>
              <button
                onClick={() => setSelectedLuxuryCategory('yacht')}
                className={`flex-1 py-1 text-center text-[10px] font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  selectedLuxuryCategory === 'yacht'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <Anchor className="w-3 h-3" />
                <span>Yachts</span>
              </button>
            </div>

            {/* Luxury Items Cards */}
            <div className="space-y-2.5">
              {filteredLuxury.map((item) => {
                const isOwned = player.ownedLuxuryItems?.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition ${
                      isOwned
                        ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                          {item.category === 'supercar' ? (
                            <Car className="w-5 h-5 text-amber-400" />
                          ) : item.category === 'jet' ? (
                            <Plane className="w-5 h-5 text-sky-400" />
                          ) : (
                            <Anchor className="w-5 h-5 text-cyan-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{item.name}</span>
                            {isOwned && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-bold uppercase">
                                OWNED
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {item.category} • +{item.reputationBonus} Rep
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-amber-300">
                          {item.gemPrice} 💎
                        </div>
                        <div className="text-[9px] text-slate-400">
                          +${(item.cashEquivalent / 1_000_000).toFixed(1)}M Net Worth
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>+{item.reputationBonus} Global Prestige</span>
                      </div>

                      {isOwned ? (
                        <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Fleet</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => buyLuxuryItem(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow active:scale-95"
                        >
                          Acquire ({item.gemPrice} 💎)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: VIP EXCLUSIVE PROPERTIES (Purchasable with Gems) */}
        {activeTab === 'vip_realestate' && (
          <div className="space-y-3">
            <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Crown className="w-4 h-4" />
                <span>Private High-Yield Real Estate Offerings</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Exclusive trophy penthouses and sovereign estates available strictly via Gems.
              </p>
            </div>

            <div className="space-y-2.5">
              {vipProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-xs text-white block">{prop.address}</span>
                      <span className="text-[10px] text-slate-400">{prop.neighborhood} • {prop.overallCondition}% Condition</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-300 block">{prop.gemPrice} 💎</span>
                      <span className="text-[9px] text-emerald-400 font-semibold">
                        Rent: ${prop.estimatedRent.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    <span>Valuation: <strong>${prop.currentValue.toLocaleString()}</strong></span>
                    <button
                      onClick={() => buyPropertyWithGems(prop.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow active:scale-95"
                    >
                      Buy for {prop.gemPrice} 💎
                    </button>
                  </div>
                </div>
              ))}

              {vipProperties.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  All VIP properties acquired or none currently available on private market.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: YEARLY TAX SYSTEM (30% Income Tax) */}
        {activeTab === 'taxes' && (
          <div className="space-y-3">
            {/* Tax Overview Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">Yearly Income Tax (30%)</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Annual IRS fiscal assessment levied every 360 game days
                  </p>
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/20">
                  DAY {player.daysPlayed} (Year {Math.max(1, Math.floor(player.daysPlayed / 360) + 1)})
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Year Gross Income:</span>
                  <span className="font-bold text-slate-200">
                    ${(currentYearGrossIncome || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Standard Tax Rate:</span>
                  <span className="font-bold text-slate-200">30%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated Tax Due at Year-End:</span>
                  <span className={`font-bold ${player.hasPropertyManagerPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${(estimatedYearlyTaxOwed || 0).toLocaleString()}
                  </span>
                </div>

                {player.hasPropertyManagerPass ? (
                  <div className="mt-2 p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exempted! Property Manager Pass shields you from 30% IRS tax.</span>
                  </div>
                ) : (
                  <div className="mt-2 p-2 bg-amber-950/40 border border-amber-500/30 rounded-lg flex items-center gap-1.5 text-[11px] text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>30% of your earnings will be automatically filed on Day {Math.floor(player.daysPlayed / 360 + 1) * 360}.</span>
                  </div>
                )}
              </div>

              {/* Outstanding Back Taxes Liens */}
              {(player.accumulatedTaxOwed || 0) > 0 && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
                    <span>Unpaid IRS Tax Lien:</span>
                    <span>${(player.accumulatedTaxOwed || 0).toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-rose-300/80">
                    Unpaid taxes damage your credit score over time. Settle now to restore your credit.
                  </p>
                  <button
                    onClick={() => payYearlyTaxBill()}
                    className="w-full py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow"
                  >
                    Settle Tax Bill (-${(player.accumulatedTaxOwed || 0).toLocaleString()})
                  </button>
                </div>
              )}
            </div>

            {/* Past Tax Records Log */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-300 px-1">Filing History</div>
              {taxRecords.map((record, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-200">
                      Fiscal Year {record.year}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Filed on Day {record.filedOnDay} • Gross: ${record.grossIncome.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    {record.isExempted ? (
                      <span className="text-emerald-400 font-bold text-[11px] block">
                        EXEMPTED (0%)
                      </span>
                    ) : (
                      <span className="text-slate-300 font-bold text-[11px] block">
                        Paid: ${record.taxPaid.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[9px] text-slate-500">Rate: 30%</span>
                  </div>
                </div>
              ))}

              {taxRecords.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No tax filing cycles completed yet. First filing occurs on Day 360.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
