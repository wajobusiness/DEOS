import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ViewType } from '../../types';

interface LaunchWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
}

export const LaunchWizardModal: React.FC<LaunchWizardModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: 'Free Registration Completed', view: 'dashboard' as ViewType },
    { id: 2, title: 'Profile & Member ID Provisioned', view: 'settings' as ViewType },
    { id: 3, title: 'Executive Video Orientation Watched', view: 'dashboard' as ViewType },
    { id: 4, title: 'Multi-Currency Eviona Wallet Activated', view: 'wallet' as ViewType },
    { id: 5, title: 'EVO Token Deposit & Activation Completed', view: 'deposit' as ViewType },
    { id: 6, title: 'Growth Plan Membership Activated', view: 'settings' as ViewType },
    { id: 7, title: 'Subdomain Provisioned (username.evionaecosystem.com)', view: 'builder' as ViewType },
    { id: 8, title: 'Free Domain Voucher Claimed', view: 'builder' as ViewType },
    { id: 9, title: 'Custom Domain Connected & SSL Verified', view: 'builder' as ViewType },
    { id: 10, title: 'Business Website Theme Published', view: 'builder' as ViewType },
    { id: 11, title: 'Eviona CRM Lead Capture & Form Funnel Activated', view: 'crm' as ViewType },
    { id: 12, title: 'Select First Eviona Marketplace Product to Promote', view: 'marketplace' as ViewType },
    { id: 13, title: 'Binary Leg Preference Configured (2:1 Balancing)', view: 'binary' as ViewType },
    { id: 14, title: 'Eviona Academy Lesson 1 Completed', view: 'academy' as ViewType },
    { id: 15, title: 'Share First Affiliate Referral Link', view: 'partner' as ViewType },
  ];

  const toggleStep = (id: number) => {
    setCompletedSteps(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const progressPct = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">15-Step Business Launch Wizard</h3>
              <p className="text-xs text-slate-500">Book 2 Chapter 4 Complete Launch Checklist</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="py-4 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-800">
            <span>Launch Progress</span>
            <span className="text-indigo-600">{completedSteps.length} of 15 Complete ({progressPct}%)</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* 15 Steps List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {steps.map((step) => {
            const isDone = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isDone
                    ? 'bg-slate-50/60 border-slate-200 text-slate-700'
                    : 'bg-white border-indigo-200 text-slate-900 shadow-xs'
                }`}
              >
                <div
                  onClick={() => toggleStep(step.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 font-bold'}`}>
                    {step.id}. {step.title}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onNavigate(step.view);
                    onClose();
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1"
                >
                  <span>Open</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">All configurations save automatically to your business profile.</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

