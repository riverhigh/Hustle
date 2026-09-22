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
    ownedProperties,
    renovatePropertyArea,
    setTenantToProperty,
    evictTenant,
    collectRent,
    autoCollectRentUnlocked,
    unlockAutoCollectManager,
    openPhoneApp,
  } = useGame();

  const [inspectingProperty, setInspectingProperty] = useState<Property | null>(null);
  const [leasingProperty, setLeasingProperty] = useState<Property | null>(null);

  // Portfolio total stats
  const totalPortfolioValue = ownedProperties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalDebt = ownedProperties.reduce((sum, p) => sum + (p.mortgage ? p.mortgage.remainingBalance : 0), 0);
  const totalEquity = totalPortfolioValue - totalDebt;
  const totalMonthlyRent = ownedProperties.reduce((sum, p) => sum + (p.tenant ? p.tenant.agreedRent : 0), 0);
  const totalMonthlyExpenses = ownedProperties.reduce((sum, p) => sum + p.monthlyExpenses + (p.mortgage ? p.mortgage.monthlyPayment : 0), 0);
  const netMonthlyCashFlow = totalMonthlyRent - totalMonthlyExpenses;
  const totalUnclaimedRent = ownedProperties.reduce((sum, p) => sum + (p.collectedRentUnclaimed || 0), 0);

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Top Header & Phone MLS Shortcut */}
      <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">Property Portfolio</h2>
            <p className="text-[10px] text-slate-400">{ownedProperties.length} Real Estate Assets</p>
          </div>
        </div>

        <button
          onClick={() => openPhoneApp('mls')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md active:scale-95 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Phone MLS Portal</span>
        </button>
      </div>

      {/* PORTFOLIO CONTENT */}
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
            <div className="text-sm font-bold text-slate-200">No properties owned yet</div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Market listings have been moved exclusively to the Phone. Open the verified <strong className="text-indigo-300">MLS Portal</strong> app to underwrite and acquire properties!
            </p>
            <button
              onClick={() => openPhoneApp('mls')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition active:scale-95 flex items-center gap-1.5 mx-auto"
            >
              <Search className="w-4 h-4" />
              <span>Launch Phone MLS Portal</span>
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
