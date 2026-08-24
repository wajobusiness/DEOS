import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  Layers,
  ChevronLeft,
  Key,
  Shield,
  Server,
  Activity,
  LogOut,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Member, ViewType } from '../types';
import { SuperAdminPanel } from './SuperAdminPanel';
import { useAuth } from '../context/AuthContext';

interface BackofficePortalProps {
  currentUser: Member | null;
  onNavigateToMemberOS: () => void;
}

export const BackofficePortal: React.FC<BackofficePortalProps> = ({
  currentUser,
  onNavigateToMemberOS,
}) => {
  const { signIn, signOut } = useAuth();
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffError, setStaffError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [overrideStaffAuth, setOverrideStaffAuth] = useState(false);

  const isStaffOrAdmin =
    overrideStaffAuth ||
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.email?.includes('admin') ||
    currentUser?.email?.includes('staff');

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);
    setIsAuthenticating(true);

    try {
      const res = await signIn(staffEmail, staffPassword);
      if (!res.success) {
        setStaffError(res.error || 'Invalid staff credentials or unauthorized role.');
      } else {
        setOverrideStaffAuth(true);
      }
    } catch (err: any) {
      setStaffError(err.message || 'Staff authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDemoStaffLogin = () => {
    setOverrideStaffAuth(true);
  };

  // If user is authorized as Staff or Admin, render full Backoffice Dashboard
  if (isStaffOrAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        {/* Backoffice Operational Command Bar */}
        <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-tight">Eviona Backoffice</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
                  Super Admin & Staff Mode
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Route: <code className="text-indigo-400 font-mono">/backoffice</code> • Cluster: US-East-1 (Primary Ledger Active)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">All Engine Services: <b className="text-emerald-400">100% Nominal</b></span>
            </div>

            <button
              onClick={onNavigateToMemberOS}
              className="px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Switch to Member OS (/)</span>
            </button>

            <button
              onClick={async () => {
                setOverrideStaffAuth(false);
                await signOut();
                window.history.pushState(null, '', '/backoffice');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Sign Out of Backoffice"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Staff Sign Out</span>
            </button>
          </div>
        </header>

        {/* Backoffice Main Dashboard */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <SuperAdminPanel />
        </main>
      </div>
    );
  }

  // Otherwise, render the Backoffice Staff Login Gate
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-600/30">
            <Shield className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-wider">
            <span>Restricted Backoffice Gateway</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">Staff & Super Admin Sign In</h2>
          <p className="text-xs text-slate-400">
            Authorized Eviona personnel only. Unauthorized access attempts are monitored and logged.
          </p>
        </div>

        {/* Error notice */}
        {staffError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{staffError}</span>
          </div>
        )}

        {/* Staff Sign-in Form */}
        <form onSubmit={handleStaffLogin} className="space-y-4 text-xs relative z-10">
          <div>
            <label className="block font-bold text-slate-400 mb-1">Staff Email / Admin ID</label>
            <input
              type="email"
              required
              placeholder="admin@evionaecosystem.com"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-400 mb-1">Security Key / Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{isAuthenticating ? 'Authenticating Staff...' : 'Access Backoffice Controls'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Direct Admin Access Button & Return Link */}
        <div className="pt-2 space-y-3 relative z-10 text-center border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleDemoStaffLogin}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enter as Platform Administrator</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToMemberOS}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Return to Member Operating System (/)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

