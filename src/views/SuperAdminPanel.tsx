import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  DollarSign,
  ArrowUpRight,
  UserCheck,
  Sliders,
  Settings,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Filter,
  Save,
  Search,
  Eye,
  FileCheck,
  Check,
  X,
  RefreshCw,
  TrendingUp,
  Package,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  Network,
  Palette,
  Globe,
  Store,
  Wallet,
  Building2,
  Mail,
  Shield,
  FileText,
  Key,
  Smartphone,
  ChevronRight,
  ExternalLink,
  Layout,
  Megaphone,
  Radio,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  Loader2,
  Coins,
  Edit3,
  Phone,
  Share2,
  User
} from 'lucide-react';
import {
  initialKYCList,
  initialPayoutQueue,
  initialAuditLogs,
  KYCSubmission,
  PayoutRequest,
  AuditLogEntry,
} from '../store/useAppStore';
import { Badge } from '../components/common/Badge';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { adminApprovalEngine, DepositApprovalRequest, WithdrawalApprovalRequest } from '../engine/adminApprovalEngine';
import { marketplaceEngine } from '../engine/marketplaceEngine';
import { adminStoreData, MembershipPlanConfig } from '../engine/adminStoreData';
import { userRegistryEngine, RegisteredUser } from '../engine/userRegistryEngine';
import { binaryPlacementEngine } from '../engine/binaryPlacementEngine';
import { Product, PlanTier } from '../types';
import { UserRole, Member, ViewType } from '../types';
import { supabase } from '../lib/supabaseClient';

