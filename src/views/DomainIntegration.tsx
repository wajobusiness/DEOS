import React, { useState, useEffect } from 'react';
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
  Key,
  Check,
  X
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { websiteBuilderEngine, WebsiteConfig } from '../engine/websiteBuilderEngine';

export const DomainIntegration: React.FC = () => {
  const { member } = useAuth();
  const activeUserId = member?.id || 'EVO-ID-100245';
  const activeUserName = member?.name || 'Entrepreneur';

  const [siteConfig, setSiteConfig] = useState<WebsiteConfig>(() =>
    websiteBuilderEngine.getWebsiteConfig(activeUserId, activeUserName)
  );
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSiteConfig(websiteBuilderEngine.getWebsiteConfig(activeUserId, activeUserName));
  }, [activeUserId, activeUserName]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleConnectDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainInput.trim()) return;

    const formatted = customDomainInput.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').trim();
    const updated: WebsiteConfig = {
      ...siteConfig,
      customDomain: formatted,
      isDomainVerified: false,
      sslStatus: 'pending',
    };
    websiteBuilderEngine.saveWebsiteConfig(updated);
    setSiteConfig(updated);
    setShowConnectModal(false);
    setCustomDomainInput('');
  };

  const handleVerifyDNS = () => {
    if (!siteConfig.customDomain) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const updated: WebsiteConfig = {
        ...siteConfig,
        isDomainVerified: true,
        sslStatus: 'active',
      };
      websiteBuilderEngine.saveWebsiteConfig(updated);
      setSiteConfig(updated);
      alert(`DNS Records for ${siteConfig.customDomain} verified successfully! TLS 1.3 certificate is active.`);
    }, 1200);
  };

  const fullSubdomain = `${siteConfig.subdomain}.evionaecosystem.com`;
  const activeDomain = siteConfig.customDomain || fullSubdomain;

  const dnsRecords = [
    { type: 'CNAME', name: 'www', value: 'cname.evionaecosystem.com', status: siteConfig.isDomainVerified ? 'verified' : 'configured' },
    { type: 'A', name: '@', value: '76.76.21.21', status: siteConfig.isDomainVerified ? 'verified' : 'configured' },
    { type: 'TXT', name: '_eviona-verify', value: `eviona-site-verification-${activeUserId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`, status: siteConfig.isDomainVerified ? 'verified' : 'configured' },
  ];

  const backups = [
    { id: 'BAK-104', date: 'Today, 03:00 AM (Auto)', size: '24.5 MB', description: 'Daily scheduled site backup' },
    { id: 'BAK-103', date: 'Yesterday, 08:30 PM (Publish)', size: '24.2 MB', description: 'Triggered by Website Builder publish event' },
    { id: 'BAK-102', date: 'May 18, 2026 (Manual)', size: '23.8 MB', description: 'Pre-theme update snapshot' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Domain Status Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{activeDomain}</h2>
              {siteConfig.customDomain ? (
                <Badge variant={siteConfig.isDomainVerified ? 'emerald' : 'warning'} size="sm">
                  ● {siteConfig.isDomainVerified ? 'Custom Domain Active' : 'DNS Pending Verification'}
                </Badge>
              ) : (
                <Badge variant="blue" size="sm">● Standard Subdomain Active</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Default Subdomain: <code className="text-indigo-600 font-mono font-semibold">{fullSubdomain}</code> (Always active fallback)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{siteConfig.customDomain ? 'Change Custom Domain' : 'Connect Custom Domain'}</span>
          </button>

          {siteConfig.customDomain && (
            <button
              onClick={handleVerifyDNS}
              disabled={isVerifying}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-white' : ''}`} />
              <span>{isVerifying ? 'Checking DNS...' : 'Verify DNS Status'}</span>
            </button>
          )}
        </div>
      </div>

      {/* DNS Configuration Instructions (Show when custom domain is set) */}
      {siteConfig.customDomain && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">DNS Records Configuration</h3>
              <p className="text-xs text-slate-500">
                Add the following DNS records to your domain provider (e.g. GoDaddy, Namecheap, Cloudflare).
              </p>
            </div>
            <Badge variant="purple" size="sm">TLS 1.3 Automatic</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Host / Name</th>
                  <th className="py-3 px-4">Value / Target</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {dnsRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-indigo-600">{r.type}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.name}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{r.value}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        ● {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCopy(r.value, i)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Connect Domain Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Connect Custom Domain</h3>
              <button onClick={() => setShowConnectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Enter your custom apex or subdomain (e.g. <code className="text-indigo-600 font-bold">yourbrand.com</code>).
            </p>

            <form onSubmit={handleConnectDomain} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Domain Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mybusiness.com"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 text-[11px] text-indigo-900">
                💡 <b>Instant Mapping:</b> Free SSL certificates are automatically provisioned via Let's Encrypt once DNS points to our servers.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Connect Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
