import React, { useState } from 'react';
import {
  Globe,
  ShieldCheck,
  CheckCircle2,
  Copy,
  RefreshCw,
  Mail,
  Archive,
  ArrowRight,
  ExternalLink,
  Plus,
  AlertCircle,
  Clock,
  Key
} from 'lucide-react';
import { defaultDomainConfig } from '../store/useAppStore';
import { Badge } from '../components/common/Badge';

export const DomainIntegration: React.FC = () => {
  const [domainConfig, setDomainConfig] = useState(defaultDomainConfig);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleVerifyDNS = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert('DNS Records successfully verified! SSL certificate is active.');
    }, 1500);
  };

  const backups = [
    { id: 'BAK-104', date: 'Today, 03:00 AM (Auto)', size: '24.5 MB', description: 'Daily scheduled site backup' },
    { id: 'BAK-103', date: 'Yesterday, 08:30 PM (Publish)', size: '24.2 MB', description: 'Triggered by Website Builder publish event' },
    { id: 'BAK-102', date: 'May 18, 2025 (Manual)', size: '23.8 MB', description: 'Pre-theme update snapshot' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Domain Status Strip */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{domainConfig.customDomain}</h2>
              <Badge variant="success" size="sm">● Custom Domain Active</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Default Subdomain: <code className="text-indigo-600 font-mono font-semibold">{domainConfig.subdomain}</code> (Always live)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleVerifyDNS}
            disabled={isVerifying}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isVerifying ? 'Checking DNS...' : 'Verify DNS Status'}</span>
          </button>

          <button
            onClick={() => window.open(`https://${domainConfig.customDomain}`, '_blank')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <span>Visit Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Domain Credit Voucher Redemption Card */}
      {domainConfig.domainCreditVoucher && (
        <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/30 text-white shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Custom Domain Voucher Available</h4>
              <p className="text-xs text-emerald-200">
                Included with your Growth/Legacy plan. Claim your free 1-year .COM registration.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Opening domain registrar search modal...')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all shrink-0"
          >
            Claim Free Domain
          </button>
        </div>
      )}

      {/* DNS Configuration Table & Security Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DNS Records Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">DNS Configuration Records (Book 6 §9)</h4>
                <p className="text-xs text-slate-500">Configure these DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare)</p>
              </div>
              <Badge variant="info" size="sm">Anycast Global CDN</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Host / Name</th>
                    <th className="py-3 px-6">Value / Target</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {domainConfig.dnsRecords.map((rec, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-indigo-600">{rec.type}</td>
                      <td className="py-3.5 px-6 font-semibold">{rec.name}</td>
                      <td className="py-3.5 px-6 text-slate-900 truncate max-w-xs">{rec.value}</td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px] font-sans font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Configured
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-sans">
                        <button
                          onClick={() => handleCopy(rec.value, i)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                        >
                          {copiedIndex === i ? 'Copied!' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600">
            <b>Rule (Book 6 §9):</b> Publishing always works instantly on <code className="text-indigo-600 font-bold">{domainConfig.subdomain}</code> while custom domain DNS propagates globally.
          </div>
        </div>

        {/* SSL & Business Email Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* SSL Certificate Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">SSL Security Status</h4>
              <Badge variant="success" size="sm">● Let&apos;s Encrypt Active</Badge>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Encryption Level</span>
                <span className="font-bold text-slate-900">TLS 1.3 (256-bit)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Auto-Renewal</span>
                <span className="font-bold text-emerald-600">Automatic</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">HTTP to HTTPS</span>
                <span className="font-bold text-indigo-600">Forced Redirect</span>
              </div>
            </div>
          </div>

          {/* Business Email Addon */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Professional Business Email</h4>
            </div>
            <p className="text-xs text-slate-500">
              Create branded email inboxes (e.g. <code className="text-indigo-600 font-bold">info@{domainConfig.customDomain}</code>) connected to your CRM.
            </p>
            <button
              onClick={() => alert('Business email setup wizard opened.')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Configure Email Mailboxes
            </button>
          </div>
        </div>
      </div>

      {/* Automated Backups Table (Book 6 §12) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Automated Website Backups & Restore (Book 6 §12)</h4>
            <p className="text-xs text-slate-500">Immutable snapshot history allowing 1-click restore without data loss</p>
          </div>

          <button
            onClick={() => alert('Manual backup snapshot created.')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
          >
            + Create Backup Snapshot
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Backup ID</th>
                <th className="py-3 px-6">Snapshot Date</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Size</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="py-3.5 px-6">{b.date}</td>
                  <td className="py-3.5 px-6 text-slate-600">{b.description}</td>
                  <td className="py-3.5 px-6 font-mono">{b.size}</td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => alert(`Restoring site to snapshot ${b.id}... (Audit logged per Book 6 §12)`)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Restore to Version
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

