import React, { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { X, Check, ShieldAlert, Sparkles, AlertCircle, CreditCard, Loader2 } from "lucide-react";

export default function UpgradeModal() {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, plan, setPlan, resetAllowances } = useSubscription();
  const [checkoutStep, setCheckoutStep] = useState<"compare" | "billing" | "success">("compare");
  const [paymentGateway, setPaymentGateway] = useState<"card" | "paystack" | "flutterwave">("card");
  const [paystackBank, setPaystackBank] = useState("Access Bank");
  const [paystackPhone, setPaystackPhone] = useState("");
  const [flutterMobileNum, setFlutterMobileNum] = useState("");
  const [flutterNetwork, setFlutterNetwork] = useState("MTN");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [formError, setFormError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    setCardNumber(parts.length > 0 ? parts.join(" ") : "");
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 4);
    if (value.length > 2) {
      setExpiry(`${value.substring(0, 2)}/${value.substring(2)}`);
    } else {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value.substring(0, 3));
  };

  const handleProcessUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (paymentGateway === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setFormError("Card number must be 16 digits.");
        return;
      }
      if (expiry.length < 5) {
        setFormError("Expiry must be MM/YY.");
        return;
      }
      if (cvv.length < 3) {
        setFormError("CVV must be 3 digits.");
        return;
      }
      if (!nameOnCard.trim()) {
        setFormError("Cardholder name is required.");
        return;
      }
    } else if (paymentGateway === "paystack") {
      if (!paystackPhone.trim()) {
        setFormError("Phone number is required for Paystack transaction reference.");
        return;
      }
    } else if (paymentGateway === "flutterwave") {
      if (!flutterMobileNum.trim()) {
        setFormError("Mobile money number is required for Flutterwave dynamic validation.");
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPlan("premium");
      setCheckoutStep("success");
    }, 1800);
  };

  const handleClose = () => {
    setIsUpgradeModalOpen(false);
    // Reset steps after closing
    setTimeout(() => {
      setCheckoutStep("compare");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setNameOnCard("");
      setFormError("");
    }, 300);
  };

  return (
    <div id="upgrade-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div id="upgrade-modal-card" className="relative w-full max-w-4xl bg-[#0e111a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {checkoutStep === "compare" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            {/* Plan Info Column */}
            <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> PDA Enterprise
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Upgrade your Neural Workspace</h2>
                <p className="text-xs text-slate-400">Compare access brackets and unlock unlimited visual, acoustic, and mathematical creative generators.</p>
              </div>

              {/* Comparison table */}
              <div className="space-y-4">
                {/* Free features */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">Included in Free Tier</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Unlimited Multimodal Chat</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Unlimited Dynamic Research</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Unlimited Voice Arena Chat</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>File Upload Analysis Enabled</span>
                    </div>
                  </div>
                </div>

                {/* Day allowances limits */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">Daily Creative Allocations (Free Plan)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-mono text-slate-400 text-center">
                    <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-850">
                      <span className="block text-slate-300 font-semibold mb-0.5">Image Gen</span>
                      <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-indigo-400">10 / day</span>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-850">
                      <span className="block text-slate-300 font-semibold mb-0.5">Image Edit</span>
                      <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-indigo-400">10 / day</span>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-850">
                      <span className="block text-slate-300 font-semibold mb-0.5">Video Gen</span>
                      <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-indigo-400">10 / day</span>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-850">
                      <span className="block text-slate-300 font-semibold mb-0.5">Video Edit</span>
                      <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-indigo-400">10 / day</span>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-850">
                      <span className="block text-slate-300 font-semibold mb-0.5">Music Gen</span>
                      <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-indigo-400">10 / day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing / CTA Column */}
            <div className="lg:col-span-5 bg-[#121624] border-t lg:border-t-0 lg:border-l border-slate-800 p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Premium Plan Access</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-white font-mono">$19</span>
                    <span className="text-slate-400 text-xs">/ month</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Scale your execution velocity with prioritized model endpoints and absolute zero limits.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Uncapped allowances</strong> on all graphic, narrative, audio & cinematic modules</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>No commercial advertising breaks</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Priority rendering queues (Ultra fast response cycles)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Advanced neural models (Unlock GPT integration proxy)</span>
                  </div>
                </div>
              </div>

              {plan === "premium" ? (
                <div className="mt-8 p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-emerald-400 font-semibold font-mono uppercase tracking-widest">You are Premium Active</p>
                  <button
                    onClick={() => {
                      setPlan("free");
                      resetAllowances();
                    }}
                    className="w-full text-[11px] font-mono text-slate-400 hover:text-white underline transition-colors"
                  >
                    Simulate demoting to Free Plan
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCheckoutStep("billing")}
                  className="mt-8 w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-xl text-xs md:text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 text-center"
                >
                  Acquire Premium Plan
                </button>
              )}
            </div>
          </div>
        )}

        {checkoutStep === "billing" && (
          <div className="p-8 md:p-12 max-w-lg mx-auto w-full space-y-6 overflow-y-auto">
            <div className="text-center space-y-2 select-none">
              <CreditCard className="w-10 h-10 text-indigo-400 mx-auto" />
              <h3 className="text-lg md:text-xl font-bold text-white">Payment Interface</h3>
              <p className="text-xs text-slate-400">Select payment partner (Paystack or Flutterwave) to fulfill your upgraded API node node.</p>
            </div>

            {/* Gateway Partner Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0a0c12] rounded-xl border border-slate-850">
              <button
                type="button"
                onClick={() => { setPaymentGateway("card"); setFormError(""); }}
                className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  paymentGateway === "card" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Intl Card
              </button>
              <button
                type="button"
                onClick={() => { setPaymentGateway("paystack"); setFormError(""); }}
                className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  paymentGateway === "paystack" ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-white"
                }`}
              >
                Paystack
              </button>
              <button
                type="button"
                onClick={() => { setPaymentGateway("flutterwave"); setFormError(""); }}
                className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  paymentGateway === "flutterwave" ? "bg-slate-800 text-indigo-400" : "text-slate-400 hover:text-white"
                }`}
              >
                Flutterwave
              </button>
            </div>

            <form onSubmit={handleProcessUpgrade} className="space-y-4">
              {formError && (
                <div className="p-3.5 bg-rose-955/20 border border-rose-900/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {paymentGateway === "card" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                      Cardholder Identity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MIRACLE EWOMA"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                      Credit Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 1234 5678"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                        Expiration Frame
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                        CVC Shield
                      </label>
                      <input
                        type="password"
                        placeholder="***"
                        value={cvv}
                        onChange={handleCvvChange}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentGateway === "paystack" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Total charge:</span>
                    <span className="text-emerald-400 font-bold">$19.00 USD (~ ₦31,400 NGN)</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                      Select Verification Bank Channel
                    </label>
                    <select
                      value={paystackBank}
                      onChange={(e) => setPaystackBank(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none cursor-pointer"
                    >
                      <option value="Access Bank">Access Bank Plc</option>
                      <option value="Guarantee Trust Bank">GTBank (Guarantee Trust)</option>
                      <option value="Zenith Bank">Zenith Bank Plc</option>
                      <option value="United Bank for Africa">UBA (United Bank for Africa)</option>
                      <option value="Kuda Bank">Kuda Microfinance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                      Naira Secure Phone Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +234 801 234 5678"
                      value={paystackPhone}
                      onChange={(e) => setPaystackPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-105 placeholder-slate-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentGateway === "flutterwave" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Total charge:</span>
                    <span className="text-indigo-400 font-bold">$19.00 USD (~₵285 GHS / ₦31,400)</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                      Mobile Network Partner
                    </label>
                    <select
                      value={flutterNetwork}
                      onChange={(e) => setFlutterNetwork(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none cursor-pointer"
                    >
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="Airtel">Airtel-Tigo Wallet</option>
                      <option value="Vodafone">Vodafone Cash</option>
                      <option value="Glo">Glo Wallet Node</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                      Mobile Money Wallet Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 055 123 4567"
                      value={flutterMobileNum}
                      onChange={(e) => setFlutterMobileNum(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-105 placeholder-slate-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                <ShieldAlert className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-[10px] text-slate-400 leading-relaxed">
                  This checkout transaction is fully simulated. No real currency is charged. Tested via {paymentGateway === "card" ? "Stripe Sandbox" : paymentGateway === "paystack" ? "Paystack API V2" : "Flutterwave v3 API"}.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("compare")}
                  disabled={isProcessing}
                  className="py-2.5 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow shadow-indigo-600/10"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{paymentGateway === "card" ? "Charging Card..." : paymentGateway === "paystack" ? "Pinging Paystack..." : "Deploying Flutterwave..."}</span>
                    </>
                  ) : (
                    <span>Process Upgrade</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {checkoutStep === "success" && (
          <div className="p-8 md:p-12 text-center max-w-md mx-auto w-full space-y-6 overflow-y-auto select-none">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Advanced Gateway Unlocked</h3>
              <p className="text-xs text-slate-400">Your client profile has been established with unlimited credentials. You now hold complete priority access.</p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 text-left text-xs text-slate-300 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500ID uppercase">Client Level:</span>
                <span className="text-indigo-400 font-bold">PREMIUM ENTERPRISE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500ID uppercase">Daily Allowances:</span>
                <span className="text-emerald-400 font-bold">UNLIMITED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500ID uppercase">Ad Protection:</span>
                <span className="text-emerald-400 font-bold">ACTIVE (0 ADS)</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-indigo-650 hover:bg-indigo-550 text-white rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer"
            >
              Enter Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