interface SuperAdminPanelProps {
  onImpersonateUser?: (user: Member) => void;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ onImpersonateUser }) => {
  const {
    branding,
    theme,
    homepage,
    dashboard,
    navigation,
    features,
    commissions,
    updateBranding,
    updateTheme,
    updateHomepage,
    updateDashboard,
    updateNavigation,
    updateFeatures,
    updateCommissions,
  } = usePlatformSettings();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'branding'
    | 'appearance'
    | 'homepage_cms'
    | 'dashboard_config'
    | 'navigation'
    | 'users'
    | 'memberships'
    | 'marketplace'
    | 'corporate_leads'
    | 'treasury'
    | 'binary_rules'
    | 'system'
    | 'audit_log'
  >('overview');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Forms State
  const [brandingForm, setBrandingForm] = useState(branding);
  const [themeForm, setThemeForm] = useState(theme);
  const [homepageForm, setHomepageForm] = useState(homepage);
  const [dashboardForm, setDashboardForm] = useState(dashboard);
  const [navigationForm, setNavigationForm] = useState(navigation);
  const [featuresForm, setFeaturesForm] = useState(features);
  const [commissionsForm, setCommissionsForm] = useState(commissions);

  // Commission Simulator State
  const [simSalePrice, setSimSalePrice] = useState(100);
  const [simBVMatch, setSimBVMatch] = useState(5000);

  useEffect(() => {
    setCommissionsForm(commissions);
  }, [commissions]);

    // Admin Approvals & Governance State
  const [depositRequests, setDepositRequests] = useState<DepositApprovalRequest[]>(() => adminApprovalEngine.getDepositRequests());
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalApprovalRequest[]>(() => adminApprovalEngine.getWithdrawalRequests());
  const [productsList, setProductsList] = useState<Product[]>(() => marketplaceEngine.getProducts(true));
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlanConfig[]>(() => adminStoreData.getMembershipPlans());

  // Direct Wallet Balance Adjustment Modal State
  const [selectedUserForWalletAdj, setSelectedUserForWalletAdj] = useState<any | null>(null);
  const [adjType, setAdjType] = useState<'credit' | 'debit'>('credit');
  const [adjAmount, setAdjAmount] = useState<string>('100.00');
  const [adjReason, setAdjReason] = useState<string>('Super Admin Balance Adjustment / Bonus');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleApproveDeposit = (reqId: string) => {
    const res = adminApprovalEngine.approveDeposit(reqId, 'Super Admin');
    if (res.success) {
      setDepositRequests(adminApprovalEngine.getDepositRequests());
      fetchLiveUsers();
      logAdminAction('Deposit Approved', `Approved deposit request ${reqId} for ${res.request?.userName} ($${res.request?.amount.toFixed(2)} EVO)`);
      showToast(`Approved deposit of $${res.request?.amount.toFixed(2)} EVO! Funds credited to user wallet.`);
    } else {
      alert(res.error || 'Failed to approve deposit.');
    }
  };

  const handleRejectDeposit = (reqId: string) => {
    const reason = prompt('Please enter a rejection reason:', 'Invalid transaction hash / receipt unverified');
    if (!reason) return;
    const res = adminApprovalEngine.rejectDeposit(reqId, reason, 'Super Admin');
    if (res.success) {
      setDepositRequests(adminApprovalEngine.getDepositRequests());
      logAdminAction('Deposit Rejected', `Rejected deposit request ${reqId} (${reason})`);
      showToast(`Deposit request ${reqId} rejected.`);
    }
  };

  const handleApproveWithdrawal = (reqId: string) => {
    const res = adminApprovalEngine.approveWithdrawal(reqId, 'Super Admin');
    if (res.success) {
      setWithdrawalRequests(adminApprovalEngine.getWithdrawalRequests());
      logAdminAction('Withdrawal Released', `Released payout ${reqId} for ${res.request?.userName} ($${res.request?.amount.toFixed(2)} EVO)`);
      showToast(`Payout released for request ${reqId}!`);
    }
  };

  const handleRejectWithdrawal = (reqId: string) => {
    const reason = prompt('Please enter a rejection reason:', 'KYC verification required / invalid payout destination');
    if (!reason) return;
    const res = adminApprovalEngine.rejectWithdrawal(reqId, reason, 'Super Admin');
    if (res.success) {
      setWithdrawalRequests(adminApprovalEngine.getWithdrawalRequests());
      fetchLiveUsers();
      logAdminAction('Withdrawal Rejected & Refunded', `Rejected ${reqId} and refunded $${res.request?.amount.toFixed(2)} EVO to ${res.request?.userName}`);
      showToast(`Withdrawal rejected. $${res.request?.amount.toFixed(2)} EVO refunded to user.`);
    }
  };

  const handleChangeUserPlan = async (userId: string, newPlan: PlanTier) => {
    const targetUser = usersList.find((u) => u.id === userId);
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
    await adminApprovalEngine.adminUpdateMember(userId, { plan: newPlan });
    logAdminAction('User Plan Modified', `User ${targetUser?.email || userId} plan upgraded/changed to ${newPlan}`);
    showToast(`User plan updated to ${newPlan.toUpperCase()}!`);
  };

  const handleExecuteWalletAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForWalletAdj) return;
    const num = parseFloat(adjAmount);
    if (isNaN(num) || num <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    const finalAmount = adjType === 'credit' ? num : -num;
    const res = adminApprovalEngine.adminAdjustWalletBalance({
      targetUserId: selectedUserForWalletAdj.id,
      targetUserEmail: selectedUserForWalletAdj.email,
      amount: finalAmount,
      reason: adjReason,
      adminName: 'Super Admin',
    });

    if (res.success) {
      setUsersList((prev) =>
        prev.map((u) => (u.id === selectedUserForWalletAdj.id ? { ...u, walletBalance: res.newBalance } : u))
      );
      logAdminAction(
        `Admin Wallet ${adjType.toUpperCase()}`,
        `${adjType === 'credit' ? 'Credited' : 'Debited'} $${num.toFixed(2)} EVO to ${selectedUserForWalletAdj.email} (${adjReason})`
      );
      showToast(`Successfully ${adjType === 'credit' ? 'credited' : 'debited'} $${num.toFixed(2)} EVO for ${selectedUserForWalletAdj.name}!`);
      setSelectedUserForWalletAdj(null);
    }
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    marketplaceEngine.updateProduct(editingProduct.id, {
      price: editingProduct.price,
      affiliateCommissionRate: editingProduct.affiliateCommissionRate,
      category: editingProduct.category,
      status: editingProduct.status,
    });
    setProductsList(marketplaceEngine.getProducts(true));
    const commPct = Math.round((editingProduct.affiliateCommissionRate ?? 0.1) * 100);
    logAdminAction('Marketplace Product Updated', `Updated product: ${editingProduct.title} (Price: $${editingProduct.price}, Comm: ${commPct}%)`);
    showToast(`Product "${editingProduct.title}" updated successfully!`);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete/moderate this product from the platform catalog?')) {
      marketplaceEngine.deleteProduct(productId);
      setProductsList(marketplaceEngine.getProducts(true));
      showToast('Product removed from catalog.');
    }
  };

  const handleSaveMembershipPlans = (e: React.FormEvent) => {
    e.preventDefault();
    adminStoreData.saveMembershipPlans(membershipPlans);
    logAdminAction('Membership Pricing Updated', 'Updated membership tier limits and pricing');
    showToast('Membership tier pricing & limits updated successfully!');
  };

  // Live User Management State
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(10);
  const [usersList, setUsersList] = useState<any[]>(() => userRegistryEngine.getAllUsers());
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchLiveUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // 1. Get authoritative multi-user master list
      const masterUsers = userRegistryEngine.getAllUsers();

      // 2. Fetch live registered users from Supabase Member table if available
      try {
        const { data, error } = await supabase
          .from('Member')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          for (const m of data) {
            const exists = masterUsers.find(u => u.id === m.id || u.email.toLowerCase() === (m.email || '').toLowerCase());
            if (!exists) {
              masterUsers.push({
                id: m.id || m.member_code || `EVO-${Math.floor(1000 + Math.random() * 9000)}`,
                memberCode: m.member_code || m.id,
                name: m.name || m.full_name || 'Entrepreneur',
                email: m.email || '',
                phone: m.phone || '',
                country: m.country || 'Global',
                avatar: m.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                plan: m.plan || 'launch',
                role: m.role || 'member',
                status: m.status || 'active',
                sponsorId: m.sponsor_id || 'EVO-ID-000001',
                sponsorName: 'Eviona Sponsor',
                binaryPlacementLeg: 'auto',
                walletBalance: Number(m.wallet_balance || m.walletBalance || 0),
                tokenBalance: Number(m.wallet_balance || m.walletBalance || 0),
                binaryLeftVolume: Number(m.binary_volume_left || m.binaryLeftVolume || 0),
                binaryRightVolume: Number(m.binary_volume_right || m.binaryRightVolume || 0),
                activeReferrals: Number(m.active_referrals || 0),
                joinedDate: m.created_at ? new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
                renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                hasCompletedOnboarding: true,
                createdAt: m.created_at || new Date().toISOString(),
                updatedAt: m.updated_at || new Date().toISOString(),
              });
            }
          }
          userRegistryEngine.saveUsers(masterUsers);
        }
      } catch (err) {
        console.warn('Supabase database sync check notice:', err);
      }

      setUsersList([...masterUsers]);
    } catch (err) {
      console.warn('Live user fetch notification:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchLiveUsers();
  }, []);

  // Selected User for Detailed Inspection & Direct Edit Studio
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<any | null>(null);
  const [userEditForm, setUserEditForm] = useState<any>({});
  const [isEditUserMode, setIsEditUserMode] = useState<boolean>(false);
  const [isSavingUser, setIsSavingUser] = useState<boolean>(false);
  const [userModalTab, setUserModalTab] = useState<'profile' | 'subscription' | 'network' | 'finances' | 'security'>('profile');

  // Password & Security Management State inside Modal
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);
  const [mustChangePasswordNextLogin, setMustChangePasswordNextLogin] = useState<boolean>(false);
  const [passwordFeedbackMsg, setPasswordFeedbackMsg] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let generated = 'Evo#';
    for (let i = 0; i < 8; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(generated);
    setConfirmPasswordInput(generated);
    setShowPasswordText(true);
    setPasswordFeedbackMsg('Generated high-entropy secure password. Click Apply to save.');
  };

  const handleAdminDirectPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForDetails) return;
    if (!newPasswordInput || newPasswordInput.length < 6) {
      alert('Password must be at least 6 characters in length.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert('Passwords do not match. Please verify confirmation.');
      return;
    }

    setIsResettingPassword(true);
    try {
      await userRegistryEngine.resetUserPassword(
        selectedUserForDetails.id,
        newPasswordInput,
        mustChangePasswordNextLogin
      );

      logAdminAction(
        'User Password Reset by Super Admin',
        `Admin directly reset credentials for user: ${selectedUserForDetails.name} (${selectedUserForDetails.id})${mustChangePasswordNextLogin ? ' [Forced Reset Next Login]' : ''}`
      );

      setPasswordFeedbackMsg(`Password successfully updated & active for ${selectedUserForDetails.name}!`);
      showToast(`Password updated for ${selectedUserForDetails.name}!`);
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      fetchLiveUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update password.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSendSupabasePasswordResetEmail = async () => {
    if (!selectedUserForDetails?.email) return;
    try {
      await supabase.auth.resetPasswordForEmail(selectedUserForDetails.email, {
        redirectTo: 'https://evionaecosystem.com/reset-password',
      });
      logAdminAction(
        'Password Reset Email Dispatched',
        `Reset link sent to ${selectedUserForDetails.email}`
      );
      showToast(`Password recovery link dispatched to ${selectedUserForDetails.email}!`);
      setPasswordFeedbackMsg(`Password reset link sent to ${selectedUserForDetails.email}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch reset email.');
    }
  };

  const handleOpenUserDetails = (user: any) => {
    const live = userRegistryEngine.getUserById(user.id) || user;
    setSelectedUserForDetails(live);
    setUserEditForm({
      id: live.id,
      memberCode: live.memberCode || live.id,
      name: live.name || '',
      email: live.email || '',
      phone: live.phone || '',
      country: live.country || 'Global',
      avatar: live.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: live.plan || 'launch',
      role: live.role || 'member',
      status: live.status || 'active',
      sponsorId: live.sponsorId || 'EVO-ID-000001',
      sponsorName: live.sponsorName || 'System Root',
      binaryPlacementLeg: live.binaryPlacementLeg || 'auto',
      walletBalance: live.walletBalance || 0,
      tokenBalance: live.tokenBalance || 0,
      binaryLeftVolume: live.binaryLeftVolume || 0,
      binaryRightVolume: live.binaryRightVolume || 0,
      activeReferrals: live.activeReferrals || 0,
      hasCompletedOnboarding: live.hasCompletedOnboarding !== false,
      joinedDate: live.joinedDate || 'Recently',
      renewalDate: live.renewalDate || '1 Year',
    });
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordFeedbackMsg(null);
    setShowPasswordText(false);
    setMustChangePasswordNextLogin(live.mustChangePassword === true);
    setIsEditUserMode(false);
    setUserModalTab('profile');
  };

  const handleSaveUserDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEditForm.id) return;

    setIsSavingUser(true);
    try {
      let sponsorName = userEditForm.sponsorName;
      if (userEditForm.sponsorId) {
        const sp = userRegistryEngine.getUserById(userEditForm.sponsorId);
        if (sp) sponsorName = sp.name;
      }

      const updatedFields = {
        name: userEditForm.name.trim(),
        email: userEditForm.email.trim().toLowerCase(),
        phone: userEditForm.phone.trim(),
        country: userEditForm.country.trim(),
        avatar: userEditForm.avatar,
        plan: userEditForm.plan as PlanTier,
        role: userEditForm.role as UserRole,
        status: userEditForm.status as any,
        sponsorId: userEditForm.sponsorId || null,
        sponsorName,
        binaryPlacementLeg: userEditForm.binaryPlacementLeg,
        walletBalance: parseFloat(userEditForm.walletBalance) || 0,
        tokenBalance: parseFloat(userEditForm.tokenBalance) || 0,
        binaryLeftVolume: parseInt(userEditForm.binaryLeftVolume) || 0,
        binaryRightVolume: parseInt(userEditForm.binaryRightVolume) || 0,
        hasCompletedOnboarding: Boolean(userEditForm.hasCompletedOnboarding),
      };

      await userRegistryEngine.updateUser(userEditForm.id, updatedFields);
      logAdminAction('User Account Information Updated', `Admin updated full details for user: ${updatedFields.name} (${userEditForm.id})`);
      showToast(`User ${updatedFields.name} updated successfully in master database!`);
      setSelectedUserForDetails(null);
      await fetchLiveUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to save user updates');
    } finally {
      setIsSavingUser(false);
    }
  };

  // Payouts & Corporate Leads
  const [payoutList, setPayoutList] = useState<PayoutRequest[]>(initialPayoutQueue);
  const [sustainabilityFund] = useState(45820.0);

  const [corporateLeads] = useState<any[]>([
    {
      id: 'LED-CORP-201',
      name: 'Alexander Wright',
      email: 'alex@enterprise-global.com',
      company: 'Enterprise Global Corp',
      source: 'Corporate Website (Contact Sales)',
      assignedTo: 'Marcus (Enterprise Sales)',
      stage: 'Qualified',
    },
    {
      id: 'LED-CORP-202',
      name: 'David K. O’Connor',
      email: 'david@apexholdings.org',
      company: 'Apex Digital Capital',
      source: 'Corporate Landing Page (Book 7 §2)',
      assignedTo: 'Super Admin',
      stage: 'Negotiation',
    },
  ]);

  const logAdminAction = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      action,
      actor: 'Marcus Vance (Super Admin)',
      actorRole: 'super_admin',
      timestamp: new Date().toLocaleTimeString(),
      details,
      impactCategory: 'System Config',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBranding(brandingForm);
    logAdminAction('Platform Branding Update', `Branding updated: ${brandingForm.platformName}`);
    showToast('Platform branding saved & synchronized across all frontend views!');
  };

  const handleSaveAppearance = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTheme(themeForm);
    logAdminAction('Theme & Appearance Update', `Primary color: ${themeForm.primaryColor}`);
    showToast('Theme styling and CSS variables injected dynamically!');
  };

  const handleSaveHomepageCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHomepage(homepageForm);
    logAdminAction('Homepage CMS Update', 'Homepage hero text, video, and FAQ updated');
    showToast('Homepage CMS updated immediately on the live marketing website!');
  };

  const handleSaveDashboardConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDashboard(dashboardForm);
    logAdminAction('Dashboard Configuration Update', 'Dashboard welcome message & broadcast banner updated');
    showToast('User dashboard settings saved! Live on next user render.');
  };

  const handleToggleNavigationItem = async (viewKey: ViewType) => {
    const updated = {
      ...navigationForm.enabledViews,
      [viewKey]: navigationForm.enabledViews[viewKey] === false ? true : false,
    };
    const newNav = { enabledViews: updated };
    setNavigationForm(newNav);
    await updateNavigation(newNav);
    logAdminAction('Navigation Menu Modified', `Module ${viewKey} set to ${updated[viewKey] ? 'Enabled' : 'Disabled'}`);
    showToast(`Navigation updated! Module ${viewKey} is now ${updated[viewKey] ? 'visible' : 'hidden'}.`);
  };

  const handleSaveSystemFeatures = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFeatures(featuresForm);
    logAdminAction('System Feature Flags Update', `Maintenance: ${featuresForm.maintenanceMode}, Coin: $${featuresForm.defaultCoinRateUsd}`);
    showToast('System feature flags and platform rates updated live in database!');
  };

  const handleToggleUserStatus = async (userId: string) => {
    const targetUser = usersList.find((u) => u.id === userId);
    const newStatus = targetUser?.status === 'active' ? 'suspended' : 'active';

    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    try {
      await supabase.from('Member').update({ status: newStatus }).eq('id', userId);
    } catch (err) {
      console.warn('User status database sync note:', err);
    }

    logAdminAction('User Status Modified', `User ${targetUser?.email || userId} set to ${newStatus}`);
    showToast(`User status updated to ${newStatus} in live database!`);
  };

  const handleChangeUserRole = async (userId: string, newRole: UserRole) => {
    const targetUser = usersList.find((u) => u.id === userId);

    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      await supabase.from('Member').update({ role: newRole }).eq('id', userId);
    } catch (err) {
      console.warn('User role database sync note:', err);
    }

    logAdminAction('User Role Modified', `User ${targetUser?.email || userId} assigned role ${newRole}`);
    showToast(`User role updated to ${newRole} in live database!`);
  };

  const handleSaveCommissions = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCommissions(commissionsForm);
    logAdminAction(
      'Commissions Configuration Updated',
      `Updated binary matching: ${commissionsForm.binaryCommissionRatePct}%, affiliate: ${commissionsForm.affiliateCommissionRatePct}%, upline: ${commissionsForm.uplineOverrideRatePct}%`
    );
    showToast('Global Commission & MLM Binary percentages saved and deployed platform-wide!');
  };

  const handleImpersonate = (user: any) => {
    logAdminAction('User Impersonation Triggered', `Admin viewing platform as user: ${user.email} (${user.id})`);
    if (onImpersonateUser) {
      onImpersonateUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: '',
        country: 'Global',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        plan: user.plan,
        role: user.role,
        status: user.status,
        memberSince: user.joinedDate,
        renewalDate: '1 Year',
        rank: 'Director',
        nextRank: 'Executive',
        walletBalance: user.walletBalance,
        tokenBalance: user.walletBalance,
        availableBalance: user.walletBalance,
        binaryVolume: user.binaryVolume,
        activeReferrals: user.activeReferrals,
        hasCompletedOnboarding: true,
      });
    } else {
      alert(`[Audit Logged] Impersonation session started for ${user.name} (${user.email}).`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start animate-fadeIn font-sans">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-2xl animate-slideDown max-w-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)}>
            <X className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {/* ADMIN SIDEBAR NAVIGATION (BY THE SIDE) */}
      <aside className="w-full lg:w-72 shrink-0 bg-slate-900/90 rounded-3xl p-4 border border-slate-800 space-y-6 lg:sticky lg:top-24 shadow-xl backdrop-blur-md">
        {/* Header Indicator */}
        <div className="px-3 py-2.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h4 className="text-xs font-extrabold text-white leading-tight">Admin Console</h4>
            <p className="text-[10px] text-slate-400 font-mono">14 Management Modules</p>
          </div>
        </div>

        {/* Group 1: Analytics & BI */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Analytics & BI
          </span>
          {[
            { id: 'overview', label: 'Overview & BI', icon: TrendingUp },
            { id: 'audit_log', label: 'Audit Trail (Book 17)', icon: FileText, badge: 'Ledger' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-800 text-slate-300">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Group 2: Configuration & Theming Engine */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Configuration Engine
          </span>
          {[
            { id: 'branding', label: 'Global Branding', icon: Globe },
            { id: 'appearance', label: 'Theme Engine (CSS)', icon: Palette },
            { id: 'homepage_cms', label: 'Homepage CMS & FAQ', icon: Layout },
            { id: 'dashboard_config', label: 'Dashboard & Alerts', icon: Megaphone },
            { id: 'navigation', label: 'Menu Management', icon: Sliders },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Group 3: Operations & Governance */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Operations & Rules
          </span>
          {[
            { id: 'users', label: 'Users & RBAC', icon: Users },
            { id: 'memberships', label: 'Plans & Pricing', icon: Layers },
            { id: 'marketplace', label: 'Marketplace Moderation', icon: Store },
            { id: 'corporate_leads', label: 'Corporate Leads (Book 7)', icon: Building2 },
            { id: 'treasury', label: 'Treasury & Payouts', icon: Wallet },
            { id: 'binary_rules', label: 'Commissions & Binary MLM', icon: Network },
            { id: 'system', label: 'System Flags & Coin', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE (RIGHT SIDE) */}
      <main className="flex-1 min-w-0 w-full space-y-6">

      {/* ========================================================================= */}
      {/* 1. OVERVIEW & BI                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform GMV</span>
              <p className="text-xl font-black text-white">$842,500.00</p>
              <span className="text-[10px] font-bold text-emerald-400">↑ +18.4% this month</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly MRR</span>
              <p className="text-xl font-black text-white">$124,600.00</p>
              <span className="text-[10px] font-bold text-indigo-400">2,450 Subscriptions</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sustainability Fund</span>
              <p className="text-xl font-black text-emerald-400">${sustainabilityFund.toLocaleString()}</p>
              <span className="text-[10px] font-bold text-slate-400">Book 6 Protocol</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</span>
              <p className="text-xl font-black text-amber-400">$14,580.00</p>
              <span className="text-[10px] font-bold text-amber-500">6 requests in queue</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marketplace Sales</span>
              <p className="text-xl font-black text-white">$68,920.00</p>
              <span className="text-[10px] font-bold text-emerald-400">10% Platform Cut</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sync Status</span>
              <p className="text-xl font-black text-emerald-400">SYNCHRONIZED</p>
              <span className="text-[10px] font-bold text-emerald-500">Single Source Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Configuration Engine Summary</span>
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Active Platform Name:</span>
                  <b className="text-white">{branding.platformName}</b>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Primary Brand Color:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                    <code className="text-indigo-400 font-mono">{theme.primaryColor}</code>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Internal Coin Rate:</span>
                  <b className="text-emerald-400 font-mono">$1.00 USD = {features.defaultCoinRateUsd} EVO Token</b>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Maintenance Mode:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${features.maintenanceMode ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {features.maintenanceMode ? 'ACTIVE (OFFLINE)' : 'OFF (LIVE)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>Real-Time Audit Stream</span>
                </h4>
                <button onClick={() => setActiveTab('audit_log')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                  Full Log
                </button>
              </div>

              <div className="space-y-2">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{log.action}</p>
                      <p className="text-[10px] text-slate-400">{log.details}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GLOBAL BRANDING                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Global Platform Branding & Identity</h3>
            <p className="text-xs text-slate-400">
              Changes propagate to the public homepage, member sidebar, login modals, emails, and footers immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Platform Name</label>
              <input
                type="text"
                value={brandingForm.platformName}
                onChange={(e) => setBrandingForm({ ...brandingForm, platformName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                placeholder="Eviona Ecosystem"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Tagline / Header Writeup</label>
              <input
                type="text"
                value={brandingForm.tagline}
                onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                placeholder="Digital Entrepreneurship OS"
              />
            </div>

            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block font-bold text-slate-300">Brand Logo Image URL (Header & Navbar)</label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={brandingForm.logoUrl || ''}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value, lightLogoUrl: e.target.value })}
                  placeholder="https://your-cdn.com/logo.png (or leave blank for high-tech icon badge)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500 font-mono text-xs"
                />
                {brandingForm.logoUrl && (
                  <div className="shrink-0 p-1.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-2">
                    <img src={brandingForm.logoUrl} alt="Logo Preview" className="h-8 max-w-[120px] object-contain rounded-lg" />
                    <span className="text-[10px] text-emerald-400 font-bold pr-1">Preview</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                When provided, this logo image replaces the default icon badge across the header, sidebar, login modals, and emails.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Company Registered Name</label>
              <input
                type="text"
                value={brandingForm.companyName}
                onChange={(e) => setBrandingForm({ ...brandingForm, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Official Support Email</label>
              <input
                type="email"
                value={brandingForm.supportEmail}
                onChange={(e) => setBrandingForm({ ...brandingForm, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Support Phone Number</label>
              <input
                type="text"
                value={brandingForm.supportPhone}
                onChange={(e) => setBrandingForm({ ...brandingForm, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Footer Copyright Notice</label>
              <input
                type="text"
                value={brandingForm.copyrightText}
                onChange={(e) => setBrandingForm({ ...brandingForm, copyrightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Default Platform Currency</label>
              <input
                type="text"
                value={brandingForm.defaultCurrency}
                onChange={(e) => setBrandingForm({ ...brandingForm, defaultCurrency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Timezone</label>
              <input
                type="text"
                value={brandingForm.timezone}
                onChange={(e) => setBrandingForm({ ...brandingForm, timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Sync Branding</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. THEME ENGINE & DYNAMIC CSS VARIABLES                                   */}
      {/* ========================================================================= */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleSaveAppearance} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Dynamic Global Theme Engine</h3>
            <p className="text-xs text-slate-400">
              Customize colors, font family, and border radius. Injects CSS variables live into the runtime document.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="block font-bold text-slate-300">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeForm.primaryColor}
                  onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={themeForm.primaryColor}
                  onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="block font-bold text-slate-300">Secondary Gradient Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeForm.secondaryColor}
                  onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={themeForm.secondaryColor}
                  onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="block font-bold text-slate-300">Accent Highlight Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeForm.accentColor}
                  onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={themeForm.accentColor}
                  onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Global Font Family</label>
              <input
                type="text"
                value={themeForm.fontFamily}
                onChange={(e) => setThemeForm({ ...themeForm, fontFamily: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Default Border Radius</label>
              <input
                type="text"
                value={themeForm.borderRadius}
                onChange={(e) => setThemeForm({ ...themeForm, borderRadius: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Apply Theme Engine Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 4. HOMEPAGE CMS & FAQs                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'homepage_cms' && (
        <form onSubmit={handleSaveHomepageCMS} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Homepage Content Management (CMS)</h3>
            <p className="text-xs text-slate-400">
              Edit the live marketing website copy, promo banner, video player, and FAQ questions.
            </p>
          </div>

          {/* Promotional Announcement Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>Promotional Top Announcement Bar</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setHomepageForm({
                    ...homepageForm,
                    announcementBanner: {
                      ...homepageForm.announcementBanner,
                      enabled: !homepageForm.announcementBanner.enabled,
                    },
                  })
                }
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  homepageForm.announcementBanner.enabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {homepageForm.announcementBanner.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {homepageForm.announcementBanner.enabled && (
              <input
                type="text"
                value={homepageForm.announcementBanner.text}
                onChange={(e) =>
                  setHomepageForm({
                    ...homepageForm,
                    announcementBanner: { ...homepageForm.announcementBanner, text: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-indigo-500"
              />
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Hero Pill Badge Text</label>
              <input
                type="text"
                value={homepageForm.heroBadge}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={homepageForm.heroHeadline}
                  onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Gradient Highlight Phrase</label>
                <input
                  type="text"
                  value={homepageForm.heroHighlightText}
                  onChange={(e) => setHomepageForm({ ...homepageForm, heroHighlightText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Hero Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={homepageForm.heroSubtitle}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">YouTube Master Tour Video URL</label>
              <input
                type="text"
                value={homepageForm.heroVideoUrl}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroVideoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live CMS</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 5. DASHBOARD & BROADCAST ALERTS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard_config' && (
        <form onSubmit={handleSaveDashboardConfig} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Member Dashboard Configuration & Broadcasts</h3>
            <p className="text-xs text-slate-400">
              Customize the welcome message and broadcast platform notifications across all user dashboards.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Welcome Headline Template</label>
              <input
                type="text"
                value={dashboardForm.welcomeHeadline}
                onChange={(e) => setDashboardForm({ ...dashboardForm, welcomeHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                placeholder="Good morning, {name}! 👋"
              />
              <p className="text-[10px] text-slate-500 mt-1">Use <code>{'{name}'}</code> to dynamically interpolate the logged in entrepreneur&apos;s name.</p>
            </div>

            {/* Broadcast Banner */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>Platform-Wide Broadcast Alert</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDashboardForm({
                      ...dashboardForm,
                      announcementBar: {
                        ...dashboardForm.announcementBar,
                        enabled: !dashboardForm.announcementBar.enabled,
                      },
                    })
                  }
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    dashboardForm.announcementBar.enabled
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {dashboardForm.announcementBar.enabled ? 'Broadcasting Live' : 'Disabled'}
                </button>
              </div>

              {dashboardForm.announcementBar.enabled && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={dashboardForm.announcementBar.text}
                    onChange={(e) =>
                      setDashboardForm({
                        ...dashboardForm,
                        announcementBar: { ...dashboardForm.announcementBar, text: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-indigo-500"
                    placeholder="Enter urgent announcement text..."
                  />

                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">Severity Level:</span>
                    {(['info', 'warning', 'success'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() =>
                          setDashboardForm({
                            ...dashboardForm,
                            announcementBar: { ...dashboardForm.announcementBar, severity: sev },
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                          dashboardForm.announcementBar.severity === sev
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Dashboard Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 6. MENU & NAVIGATION MANAGEMENT                                           */}
      {/* ========================================================================= */}
      {activeTab === 'navigation' && (
        <div className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Menu & Module Visibility Control</h3>
            <p className="text-xs text-slate-400">
              Toggle visibility for individual features in the member sidebar. Disabled modules are hidden in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'wallet', label: 'Wallet & EVO Token' },
              { id: 'binary', label: 'Binary MLM Network' },
              { id: 'partner', label: 'Partner Center' },
              { id: 'marketplace', label: 'Marketplace' },
              { id: 'sellers', label: 'Sellers Dashboard' },
              { id: 'academy', label: 'Academy Hub' },
              { id: 'builder', label: 'Website Builder Studio' },
              { id: 'domains', label: 'Custom Domains & DNS' },
              { id: 'crm', label: 'CRM & Sales Funnels' },
              { id: 'ai-center', label: 'AI Business Center' },
              { id: 'marketing', label: 'Marketing Tools' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'events', label: 'Events & Webinars' },
              { id: 'team', label: 'My Team' },
              { id: 'settings', label: 'Settings' },
              { id: 'support', label: 'Support & Help Desk' },
            ].map((mod) => {
              const isEnabled = navigationForm.enabledViews[mod.id as ViewType] !== false;
              return (
                <div
                  key={mod.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-white">{mod.label}</span>
                  <button
                    onClick={() => handleToggleNavigationItem(mod.id as ViewType)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-all ${
                      isEnabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isEnabled ? 'Enabled' : 'Hidden'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. USER DIRECTORY & RBAC                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (() => {
        const filteredUsers = usersList.filter((u) => {
          const matchesSearch =
            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.id.toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.sponsorId && u.sponsorId.toLowerCase().includes(userSearch.toLowerCase())) ||
            (u.phone && u.phone.includes(userSearch));
          const matchesRole = roleFilter === 'all' || u.role === roleFilter;
          const matchesPlan = planFilter === 'all' || u.plan === planFilter;
          return matchesSearch && matchesRole && matchesPlan;
        });

        const totalUsers = filteredUsers.length;
        const totalPages = Math.max(1, Math.ceil(totalUsers / usersPerPage));
        const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, ID, or sponsor ID..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Database: <b className="text-white">{usersList.length} Total Members</b></span>
                </div>

                <button
                  onClick={fetchLiveUsers}
                  disabled={isLoadingUsers}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  title="Sync and query live users from database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                  <span>{isLoadingUsers ? 'Syncing...' : 'Refresh DB'}</span>
                </button>

                <select
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 outline-none"
                >
                  <option value="all">All Plans</option>
                  <option value="launch">Launch ($100)</option>
                  <option value="growth">Growth ($300)</option>
                  <option value="legacy">Legacy ($500)</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="member">Member</option>
                  <option value="support_staff">Support Staff</option>
                  <option value="admin">Administrator</option>
                  <option value="super_admin">Super Administrator</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">User ID & Name</th>
                      <th className="p-4">Email & Phone</th>
                      <th className="p-4">Sponsor / Referrer</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Plan Tier</th>
                      <th className="p-4">Registration Date</th>
                      <th className="p-4">Wallet Balance</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <button
                            onClick={() => handleOpenUserDetails(user)}
                            className="text-left group flex flex-col"
                            title="Click to view and edit full user details"
                          >
                            <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                              <span>{user.name}</span>
                              <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                            <p className="text-[11px] text-indigo-400 font-mono font-bold">{user.id}</p>
                          </button>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">{user.email}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{user.phone || 'No phone recorded'}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-200">{user.sponsorName || 'Eviona Global'}</p>
                          <p className="text-[10px] text-indigo-400 font-mono">{user.sponsorId || 'ROOT'}</p>
                        </td>
                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleChangeUserRole(user.id, e.target.value as UserRole)}
                            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-indigo-400 outline-none"
                          >
                            <option value="member">Member</option>
                            <option value="support_staff">Support Staff</option>
                            <option value="admin">Administrator</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={user.plan}
                            onChange={(e) => handleChangeUserPlan(user.id, e.target.value as PlanTier)}
                            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-white uppercase outline-none"
                          >
                            <option value="launch">LAUNCH ($100)</option>
                            <option value="growth">GROWTH ($300)</option>
                            <option value="legacy">LEGACY ($500)</option>
                          </select>
                        </td>
                        <td className="p-4 text-slate-400 text-[11px]">
                          {user.joinedDate || 'Recently'}
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                          ${(user.walletBalance || 0).toFixed(2)} EVO
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              user.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenUserDetails(user)}
                            className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs transition-colors inline-flex items-center gap-1"
                            title="Inspect complete details and edit information"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details & Edit</span>
                          </button>
                          <button
                            onClick={() => setSelectedUserForWalletAdj(user)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-xs transition-colors inline-flex items-center gap-1"
                            title="Credit or Debit User Wallet Directly"
                          >
                            💰 Adjust Funds
                          </button>
                          <button
                            onClick={() => handleImpersonate(user)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                            title="Audited View As User"
                          >
                            View as User
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                              user.status === 'active'
                                ? 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300'
                                : 'bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div>
                  Showing <b>{totalUsers > 0 ? (currentPage - 1) * usersPerPage + 1 : 0}</b> to <b>{Math.min(currentPage * usersPerPage, totalUsers)}</b> of <b>{totalUsers}</b> registered users
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 font-bold border border-slate-800"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 font-bold border border-slate-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* TREASURY & FINANCIAL APPROVALS (DEPOSITS, WITHDRAWALS & BALANCES)         */}
      {/* ========================================================================= */}
      {activeTab === 'treasury' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
                <Wallet className="w-3.5 h-3.5" />
                <span>Super Admin Treasury Governance</span>
              </div>
              <h3 className="text-xl font-bold text-white">Deposit & Withdrawal Approvals Pipeline</h3>
              <p className="text-xs text-slate-400 mt-1">
                Reconcile blockchain & bank deposits, approve fiat/crypto withdrawal releases, and execute direct ledger adjustments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                Pending Deposits: <b className="text-amber-400">{depositRequests.filter(r => r.status === 'Pending_Approval').length}</b>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                Pending Withdrawals: <b className="text-purple-400">{withdrawalRequests.filter(r => r.status === 'Pending_Approval').length}</b>
              </span>
            </div>
          </div>

          {/* Section 1: User Deposit Approval Queue */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Incoming User Deposit Verification Queue</span>
            </h4>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">User Details</th>
                      <th className="p-4">Deposit Amount</th>
                      <th className="p-4">Payment Rail</th>
                      <th className="p-4">Tx Reference / Hash</th>
                      <th className="p-4">Submitted At</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {depositRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white">{req.userName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{req.userEmail} • {req.userId}</p>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                          +${req.amount.toFixed(2)} EVO
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                            {req.rail}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px]">
                          <p className="text-white font-bold">{req.reference}</p>
                          {req.proofHash && <p className="text-slate-500 text-[10px] truncate max-w-xs">{req.proofHash}</p>}
                        </td>
                        <td className="p-4 text-slate-400 text-[11px]">
                          {req.createdAt}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              req.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : req.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            }`}
                          >
                            {req.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {req.status === 'Pending_Approval' ? (
                            <>
                              <button
                                onClick={() => handleApproveDeposit(req.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                ✓ Approve & Credit
                              </button>
                              <button
                                onClick={() => handleRejectDeposit(req.id)}
                                className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-all"
                              >
                                ✕ Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Settled by {req.reviewedBy || 'Admin'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 2: User Withdrawal Approval Queue */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-400" />
              <span>Outgoing User Withdrawal & Settlement Queue</span>
            </h4>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">User Details</th>
                      <th className="p-4">Withdrawal Amount</th>
                      <th className="p-4">Destination Rail</th>
                      <th className="p-4">Payout Target Details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Settlement Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {withdrawalRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white">{req.userName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{req.userEmail} • {req.userId}</p>
                        </td>
                        <td className="p-4 font-mono font-bold text-purple-400 text-sm">
                          -${req.amount.toFixed(2)} EVO
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {req.method}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-300">
                          {req.destinationDetails}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              req.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : req.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            }`}
                          >
                            {req.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {req.status === 'Pending_Approval' ? (
                            <>
                              <button
                                onClick={() => handleApproveWithdrawal(req.id)}
                                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                ✓ Release Payout
                              </button>
                              <button
                                onClick={() => handleRejectWithdrawal(req.id)}
                                className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-all"
                              >
                                ✕ Reject & Refund
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MARKETPLACE MODERATION & PRODUCT CATALOG CONTROLS                         */}
      {/* ========================================================================= */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
                <Store className="w-3.5 h-3.5" />
                <span>Marketplace & Catalog Governance</span>
              </div>
              <h3 className="text-xl font-bold text-white">Global Product Moderation & Commission Overrides</h3>
              <p className="text-xs text-slate-400 mt-1">
                Edit prices, adjust seller affiliate commission percentages (1%–100%), toggle visibility, and moderate digital products.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Seller Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price ($ USD)</th>
                    <th className="p-4">Affiliate Commission</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white">{prod.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{prod.id}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white">{prod.sellerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{prod.sellerId}</p>
                      </td>
                      <td className="p-4 text-slate-300">
                        {prod.category}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        ${prod.price.toFixed(2)}
                      </td>
                      <td className="p-4 font-bold text-indigo-400">
                        {Math.round((prod.affiliateCommissionRate ?? 0.1) * 100)}% ({((prod.price * (prod.affiliateCommissionRate ?? 0.1))).toFixed(2)} USD)
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            prod.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          Edit & Override
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MEMBERSHIPS & PRICING PLANS ENGINE                                        */}
      {/* ========================================================================= */}
      {activeTab === 'memberships' && (
        <form onSubmit={handleSaveMembershipPlans} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Tier Packages & Licensing</span>
              </div>
              <h3 className="text-xl font-bold text-white">Membership Plans, Pricing & Quotas</h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure annual license prices, annual renewal fees, storage limits, and CRM lead allowances for each tier.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Tier Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {membershipPlans.map((plan, idx) => (
              <div key={plan.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-white text-sm uppercase">{plan.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">{plan.id}</span>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Annual Tier Price ($ USD)</label>
                  <input
                    type="number"
                    value={plan.priceUsd}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setMembershipPlans(prev => prev.map((p, i) => i === idx ? { ...p, priceUsd: val } : p));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Annual Renewal Fee ($ USD)</label>
                  <input
                    type="number"
                    value={plan.annualRenewalUsd}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setMembershipPlans(prev => prev.map((p, i) => i === idx ? { ...p, annualRenewalUsd: val } : p));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Max CRM Leads Allowed</label>
                  <input
                    type="number"
                    value={plan.maxCrmLeads}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setMembershipPlans(prev => prev.map((p, i) => i === idx ? { ...p, maxCrmLeads: val } : p));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* CORPORATE LEADS MANAGEMENT (BOOK 7 §2)                                    */}
      {/* ========================================================================= */}
      {activeTab === 'corporate_leads' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Corporate Lead Distribution Engine</span>
              </div>
              <h3 className="text-xl font-bold text-white">Central Inbound Enterprise Leads Pipeline</h3>
              <p className="text-xs text-slate-400 mt-1">
                Leads captured from the global corporate website. Assign high-value enterprise prospects directly to qualified network leaders.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Contact Name</th>
                    <th className="p-4">Company Entity</th>
                    <th className="p-4">Inbound Source</th>
                    <th className="p-4">Assigned Leader</th>
                    <th className="p-4">Stage</th>
                    <th className="p-4 text-right">Assignment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {corporateLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white">{lead.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{lead.email}</p>
                      </td>
                      <td className="p-4 font-bold text-white">
                        {lead.company}
                      </td>
                      <td className="p-4 text-slate-400">
                        {lead.source}
                      </td>
                      <td className="p-4 font-bold text-indigo-400">
                        {lead.assignedTo}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {lead.stage}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            const leader = prompt('Assign this corporate lead to member ID/Name:', 'Marcus Vance');
                            if (leader) {
                              lead.assignedTo = leader;
                              showToast(`Lead assigned to ${leader}!`);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          Reassign Leader
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. COMMISSIONS & MLM BINARY ENGINE MASTER CONTROL                         */}
      {/* ========================================================================= */}
      {activeTab === 'binary_rules' && (
        <form onSubmit={handleSaveCommissions} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 mb-2">
                <Network className="w-3.5 h-3.5" />
                <span>SuperAdmin Financial Governance</span>
              </div>
              <h3 className="text-xl font-bold text-white">Global Commission Percentages & MLM Binary Rules</h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure platform-wide weaker-leg binary payout rates, direct product affiliate commissions, sponsor upline overrides, direct plan bonuses, and platform fees.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Rules</span>
            </button>
          </div>

          {/* Section 1: Binary MLM Compensation Engine */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span>1. Binary MLM Compensation Engine</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Weaker-Leg Binary Match Payout</span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-sm">
                    {commissionsForm.binaryCommissionRatePct}% Flat
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={commissionsForm.binaryCommissionRatePct}
                  onChange={(e) => setCommissionsForm({ ...commissionsForm, binaryCommissionRatePct: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1% Min</span>
                  <span>10% (Default)</span>
                  <span>30% Max</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Weekly payout percentage awarded on matched weaker-leg Business Volume (BV) with 1:1 USD EVO token settlement.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-white block mb-1">Volume Carryforward Policy</span>
                  <span className="text-[11px] text-slate-400 block mb-3">
                    Unmatched Business Volume on the stronger leg carries forward indefinitely to the next settlement cycle.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Flushing • Indefinite Carryforward Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Direct Affiliate & Upline Overrides */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>2. Direct Affiliate System & Upline Overrides</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Default Product Affiliate Rate</span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-sm">
                    {commissionsForm.affiliateCommissionRatePct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={commissionsForm.affiliateCommissionRatePct}
                  onChange={(e) => setCommissionsForm({ ...commissionsForm, affiliateCommissionRatePct: Number(e.target.value) })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5% Min</span>
                  <span>40% (Default)</span>
                  <span>80% Max</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Standard promoter commission earned on digital marketplace sales when an affiliate link is used.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Sponsor Upline Override Rate</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-sm">
                    {commissionsForm.uplineOverrideRatePct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={commissionsForm.uplineOverrideRatePct}
                  onChange={(e) => setCommissionsForm({ ...commissionsForm, uplineOverrideRatePct: Number(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0%</span>
                  <span>3% (Default)</span>
                  <span>15% Max</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Percentage of promoter commission routed upwards to the direct sponsor as leadership override.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Direct Plan Referral Bonuses */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>3. Direct Plan Referral Bonuses ($ EVO Tokens)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Launch Plan Bonus ($100 Sub)</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={commissionsForm.launchDirectBonusUsd}
                    onChange={(e) => setCommissionsForm({ ...commissionsForm, launchDirectBonusUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-400">EVO</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: $25.00 (100 BV)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Growth Plan Bonus ($300 Sub)</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={commissionsForm.growthDirectBonusUsd}
                    onChange={(e) => setCommissionsForm({ ...commissionsForm, growthDirectBonusUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-400">EVO</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: $75.00 (300 BV)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Legacy Plan Bonus ($500 Sub)</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={commissionsForm.legacyDirectBonusUsd}
                    onChange={(e) => setCommissionsForm({ ...commissionsForm, legacyDirectBonusUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-400">EVO</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: $125.00 (500 BV)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Platform Marketplace Fees */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>4. Platform Marketplace Fees & Direct Sales Split</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Promoter Sale Platform Fee</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={commissionsForm.platformMarketplaceFeePct}
                    onChange={(e) => setCommissionsForm({ ...commissionsForm, platformMarketplaceFeePct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs font-bold text-indigo-400">%</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: 10% on affiliate sales</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Direct Sale Platform Fee</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={commissionsForm.directSalePlatformFeePct}
                    onChange={(e) => setCommissionsForm({ ...commissionsForm, directSalePlatformFeePct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs font-bold text-indigo-400">%</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: 2% on seller direct sales</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Direct Sale Upline Bonus</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={commissionsForm.directSaleUplineBonusPct}
                    onChange={(e) => setCommissionsForm({ ...commissionsForm, directSaleUplineBonusPct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs font-bold text-indigo-400">%</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: 1% to seller upline</span>
              </div>
            </div>
          </div>

          {/* Section 5: Real-Time Simulation Sandbox */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Live Split Math Simulator (Based on Active Parameters)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Sample Product Sale: ${simSalePrice}.00</span>
                  <span className="text-[10px] text-slate-400">Promoter Sale Breakdown</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] pt-1">
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>Promoter Net ({(commissionsForm.affiliateCommissionRatePct * (1 - commissionsForm.uplineOverrideRatePct / 100)).toFixed(1)}%):</span>
                    <span>+${(simSalePrice * (commissionsForm.affiliateCommissionRatePct / 100) * (1 - commissionsForm.uplineOverrideRatePct / 100)).toFixed(2)} EVO</span>
                  </div>
                  <div className="flex justify-between text-purple-400">
                    <span>Upline Override ({commissionsForm.uplineOverrideRatePct}% of com):</span>
                    <span>+${(simSalePrice * (commissionsForm.affiliateCommissionRatePct / 100) * (commissionsForm.uplineOverrideRatePct / 100)).toFixed(2)} EVO</span>
                  </div>
                  <div className="flex justify-between text-indigo-400">
                    <span>Platform Fee ({commissionsForm.platformMarketplaceFeePct}%):</span>
                    <span>+${(simSalePrice * (commissionsForm.platformMarketplaceFeePct / 100)).toFixed(2)} EVO</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1">
                    <span>Seller Net Payout:</span>
                    <span>+${(simSalePrice * (1 - (commissionsForm.platformMarketplaceFeePct + commissionsForm.affiliateCommissionRatePct) / 100)).toFixed(2)} EVO</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Sample Weekly BV Match: {simBVMatch.toLocaleString()} BV</span>
                  <span className="text-[10px] text-slate-400">Binary Settlement</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] pt-1">
                  <div className="flex justify-between text-indigo-400 font-bold">
                    <span>Rate Applied:</span>
                    <span>{commissionsForm.binaryCommissionRatePct}% Flat Rate</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-extrabold text-sm border-t border-slate-800 pt-2">
                    <span>Weekly Member Payout:</span>
                    <span>${(simBVMatch * (commissionsForm.binaryCommissionRatePct / 100)).toFixed(2)} EVO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live Commission Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 8. SYSTEM FLAGS & COIN EXCHANGE RATE                                      */}
      {/* ========================================================================= */}
      {activeTab === 'system' && (
        <form onSubmit={handleSaveSystemFeatures} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">System Feature Flags & Monetary Parameters</h3>
            <p className="text-xs text-slate-400">
              Manage platform operational switches, maintenance mode, and EVO Token conversion rate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-300">Internal EVO Token Rate ($1.00 USD =)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={featuresForm.defaultCoinRateUsd}
                  onChange={(e) => setFeaturesForm({ ...featuresForm, defaultCoinRateUsd: parseFloat(e.target.value) || 1.0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm"
                />
                <span className="font-bold text-emerald-400 font-mono">EVO</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Maintenance Mode</span>
                <span className="text-[10px] text-slate-400">Puts public site under maintenance</span>
              </div>
              <button
                type="button"
                onClick={() => setFeaturesForm({ ...featuresForm, maintenanceMode: !featuresForm.maintenanceMode })}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                  featuresForm.maintenanceMode ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {featuresForm.maintenanceMode ? 'Active (Offline)' : 'Off (Live)'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">User Registrations</span>
                <span className="text-[10px] text-slate-400">Accept new entrepreneur sign-ups</span>
              </div>
              <button
                type="button"
                onClick={() => setFeaturesForm({ ...featuresForm, registrationOpen: !featuresForm.registrationOpen })}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                  featuresForm.registrationOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {featuresForm.registrationOpen ? 'Open' : 'Paused'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Wallet Withdrawals</span>
                <span className="text-[10px] text-slate-400">Allow USDT TRC20 payout requests</span>
              </div>
              <button
                type="button"
                onClick={() => setFeaturesForm({ ...featuresForm, withdrawalsEnabled: !featuresForm.withdrawalsEnabled })}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                  featuresForm.withdrawalsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {featuresForm.withdrawalsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save System Flags</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 9. AUDIT LOGS (BOOK 17)                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'audit_log' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Immutable Administrative Audit Log</h3>
            <button
              onClick={() => alert('Exporting audit trail to CSV...')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 font-mono">
                    <td className="p-4 font-bold text-white">{log.action}</td>
                    <td className="p-4 text-slate-400">{log.actor} ({log.actorRole})</td>
                    <td className="p-4 text-indigo-400 font-bold">{log.impactCategory}</td>
                    <td className="p-4 text-slate-300">{log.details}</td>
                    <td className="p-4 text-slate-500">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* DIRECT ADMIN WALLET ADJUSTMENT MODAL */}
      {selectedUserForWalletAdj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Direct Wallet Balance Adjustment</h3>
                  <p className="text-[11px] text-slate-400">Target: <b className="text-white">{selectedUserForWalletAdj.name}</b></p>
                </div>
              </div>
              <button onClick={() => setSelectedUserForWalletAdj(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Current User Balance:</span>
              <span className="font-mono font-black text-emerald-400 text-sm">
                ${selectedUserForWalletAdj.walletBalance.toFixed(2)} EVO
              </span>
            </div>

            <form onSubmit={handleExecuteWalletAdjustment} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjType('credit')}
                  className={`py-2 rounded-lg font-bold text-xs transition-all ${
                    adjType === 'credit' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  + Credit Funds (Deposit)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjType('debit')}
                  className={`py-2 rounded-lg font-bold text-xs transition-all ${
                    adjType === 'debit' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  - Debit Funds (Charge)
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Adjustment Amount ($ EVO)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Reason / Note for Ledger Audit Trail</label>
                <input
                  type="text"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="e.g. Compensation settlement, bonus credit, manual bank transfer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedUserForWalletAdj(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-md flex items-center gap-1.5 ${
                    adjType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  <span>Execute {adjType === 'credit' ? 'Credit' : 'Debit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODERATION MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">Edit Product & Override Affiliate Commission</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Affiliate Commission (1-100%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={Math.round((editingProduct.affiliateCommissionRate ?? 0.1) * 100)}
                    onChange={(e) => {
                      const pct = Math.max(1, Math.min(100, parseInt(e.target.value) || 10));
                      setEditingProduct({ ...editingProduct, affiliateCommissionRate: pct / 100 });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-indigo-400 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="SaaS & Source Code">SaaS & Source Code</option>
                    <option value="Courses & Masterclasses">Courses & Masterclasses</option>
                    <option value="E-Books & Guides">E-Books & Guides</option>
                    <option value="Templates & Prompts">Templates & Prompts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Visibility Status</label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="active">Active (Public)</option>
                    <option value="paused">Paused / Draft</option>
                    <option value="archived">Hidden / Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-md"
                >
                  Save Product Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAILS & DIRECT EDIT STUDIO MODAL */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-xs">
            {/* Modal Header */}
            <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-md shrink-0 bg-slate-800">
                  <img
                    src={userEditForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={userEditForm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{userEditForm.name || 'Member Details'}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {userEditForm.plan}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      userEditForm.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {userEditForm.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    ID: <b className="text-indigo-400">{userEditForm.id}</b> • Role: <b className="text-slate-200 capitalize">{userEditForm.role}</b> • Joined: {userEditForm.joinedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditUserMode(!isEditUserMode)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    isEditUserMode
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditUserMode ? 'Editing Mode' : 'Enable Edit'}</span>
                </button>
                <button
                  onClick={() => setSelectedUserForDetails(null)}
                  className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs inside Modal */}
            <div className="px-6 pt-3 pb-0 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'profile', label: 'Personal & Profile', icon: User },
                { id: 'subscription', label: 'Membership & Role', icon: ShieldCheck },
                { id: 'network', label: 'Affiliate & Binary Matrix', icon: Network },
                { id: 'finances', label: 'Treasury & Wallets', icon: Wallet },
                { id: 'security', label: 'Password & Security', icon: Key },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setUserModalTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all text-xs ${
                    userModalTab === tab.id
                      ? 'border-indigo-500 text-white bg-slate-900/90'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body / Tab Content */}
            <form onSubmit={handleSaveUserDetails} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* TAB 1: PERSONAL & PROFILE */}
              {userModalTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        disabled={!isEditUserMode}
                        value={userEditForm.name || ''}
                        onChange={(e) => setUserEditForm({ ...userEditForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold disabled:opacity-60 outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        disabled={!isEditUserMode}
                        value={userEditForm.email || ''}
                        onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white disabled:opacity-60 outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        disabled={!isEditUserMode}
                        placeholder="+1 (555) 000-0000"
                        value={userEditForm.phone || ''}
                        onChange={(e) => setUserEditForm({ ...userEditForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white disabled:opacity-60 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Country of Residence</label>
                      <input
                        type="text"
                        disabled={!isEditUserMode}
                        value={userEditForm.country || ''}
                        onChange={(e) => setUserEditForm({ ...userEditForm, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white disabled:opacity-60 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      disabled={!isEditUserMode}
                      value={userEditForm.avatar || ''}
                      onChange={(e) => setUserEditForm({ ...userEditForm, avatar: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs disabled:opacity-60 outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MEMBERSHIP & ROLE */}
              {userModalTab === 'subscription' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Membership Plan Tier</label>
                      <select
                        disabled={!isEditUserMode}
                        value={userEditForm.plan || 'launch'}
                        onChange={(e) => setUserEditForm({ ...userEditForm, plan: e.target.value as PlanTier })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold disabled:opacity-60 outline-none"
                      >
                        <option value="launch">LAUNCH TIER ($100 USD • 100 BV)</option>
                        <option value="growth">GROWTH TIER ($300 USD • 300 BV)</option>
                        <option value="legacy">LEGACY TIER ($500 USD • 500 BV)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Platform Role (RBAC)</label>
                      <select
                        disabled={!isEditUserMode}
                        value={userEditForm.role || 'member'}
                        onChange={(e) => setUserEditForm({ ...userEditForm, role: e.target.value as UserRole })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-bold disabled:opacity-60 outline-none"
                      >
                        <option value="member">Member (Regular Entrepreneur)</option>
                        <option value="support_staff">Support Staff (Ticket Agent)</option>
                        <option value="admin">Administrator (Moderation)</option>
                        <option value="super_admin">Super Administrator (Full System)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Account Status</label>
                      <select
                        disabled={!isEditUserMode}
                        value={userEditForm.status || 'active'}
                        onChange={(e) => setUserEditForm({ ...userEditForm, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold disabled:opacity-60 outline-none"
                      >
                        <option value="active">Active (Full Access)</option>
                        <option value="pending">Pending Verification</option>
                        <option value="suspended">Suspended (Locked Out)</option>
                        <option value="banned">Banned (Permanent Blacklist)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Annual Subscription Renewal Date</label>
                      <input
                        type="text"
                        disabled={!isEditUserMode}
                        value={userEditForm.renewalDate || ''}
                        onChange={(e) => setUserEditForm({ ...userEditForm, renewalDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white disabled:opacity-60 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">Onboarding Questionnaire Completed</h4>
                      <p className="text-[11px] text-slate-500">If unchecked, user is directed to the 7-question onboarding setup upon login.</p>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isEditUserMode}
                      checked={userEditForm.hasCompletedOnboarding === true}
                      onChange={(e) => setUserEditForm({ ...userEditForm, hasCompletedOnboarding: e.target.checked })}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer disabled:opacity-60"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: AFFILIATE & BINARY MATRIX */}
              {userModalTab === 'network' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Direct Sponsor ID (Upline)</label>
                      <input
                        type="text"
                        disabled={!isEditUserMode}
                        value={userEditForm.sponsorId || ''}
                        onChange={(e) => {
                          const newSponsorId = e.target.value;
                          const found = userRegistryEngine.getUserById(newSponsorId);
                          setUserEditForm({
                            ...userEditForm,
                            sponsorId: newSponsorId,
                            sponsorName: found ? found.name : userEditForm.sponsorName,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-mono font-bold disabled:opacity-60 outline-none"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Sponsor Name: <b>{userEditForm.sponsorName || 'System Root'}</b></p>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Preferred Placement Leg</label>
                      <select
                        disabled={!isEditUserMode}
                        value={userEditForm.binaryPlacementLeg || 'auto'}
                        onChange={(e) => setUserEditForm({ ...userEditForm, binaryPlacementLeg: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold disabled:opacity-60 outline-none"
                      >
                        <option value="auto">Auto-Balanced (Weaker Leg Placement)</option>
                        <option value="left">Force Left Team Branch</option>
                        <option value="right">Force Right Team Branch</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Binary Left Volume (Left BV)</label>
                      <input
                        type="number"
                        disabled={!isEditUserMode}
                        min="0"
                        value={userEditForm.binaryLeftVolume || 0}
                        onChange={(e) => setUserEditForm({ ...userEditForm, binaryLeftVolume: parseInt(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-mono font-bold disabled:opacity-60 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Binary Right Volume (Right BV)</label>
                      <input
                        type="number"
                        disabled={!isEditUserMode}
                        min="0"
                        value={userEditForm.binaryRightVolume || 0}
                        onChange={(e) => setUserEditForm({ ...userEditForm, binaryRightVolume: parseInt(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-400 font-mono font-bold disabled:opacity-60 outline-none"
                      />
                    </div>
                  </div>

                  {/* Direct Referrals List Preview */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">Direct Referrals Sponsored</h4>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                        {userRegistryEngine.getDirectReferrals(userEditForm.id).length} Recruits
                      </span>
                    </div>

                    {userRegistryEngine.getDirectReferrals(userEditForm.id).length === 0 ? (
                      <p className="text-slate-500 text-[11px]">This user has not directly recruited any downline members yet.</p>
                    ) : (
                      <div className="divide-y divide-slate-800/60 max-h-32 overflow-y-auto">
                        {userRegistryEngine.getDirectReferrals(userEditForm.id).map(ref => (
                          <div key={ref.id} className="py-1.5 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-300">{ref.name} ({ref.id})</span>
                            <span className="text-slate-500 font-mono">{ref.plan.toUpperCase()} • ${(ref.walletBalance || 0).toFixed(2)} EVO</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: TREASURY & WALLETS */}
              {userModalTab === 'finances' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Available Wallet Balance ($ EVO)</label>
                      <input
                        type="number"
                        step="0.01"
                        disabled={!isEditUserMode}
                        value={userEditForm.walletBalance || 0}
                        onChange={(e) => setUserEditForm({ ...userEditForm, walletBalance: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-sm disabled:opacity-60 outline-none"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Directly sets the user's available spending & withdrawal balance.</p>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Platform Token Balance (EVO Token)</label>
                      <input
                        type="number"
                        step="0.01"
                        disabled={!isEditUserMode}
                        value={userEditForm.tokenBalance || 0}
                        onChange={(e) => setUserEditForm({ ...userEditForm, tokenBalance: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-mono font-bold text-sm disabled:opacity-60 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-white">Need an Audited Balance Adjustment?</h4>
                      <p className="text-[11px] text-indigo-200">Use the Treasury Ledger studio to execute credit/debit with an audit log reason.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserForDetails(null);
                        setSelectedUserForWalletAdj(selectedUserForDetails);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shrink-0"
                    >
                      Open Treasury Adjuster
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: PASSWORD & SECURITY SETTINGS */}
              {userModalTab === 'security' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-400" />
                        <h4 className="font-black text-white text-xs">Administrative Password & Credential Override</h4>
                      </div>
                      <p className="text-[11px] text-indigo-200">
                        Super Admins can set a new password, force a password change upon next sign in, or dispatch a password reset email to <b>{userEditForm.email}</b>.
                      </p>
                    </div>
                    {userEditForm.lastPasswordResetAt && (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono shrink-0">
                        Last Reset: {userEditForm.lastPasswordResetAt}
                      </span>
                    )}
                  </div>

                  {passwordFeedbackMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
                      <span>{passwordFeedbackMsg}</span>
                      <button type="button" onClick={() => setPasswordFeedbackMsg(null)} className="text-emerald-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Direct Password Set / Reset Box */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <h4 className="font-bold text-white text-xs">Set New Password for User</h4>
                      <button
                        type="button"
                        onClick={handleGenerateRandomPassword}
                        className="px-3 py-1 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Random Password</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">New Password (Min. 6 chars)</label>
                        <div className="relative">
                          <input
                            type={showPasswordText ? 'text' : 'password'}
                            value={newPasswordInput}
                            onChange={(e) => setNewPasswordInput(e.target.value)}
                            placeholder="Enter new strong password"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs outline-none focus:border-indigo-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordText(!showPasswordText)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-white"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Confirm New Password</label>
                        <input
                          type={showPasswordText ? 'text' : 'password'}
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Re-enter password to confirm"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Require Password Change on Next Login</span>
                        <span className="text-[11px] text-slate-500">Forces user to choose their own personal password immediately upon next login.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={mustChangePasswordNextLogin}
                        onChange={(e) => setMustChangePasswordNextLogin(e.target.checked)}
                        className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAdminDirectPasswordReset}
                        disabled={isResettingPassword || !newPasswordInput}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{isResettingPassword ? 'Updating Password...' : 'Save & Set New Password'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Send Email Reset Option */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-white">Send Password Recovery Email</h4>
                      <p className="text-[11px] text-slate-400">Sends an official magic link allowing the member to reset their credentials securely.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendSupabasePasswordResetEmail}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Dispatch Reset Email</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedUserForDetails(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Close
                </button>

                {isEditUserMode && (
                  <button
                    type="submit"
                    disabled={isSavingUser}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    {isSavingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingUser ? 'Saving to Database...' : 'Save User Updates'}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};
