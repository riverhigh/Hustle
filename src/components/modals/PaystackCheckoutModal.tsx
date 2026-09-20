import React, { useState, useEffect, useRef } from 'react';
import { 
  Gem, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Copy, 
  Check, 
  CreditCard, 
  Lock,
  Search
} from 'lucide-react';
import { GemBundle } from '../../constants/gemBundles';
import { initializePaystackTransaction, verifyPaystackPayment, loadPaystackScript } from '../../utils/paystack';
import { formatCurrency } from '../../utils/formatters';

interface PaystackCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: GemBundle | null;
  currency: 'USD' | 'NGN';
  onSuccess: (reference: string, totalGems: number) => void;
}

export const PaystackCheckoutModal: React.FC<PaystackCheckoutModalProps> = ({
  isOpen,
  onClose,
  bundle,
  currency,
  onSuccess,
}) => {
  const [step, setStep] = useState<'initializing' | 'ready' | 'verifying' | 'confirmed' | 'failed'>('initializing');
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [totalGems, setTotalGems] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [manualRefInput, setManualRefInput] = useState<string>('');
  const [showManualVerify, setShowManualVerify] = useState<boolean>(false);
  const [isVerifyingManual, setIsVerifyingManual] = useState<boolean>(false);
  const [manualVerifyResult, setManualVerifyResult] = useState<{ success: boolean; msg: string } | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef<boolean>(true);

  // Initialize transaction when modal opens with bundle
  useEffect(() => {
    isComponentMounted.current = true;

    if (!isOpen || !bundle) {
      setStep('initializing');
      setAuthUrl(null);
      setAccessCode(null);
      setReference(null);
      setErrorMessage(null);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    const startTransaction = async () => {
      setStep('initializing');
      setErrorMessage(null);

      const calculatedGems = bundle.gems + bundle.bonusGems;
      setTotalGems(calculatedGems);

      const initRes = await initializePaystackTransaction(bundle, currency, 'printblue436@gmail.com');

      if (!isComponentMounted.current) return;

      if (initRes.success && initRes.authorizationUrl && initRes.accessCode && initRes.reference) {
        setAuthUrl(initRes.authorizationUrl);
        setAccessCode(initRes.accessCode);
        setReference(initRes.reference);
        setTotalGems(initRes.totalGems || calculatedGems);
        setStep('ready');

        // Automatically attempt to launch Paystack inline popup
        launchPaystackInline(initRes.accessCode, initRes.reference, initRes.authorizationUrl);

        // Start background polling to check if user finishes payment
        startPolling(initRes.reference, initRes.totalGems || calculatedGems);
      } else {
        setStep('failed');
        setErrorMessage(initRes.error || 'Failed to initialize Paystack payment.');
      }
    };

    startTransaction();

    return () => {
      isComponentMounted.current = false;
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, bundle, currency]);

  // Launches the Paystack Inline popup
  const launchPaystackInline = async (code: string, ref: string, url?: string) => {
    await loadPaystackScript();
    const PaystackPop = (window as any)?.PaystackPop;

    let launched = false;

    if (PaystackPop) {
      try {
        if (typeof PaystackPop === 'function') {
          const popup = new PaystackPop();
          if (typeof popup.resumeTransaction === 'function') {
            popup.resumeTransaction(code, {
              onSuccess: () => {
                handleVerifyPayment(ref);
              },
              onCancel: () => {
                // Keep modal open so user can retry or check
              },
            });
            launched = true;
          }
        }
      } catch (err) {
        console.warn('Could not launch Paystack inline resumeTransaction:', err);
      }
    }

    // Fallback: if popup could not open directly (or inside strict iframe)
    if (!launched && url) {
      try {
        window.open(url, '_blank', 'width=520,height=720');
      } catch (e) {
        console.warn('Popup blocked, user can click the button:', e);
      }
    }
  };

  // Polls Paystack verification periodically while payment is in progress
  const startPolling = (ref: string, gems: number) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    let attempts = 0;
    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 75) {
        // Stop polling after 5 minutes
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        return;
      }

      const verifyRes = await verifyPaystackPayment(ref);
      if (verifyRes.success && verifyRes.status === 'success') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        handlePaymentSuccess(ref, verifyRes.totalGems || gems);
      }
    }, 4000);
  };

  // Verifies the payment with Paystack server
  const handleVerifyPayment = async (refToVerify?: string) => {
    const targetRef = refToVerify || reference;
    if (!targetRef) return;

    setStep('verifying');
    setErrorMessage(null);

    const verifyRes = await verifyPaystackPayment(targetRef);

    if (!isComponentMounted.current) return;

    if (verifyRes.success && verifyRes.status === 'success') {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      handlePaymentSuccess(targetRef, verifyRes.totalGems || totalGems);
    } else {
      setStep('ready');
      setErrorMessage(
        verifyRes.error ||
          'Payment not yet confirmed by Paystack. If you completed payment, wait a few seconds and try again.'
      );
    }
  };

  const handlePaymentSuccess = (ref: string, gems: number) => {
    setStep('confirmed');
    setErrorMessage(null);
    onSuccess(ref, gems);

    // Auto-close after celebration
    setTimeout(() => {
      if (isComponentMounted.current) {
        onClose();
      }
    }, 2400);
  };

  // Manual reference verification
  const handleManualVerify = async () => {
    if (!manualRefInput.trim()) return;
    setIsVerifyingManual(true);
    setManualVerifyResult(null);

    const res = await verifyPaystackPayment(manualRefInput.trim());
    setIsVerifyingManual(false);

    if (res.success && res.status === 'success') {
      setManualVerifyResult({
        success: true,
        msg: `Payment Confirmed! Delivered +${res.totalGems || 50} Gems to your account!`,
      });
      onSuccess(res.reference || manualRefInput.trim(), res.totalGems || 50);
      setTimeout(() => {
        onClose();
      }, 2500);
    } else {
      setManualVerifyResult({
        success: false,
        msg: res.error || 'Could not verify this reference with Paystack.',
      });
    }
  };

  const copyRefToClipboard = () => {
    if (reference) {
      navigator.clipboard.writeText(reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  if (!isOpen) return null;

  const priceFormatted =
    bundle ? (currency === 'NGN' ? `₦${bundle.priceNGN.toLocaleString()}` : `$${bundle.priceUSD.toFixed(2)}`) : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white tracking-wide">Paystack Checkout</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-400">Official Payment Gateway & Gem Delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {bundle && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Gem className="w-6 h-6 text-cyan-200 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{bundle.name}</h4>
                  <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                    <span>+{bundle.gems} Base</span>
                    {bundle.bonusGems > 0 && (
                      <span className="text-amber-400 font-bold">+{bundle.bonusGems} Bonus!</span>
                    )}
                    <span className="text-slate-400 font-normal">({totalGems} Total 💎)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-emerald-400">{priceFormatted}</div>
                <div className="text-[11px] text-slate-400">{currency}</div>
              </div>
            </div>
          )}

          {/* State: Initializing */}
          {step === 'initializing' && (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 animate-spin">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h5 className="text-sm font-bold text-white">Connecting to Paystack...</h5>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Initializing a secure checkout session with Paystack. Please hold on.
              </p>
            </div>
          )}

          {/* State: Ready / Awaiting Payment */}
          {step === 'ready' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-slate-400">Payment Reference:</span>
                  <button
                    onClick={copyRefToClipboard}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] cursor-pointer"
                  >
                    {reference?.slice(0, 18)}...
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Awaiting Payment:</span> Complete the payment in the Paystack popup, or click below to open the checkout page.
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>{errorMessage}</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {authUrl && (
                  <button
                    onClick={() => {
                      if (accessCode && reference) {
                        launchPaystackInline(accessCode, reference, authUrl);
                      } else {
                        window.open(authUrl, '_blank');
                      }
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Paystack Payment Window</span>
                  </button>
                )}

                <button
                  onClick={() => handleVerifyPayment()}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold text-xs rounded-2xl border border-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>I Have Completed Payment — Verify Now</span>
                </button>
              </div>

              {/* Security Footnote */}
              <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5 pt-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Gems are only credited after official Paystack verification</span>
              </div>
            </div>
          )}

          {/* State: Verifying */}
          {step === 'verifying' && (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 animate-spin">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h5 className="text-sm font-bold text-white">Verifying Transaction with Paystack...</h5>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Directly contacting Paystack's API to confirm your payment was received.
              </p>
            </div>
          )}

          {/* State: Confirmed */}
          {step === 'confirmed' && (
            <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-500/20 rounded-full border border-emerald-500/40 text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-lg font-black text-white">Payment Confirmed!</h4>
              <div className="text-base font-bold text-cyan-400">
                +{totalGems.toLocaleString()} Gems Credited 💎
              </div>
              <p className="text-xs text-slate-400">
                Transaction verified and recorded. You can now use your gems in the store!
              </p>
            </div>
          )}

          {/* State: Initialization Failed */}
          {step === 'failed' && (
            <div className="py-6 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-4 bg-rose-500/20 rounded-full border border-rose-500/40 text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h5 className="text-sm font-bold text-white">Payment Initialization Failed</h5>
              <p className="text-xs text-rose-300 max-w-sm mx-auto">
                {errorMessage || 'Could not connect to Paystack. Please verify that your Paystack keys are valid.'}
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

          {/* Manual Reference Checker Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setShowManualVerify(!showManualVerify)}
              className="text-[11px] text-slate-400 hover:text-slate-200 font-semibold flex items-center justify-between w-full cursor-pointer py-1"
            >
              <span>Paid on another tab or device? Check reference manually</span>
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showManualVerify && (
              <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5 animate-in fade-in">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Paystack Transaction Reference:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualRefInput}
                    onChange={(e) => setManualRefInput(e.target.value)}
                    placeholder="e.g. gem_bundle_... or T01234567"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    onClick={handleManualVerify}
                    disabled={isVerifyingManual || !manualRefInput.trim()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    {isVerifyingManual ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Verify'}
                  </button>
                </div>
                {manualVerifyResult && (
                  <div
                    className={`text-xs p-2 rounded-lg ${
                      manualVerifyResult.success
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {manualVerifyResult.msg}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
