import React, { useState, useEffect } from 'react';
import {
  Network,
  Users,
  DollarSign,
  CheckCircle2,
  HelpCircle,
  Calculator,
  RefreshCw,
  UserPlus,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  X,
  Play,
  Wallet,
  Copy,
  Check,
  Share2,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { TreeNode, PlanTier } from '../types';
import { Badge } from '../components/common/Badge';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { calculateBinaryCommission, getDirectReferralBonus } from '../engine/binaryEngine';
import { binaryPlacementEngine } from '../engine/binaryPlacementEngine';
import { userRegistryEngine } from '../engine/userRegistryEngine';

export const BinaryNetwork: React.FC = () => {
  const { walletBalance, creditCommission } = useWallet();
  const { member } = useAuth();
  const { commissions } = usePlatformSettings();

  // Short EVO-ID standard for current member
  const rawId = member?.id || 'EVO-ID-100245';
  const memberCode = rawId.startsWith('EVO-ID-') ? rawId : `EVO-ID-${rawId.replace(/^EVO-?I?D?-?/i, '')}`;

  // Root view user (Super Admin can switch to view any user's tree)
  const [viewRootId, setViewRootId] = useState<string>(memberCode);
  const [treeData, setTreeData] = useState<TreeNode>(() => binaryPlacementEngine.buildBinaryTreeForUser(viewRootId));
  const [networkStats, setNetworkStats] = useState(() => binaryPlacementEngine.getNetworkStatistics(viewRootId));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [calcBv, setCalcBv] = useState<number>(5000);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [sponsorPrefLeg, setSponsorPrefLeg] = useState<'auto' | 'left' | 'right'>('auto');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Settlement feedback
  const [isSettling, setIsSettling] = useState(false);
  const [lastSettlementNotice, setLastSettlementNotice] = useState<string | null>(null);

  // Sponsor Downline Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState<PlanTier>('growth');
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);

  // Refresh live tree data whenever viewRootId or member changes
  const refreshTree = () => {
    const updatedTree = binaryPlacementEngine.buildBinaryTreeForUser(viewRootId);
    const updatedStats = binaryPlacementEngine.getNetworkStatistics(viewRootId);
    setTreeData(updatedTree);
    setNetworkStats(updatedStats);
  };

  useEffect(() => {
    refreshTree();
  }, [viewRootId, member]);

  // SuperAdmin configured rate
  const binaryRatePct = commissions.binaryCommissionRatePct || 10;
  const weakerBV = networkStats.weakerBV;
  const carryForwardBV = networkStats.carryForwardBV;
  const weeklyCommission = calculateBinaryCommission(weakerBV, binaryRatePct);

  // Binary Direct Placement Links
  const autoJoinLink = `https://evionaecosystem.com/join?ref=${memberCode}&leg=auto`;
  const leftJoinLink = `https://evionaecosystem.com/join?ref=${memberCode}&leg=left`;
  const rightJoinLink = `https://evionaecosystem.com/join?ref=${memberCode}&leg=right`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 3000);
  };

  const handleSelectNode = (node: TreeNode) => {
    if (node.status === 'inactive' || node.name.includes('+ Open')) {
      // Clicked on vacant slot -> Open fast sponsor modal for this specific leg
      setSponsorPrefLeg(node.leg === 'left' ? 'left' : 'right');
      setShowSponsorModal(true);
      return;
    }
    setSelectedNode(node);
    setShowNodeModal(true);
  };

  // Run Binary Settlement & Credit to Wallet at SuperAdmin configured rate
  const handleExecuteWeeklySettlement = () => {
    if (weakerBV <= 0) {
      alert('There is currently 0 weaker-leg BV to match for settlement.');
      return;
    }

    setIsSettling(true);
    setTimeout(() => {
      const payout = calculateBinaryCommission(weakerBV, binaryRatePct);
      const matched = weakerBV;

      // Credit commission to real wallet ledger
      const tx = creditCommission(
        payout,
        'binary_commission',
        `Binary Settlement: ${binaryRatePct}% on ${matched.toLocaleString()} BV Weaker-Leg Match`
      );

      // Deduct matched volume from user's record
      const currentReg = userRegistryEngine.getUserById(viewRootId);
      if (currentReg) {
        userRegistryEngine.updateUser(currentReg.id, {
          binaryLeftVolume: Math.max(0, (currentReg.binaryLeftVolume || 0) - matched),
          binaryRightVolume: Math.max(0, (currentReg.binaryRightVolume || 0) - matched),
        });
      }

      setIsSettling(false);
      refreshTree();

      setLastSettlementNotice(
        `Binary Settlement Complete! $${payout.toFixed(2)} EVO credited to your wallet at ${binaryRatePct}% rate (Ref: ${tx.id}). Carried forward: ${carryForwardBV.toLocaleString()} BV.`
      );
      setTimeout(() => setLastSettlementNotice(null), 7000);
    }, 600);
  };

  // Sponsor New Downline Member & Record Real Database Placement
  const handleSponsorMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    setIsSubmittingSponsor(true);
    try {
      // 1. Create real independent user in registry (No overwrite)
      const reg = await userRegistryEngine.registerNewUser({
        name: newMemberName,
        email: newMemberEmail,
        country: 'Global',
        plan: newMemberPlan,
        sponsorCode: memberCode,
        preferredPlacementLeg: sponsorPrefLeg,
      });

      if (reg.success) {
        // 2. Place user in binary tree
        binaryPlacementEngine.placeUserInBinaryTree({
          userId: reg.user.id,
          userName: reg.user.name,
          userEmail: reg.user.email,
          userAvatar: reg.user.avatar,
          sponsorId: memberCode,
          sponsorName: member?.name || 'Eviona Leader',
          plan: newMemberPlan,
          preferredLeg: sponsorPrefLeg,
        });

        // 3. Award Direct Referral Bonus to sponsor's wallet
        const directBonus = getDirectReferralBonus(newMemberPlan, commissions);
        const tx = creditCommission(
          directBonus,
          'direct_referral_bonus',
          `Direct Referral Bonus — ${reg.user.name} (${newMemberPlan.toUpperCase()} Plan)`
        );

        setShowSponsorModal(false);
        setNewMemberName('');
        setNewMemberEmail('');
        refreshTree();

        setLastSettlementNotice(
          `New Member ${reg.user.name} placed in your binary network! +$${directBonus.toFixed(2)} EVO Direct Bonus credited to your wallet (Ref: ${tx.id}).`
        );
        setTimeout(() => setLastSettlementNotice(null), 7000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to place new member.');
    } finally {
      setIsSubmittingSponsor(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Binary Model Strip */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{binaryRatePct}% Flat Binary Network Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Binary Hierarchy & Downline Volume
          </h2>
          <p className="text-xs text-indigo-200">
            Real database-driven binary network. Guaranteed {binaryRatePct}% weaker-leg payout with indefinite volume carryforward and automated spillover distribution.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-white">${weeklyCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-indigo-200 uppercase font-bold">Matched Payout ({binaryRatePct}%)</p>
            {weakerBV > 0 && (
              <button
                onClick={handleExecuteWeeklySettlement}
                disabled={isSettling}
                className="mt-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-[10px] font-bold shadow-sm"
              >
                {isSettling ? 'Settling...' : 'Credit to Wallet'}
              </button>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-emerald-400">+{carryForwardBV.toLocaleString()} BV</p>
            <p className="text-[10px] text-emerald-200 uppercase font-bold">Carry Forward</p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {lastSettlementNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lastSettlementNotice}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-800">
            Wallet Credited
          </span>
        </div>
      )}

      {/* Super Admin Tree Root Switcher */}
      {member?.role === 'super_admin' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span><b>Admin Network Inspector:</b> Viewing tree root node for</span>
            <select
              value={viewRootId}
              onChange={(e) => setViewRootId(e.target.value)}
              className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold outline-none"
            >
              {userRegistryEngine.getAllUsers().map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.id}) — {u.plan.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setViewRootId(memberCode)}
            className="px-3 py-1 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[11px]"
          >
            Reset to My Root
          </button>
        </div>
      )}

      {/* Direct Binary Sponsor Links Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>Your Referral & Placement Links</span>
            </div>
            <h3 className="text-base font-black text-slate-900">Direct Binary Sponsor Links</h3>
            <p className="text-xs text-slate-500">
              Share your short ID (<b>{memberCode}</b>) link with prospective recruits. They will automatically be positioned on the designated leg.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-slate-700">
            Sponsor ID: <span className="text-indigo-600 font-black">{memberCode}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Auto-Balanced Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Auto-Balanced Link</span>
                <Badge variant="purple" size="sm">Recommended</Badge>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Places new members into your weaker leg automatically.</p>
              <input
                type="text"
                readOnly
                value={autoJoinLink}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-600 truncate outline-none"
              />
            </div>
            <button
              onClick={() => handleCopy(autoJoinLink, 'auto')}
              className="w-full mt-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {copiedLink === 'auto' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'auto' ? 'Copied Link!' : 'Copy Auto Link'}</span>
            </button>
          </div>

          {/* Left Leg Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Direct Left Leg Link</span>
                <Badge variant="blue" size="sm">Left Leg ({networkStats.leftBV.toLocaleString()} BV)</Badge>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Forces placement onto your left team branch.</p>
              <input
                type="text"
                readOnly
                value={leftJoinLink}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-600 truncate outline-none"
              />
            </div>
            <button
              onClick={() => handleCopy(leftJoinLink, 'left')}
              className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {copiedLink === 'left' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'left' ? 'Copied Link!' : 'Copy Left Leg Link'}</span>
            </button>
          </div>

          {/* Right Leg Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Direct Right Leg Link</span>
                <Badge variant="emerald" size="sm">Right Leg ({networkStats.rightBV.toLocaleString()} BV)</Badge>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Forces placement onto your right team branch.</p>
              <input
                type="text"
                readOnly
                value={rightJoinLink}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-600 truncate outline-none"
              />
            </div>
            <button
              onClick={() => handleCopy(rightJoinLink, 'right')}
              className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {copiedLink === 'right' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'right' ? 'Copied Link!' : 'Copy Right Leg Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Network Stats KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">Left Leg Team</span>
          <p className="text-2xl font-black text-indigo-600">{networkStats.leftBV.toLocaleString()} BV</p>
          <span className="text-[11px] text-slate-400 font-medium">{networkStats.leftCount} active members</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">Right Leg Team</span>
          <p className="text-2xl font-black text-purple-600">{networkStats.rightBV.toLocaleString()} BV</p>
          <span className="text-[11px] text-slate-400 font-medium">{networkStats.rightCount} active members</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">Weaker Leg Match</span>
          <p className="text-2xl font-black text-emerald-600">{weakerBV.toLocaleString()} BV</p>
          <span className="text-[11px] text-slate-400 font-medium">Eligible for 10% match</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">Total Downlines</span>
          <p className="text-2xl font-black text-slate-900">{networkStats.totalMembers} Members</p>
          <span className="text-[11px] text-slate-400 font-medium">Direct & spillover placed</span>
        </div>
      </div>

      {/* Interactive Binary Tree Visualization Canvas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Live Binary Tree Hierarchy</h3>
            <p className="text-xs text-slate-500">
              Interactive genealogical hierarchy. Click any member to inspect downlines or click <b>+ Open Slot</b> to place a new recruit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSponsorPrefLeg('auto');
                setShowSponsorModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sponsor New Downline</span>
            </button>

            <button
              onClick={refreshTree}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh tree from live database"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tree Container */}
        <div className="overflow-x-auto py-8">
          <div className="min-w-[650px] flex flex-col items-center space-y-8">
            {/* Level 0: Root Node */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleSelectNode(treeData)}
                className="group p-4 rounded-2xl bg-gradient-to-tr from-indigo-900 to-slate-900 border-2 border-indigo-500 text-white shadow-xl hover:scale-105 transition-all text-center w-48 relative"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-2 border-2 border-white/40 shadow-xs">
                  <img src={treeData.avatar} alt={treeData.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-black text-xs text-white truncate">{treeData.name}</h4>
                <p className="text-[10px] text-indigo-300 font-mono">{treeData.id}</p>
                <span className="mt-1 inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {treeData.bv.toLocaleString()} BV Total
                </span>
              </button>

              {/* Connecting Line from Root */}
              {treeData.children && treeData.children.length > 0 && (
                <div className="w-0.5 h-8 bg-slate-300 mt-2" />
              )}
            </div>

            {/* Level 1: Left & Right Teams */}
            {treeData.children && treeData.children.length > 0 && (
              <div className="relative w-full max-w-2xl">
                {/* Horizontal Spanning Branch Line */}
                <div className="absolute -top-6 left-1/4 right-1/4 h-0.5 bg-slate-300" />

                <div className="grid grid-cols-2 gap-8">
                  {treeData.children.map((child, idx) => {
                    const isVacant = child.status === 'inactive' || child.name.includes('+ Open');
                    return (
                      <div key={child.id || idx} className="flex flex-col items-center">
                        <button
                          onClick={() => handleSelectNode(child)}
                          className={`group p-4 rounded-2xl border text-center w-48 transition-all hover:scale-105 ${
                            isVacant
                              ? 'border-2 border-dashed border-slate-300 bg-slate-50/80 text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/40'
                              : 'bg-white border-slate-200 shadow-md text-slate-900'
                          }`}
                        >
                          {isVacant ? (
                            <div className="py-2 space-y-1">
                              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-1">
                                <UserPlus className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 block">{child.name}</span>
                              <span className="text-[10px] text-indigo-600 font-extrabold">Click to Sponsor</span>
                            </div>
                          ) : (
                            <div>
                              <div className="w-10 h-10 rounded-full overflow-hidden mx-auto mb-1 border border-slate-200 shadow-xs">
                                <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
                              </div>
                              <h4 className="font-bold text-xs text-slate-900 truncate">{child.name}</h4>
                              <p className="text-[10px] text-slate-400 font-mono">{child.id}</p>
                              <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                                {child.leg.toUpperCase()} LEG • {child.bv} BV
                              </span>
                            </div>
                          )}
                        </button>

                        {/* Level 2 Sub-children */}
                        {child.children && child.children.length > 0 && (
                          <div className="mt-4 flex flex-col items-center space-y-4 w-full">
                            <div className="w-0.5 h-6 bg-slate-300" />
                            <div className="grid grid-cols-2 gap-3 w-full">
                              {child.children.map((subChild, sIdx) => {
                                const isSubVacant = subChild.status === 'inactive' || subChild.name.includes('+ Open');
                                return (
                                  <button
                                    key={subChild.id || sIdx}
                                    onClick={() => handleSelectNode(subChild)}
                                    className={`p-2.5 rounded-xl border text-center transition-all hover:scale-105 ${
                                      isSubVacant
                                        ? 'border border-dashed border-slate-300 bg-slate-50 text-slate-400 text-[10px]'
                                        : 'bg-white border-slate-200 shadow-xs text-slate-800 text-xs'
                                    }`}
                                  >
                                    <span className="font-bold block truncate text-[11px]">{subChild.name}</span>
                                    <span className="text-[9px] text-slate-400 font-mono block">{subChild.bv} BV</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SPONSOR NEW DOWNLINE MEMBER MODAL */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Sponsor Downline Recruit</h3>
                  <p className="text-[11px] text-slate-500">Sponsor: <b className="text-slate-800">{memberCode}</b></p>
                </div>
              </div>
              <button onClick={() => setShowSponsorModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSponsorMember} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">New Member Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@business.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Membership Package</label>
                <select
                  value={newMemberPlan}
                  onChange={(e) => setNewMemberPlan(e.target.value as PlanTier)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
                >
                  <option value="launch">Launch Tier ($100 USD • 100 BV)</option>
                  <option value="growth">Growth Tier ($300 USD • 300 BV)</option>
                  <option value="legacy">Legacy Tier ($500 USD • 500 BV)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Binary Placement Leg</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['auto', 'left', 'right'] as const).map((leg) => (
                    <button
                      key={leg}
                      type="button"
                      onClick={() => setSponsorPrefLeg(leg)}
                      className={`py-2 rounded-xl border text-center font-bold text-xs uppercase transition-all ${
                        sponsorPrefLeg === leg
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      {leg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <span>{isSubmittingSponsor ? 'Placing Downline...' : 'Place in Binary Tree'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NODE INSPECTOR MODAL */}
      {showNodeModal && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 text-xs text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900">Member Downline Profile</h4>
              <button onClick={() => setShowNodeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-full overflow-hidden mx-auto border-2 border-indigo-500 shadow-md">
                <img src={selectedNode.avatar} alt={selectedNode.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-black text-sm text-slate-900">{selectedNode.name}</h3>
              <p className="text-[10px] text-slate-400 font-mono">{selectedNode.id}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Placement Leg:</span>
                <span className="font-bold text-indigo-600 uppercase">{selectedNode.leg}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Node Volume:</span>
                <span className="font-mono font-bold text-emerald-600">{selectedNode.bv} BV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600 uppercase">{selectedNode.status}</span>
              </div>
            </div>

            <button
              onClick={() => setShowNodeModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
