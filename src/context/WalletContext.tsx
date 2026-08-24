import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WalletTransaction, LedgerEventType } from '../types';
import { supabase } from '../lib/supabaseClient';

export interface RecipientProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface P2PTransferResult {
  success: boolean;
  transaction?: WalletTransaction;
  recipient?: RecipientProfile;
  message?: string;
  error?: string;
}

interface P2PRegistryEntry {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientTarget: string; // target ID or email
  recipientId?: string;
  recipientEmail?: string;
  recipientName?: string;
  amount: number;
  date: string;
  time: string;
  claimedBy: string[]; // List of user identities that have ingested this transfer
}

interface WalletContextType {
  walletBalance: number;
  tokenBalance: number;
  availableBalance: number;
  transactions: WalletTransaction[];
  addDeposit: (amount: number, rail: string, reference?: string, description?: string) => Promise<WalletTransaction>;
  processWithdrawal: (amount: number, method: string, destination?: any) => Promise<{ success: boolean; transaction: WalletTransaction; message: string }>;
  processPurchase: (amount: number, description: string, reference?: string) => { success: boolean; transaction?: WalletTransaction; error?: string };
  processP2PTransfer: (amount: number, recipientInput: string) => Promise<P2PTransferResult>;
  creditCommission: (amount: number, type: LedgerEventType, description: string, reference?: string) => WalletTransaction;
  lookupRecipient: (query: string) => Promise<RecipientProfile | null>;
  resetLedger: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const LOCAL_STORAGE_ACTIVE_MEMBER_KEY = 'eviona_active_member_profile';
const LOCAL_STORAGE_P2P_REGISTRY_KEY = 'eviona_p2p_transfer_registry_v2';

// Known fallback directory for instant resolution
const KNOWN_MEMBERS_DIRECTORY: RecipientProfile[] = [
  { id: 'EVO-ID-100245', name: 'John Doe', email: 'john@evionaecosystem.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'EVO-ID-100246', name: 'Sarah Johnson', email: 'sarah@agency.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'EVO-ID-100247', name: 'Michael Brown', email: 'michael@bright.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'EVO-ID-100248', name: 'Emily Davis', email: 'emily@consulting.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'EVO-ID-000001', name: 'Super Admin', email: 'admin@evionaecosystem.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
];

function getActiveUserIdentifier(): { id: string; email: string; name: string } {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACTIVE_MEMBER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const rawId = parsed.id || parsed.memberCode || 'EVO-ID-100245';
      const cleanId = rawId.startsWith('EVO-ID-') ? rawId : `EVO-ID-${rawId.replace(/^EVO-?I?D?-?/i, '')}`;
      return {
        id: cleanId,
        email: (parsed.email || 'user@evionaecosystem.com').toLowerCase(),
        name: parsed.name || 'Entrepreneur',
      };
    }
  } catch {}
  return { id: 'EVO-ID-100245', email: 'user@evionaecosystem.com', name: 'Entrepreneur' };
}

function getUserStorageKey(identifier: string, suffix: 'balance' | 'ledger'): string {
  const clean = identifier.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  return `eviona_wallet_${suffix}_${clean}`;
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const activeUser = getActiveUserIdentifier();

  // Load persistent user wallet balance
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const userKey = getUserStorageKey(activeUser.email, 'balance');
      const savedUser = localStorage.getItem(userKey);
      if (savedUser) return parseFloat(savedUser);

      const savedIdKey = getUserStorageKey(activeUser.id, 'balance');
      const savedId = localStorage.getItem(savedIdKey);
      if (savedId) return parseFloat(savedId);

      const globalSaved = localStorage.getItem('eviona_wallet_balance');
      return globalSaved ? parseFloat(globalSaved) : 0.00;
    } catch {
      return 0.00;
    }
  });

  // Load persistent user ledger transactions
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const userKey = getUserStorageKey(activeUser.email, 'ledger');
      const savedUser = localStorage.getItem(userKey);
      if (savedUser) return JSON.parse(savedUser);

      const savedIdKey = getUserStorageKey(activeUser.id, 'ledger');
      const savedId = localStorage.getItem(savedIdKey);
      if (savedId) return JSON.parse(savedId);

      const globalSaved = localStorage.getItem('eviona_wallet_ledger_txs');
      return globalSaved ? JSON.parse(globalSaved) : [];
    } catch {
      return [];
    }
  });

  // Persist wallet state for both email and ID keys
  useEffect(() => {
    try {
      const formattedBalance = walletBalance.toFixed(2);
      const emailKey = getUserStorageKey(activeUser.email, 'balance');
      const idKey = getUserStorageKey(activeUser.id, 'balance');
      localStorage.setItem(emailKey, formattedBalance);
      localStorage.setItem(idKey, formattedBalance);
      localStorage.setItem('eviona_wallet_balance', formattedBalance);

      const serializedLedger = JSON.stringify(transactions);
      const emailLedgerKey = getUserStorageKey(activeUser.email, 'ledger');
      const idLedgerKey = getUserStorageKey(activeUser.id, 'ledger');
      localStorage.setItem(emailLedgerKey, serializedLedger);
      localStorage.setItem(idLedgerKey, serializedLedger);
      localStorage.setItem('eviona_wallet_ledger_txs', serializedLedger);
    } catch (e) {
      console.warn('[WalletContext] Failed to persist wallet state:', e);
    }
  }, [walletBalance, transactions, activeUser.email, activeUser.id]);

  // Ingest incoming P2P transfers meant for the current active user
  const syncIncomingTransfers = useCallback(() => {
    try {
      const registryRaw = localStorage.getItem(LOCAL_STORAGE_P2P_REGISTRY_KEY);
      if (!registryRaw) return;

      const registry: P2PRegistryEntry[] = JSON.parse(registryRaw);
      let newBalance = walletBalance;
      let newTransactions = [...transactions];
      let registryModified = false;

      const currentIdentities = [
        activeUser.id.toUpperCase(),
        activeUser.email.toLowerCase(),
        activeUser.id.replace('EVO-ID-', '').toUpperCase(),
      ];

      for (const item of registry) {
        const targetClean = item.recipientTarget.trim().toUpperCase();
        const targetEmail = (item.recipientEmail || '').trim().toLowerCase();
        const targetId = (item.recipientId || '').trim().toUpperCase();

        const isAddressedToMe =
          currentIdentities.includes(targetClean) ||
          (targetEmail && currentIdentities.includes(targetEmail)) ||
          (targetId && currentIdentities.includes(targetId));

        const isClaimedByMe = item.claimedBy.some(claim => currentIdentities.includes(claim.toUpperCase()) || currentIdentities.includes(claim.toLowerCase()));

        if (isAddressedToMe && !isClaimedByMe) {
          // Credit transfer to active user
          newBalance += item.amount;
          const inTx: WalletTransaction = {
            id: item.id,
            type: 'wallet_transfer_in',
            description: `P2P Transfer from ${item.senderName} (${item.senderId})`,
            amount: item.amount,
            currency: 'EVO',
            status: 'Completed',
            date: item.date,
            time: item.time,
          };

          // Avoid duplicating in ledger
          if (!newTransactions.some(t => t.id === item.id)) {
            newTransactions = [inTx, ...newTransactions];
          }

          item.claimedBy.push(activeUser.id, activeUser.email);
          registryModified = true;
        }
      }

      if (registryModified) {
        setWalletBalance(newBalance);
        setTransactions(newTransactions);
        localStorage.setItem(LOCAL_STORAGE_P2P_REGISTRY_KEY, JSON.stringify(registry));
      }
    } catch (err) {
      console.warn('[WalletContext] Error syncing incoming transfers:', err);
    }
  }, [walletBalance, transactions, activeUser.id, activeUser.email]);

  // Run synchronization on mount and when storage events trigger
  useEffect(() => {
    syncIncomingTransfers();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_P2P_REGISTRY_KEY || e.key === LOCAL_STORAGE_ACTIVE_MEMBER_KEY) {
        syncIncomingTransfers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncIncomingTransfers]);

  // Recipient Lookup helper
  const lookupRecipient = async (query: string): Promise<RecipientProfile | null> => {
    if (!query || !query.trim()) return null;
    const clean = query.trim();

    // 1. Check known directory
    const known = KNOWN_MEMBERS_DIRECTORY.find(
      m => m.id.toUpperCase() === clean.toUpperCase() || m.email.toLowerCase() === clean.toLowerCase()
    );
    if (known) return known;

    // 2. Query Supabase Member table
    try {
      const { data, error } = await supabase
        .from('Member')
        .select('id, name, email, memberCode, avatarUrl')
        .or(`id.eq.${clean},memberCode.eq.${clean},email.ilike.${clean}`)
        .maybeSingle();

      if (data && !error) {
        const rawCode = data.memberCode || data.id;
        const code = rawCode.startsWith('EVO-ID-') ? rawCode : `EVO-ID-${rawCode.replace(/^EVO-?I?D?-?/i, '')}`;
        return {
          id: code,
          name: data.name || 'Eviona Member',
          email: data.email || clean,
          avatar: data.avatarUrl,
        };
      }
    } catch (e) {
      console.warn('[WalletContext] Recipient query note:', e);
    }

    // 3. Fallback: valid email or EVO-ID format
    if (clean.includes('@') && clean.includes('.')) {
      return {
        id: `EVO-ID-${clean.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}`,
        name: clean.split('@')[0],
        email: clean.toLowerCase(),
      };
    }

    if (clean.toUpperCase().startsWith('EVO')) {
      const formatted = clean.startsWith('EVO-ID-') ? clean.toUpperCase() : `EVO-ID-${clean.replace(/^EVO-?I?D?-?/i, '').toUpperCase()}`;
      return {
        id: formatted,
        name: `Member (${formatted})`,
        email: `${formatted.toLowerCase()}@evionaecosystem.com`,
      };
    }

    return null;
  };

  // 1. Add Deposit
  const addDeposit = async (amount: number, rail: string, reference?: string, description?: string): Promise<WalletTransaction> => {
    const ref = reference || `DEP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTx: WalletTransaction = {
      id: ref,
      type: 'coin_deposit',
      description: description || `Deposit via ${rail.toUpperCase()} (Model A: 1.00 USD = 1.00 EVO)`,
      amount: amount,
      currency: 'EVO',
      status: 'Completed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setWalletBalance(prev => prev + amount);
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  // 2. Process Withdrawal
  const processWithdrawal = async (amount: number, method: string, destination?: any): Promise<{ success: boolean; transaction: WalletTransaction; message: string }> => {
    if (amount <= 0) {
      throw new Error('Please enter a valid withdrawal amount.');
    }
    if (amount > walletBalance) {
      throw new Error(`Insufficient wallet balance. You have ${walletBalance.toFixed(2)} EVO available.`);
    }
    if (amount < 25.00) {
      throw new Error('Minimum withdrawal threshold is 25.00 EVO ($25.00 USD).');
    }

    const ref = `WDR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTx: WalletTransaction = {
      id: ref,
      type: 'wallet_withdrawal',
      description: `Withdrawal via ${method}`,
      amount: -amount,
      currency: 'EVO',
      status: 'Processing',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setWalletBalance(prev => Math.max(0, prev - amount));
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      transaction: newTx,
      message: `Withdrawal request for ${amount.toFixed(2)} EVO successfully queued for settlement to ${method}.`,
    };
  };

  // 3. Process Purchase
  const processPurchase = (amount: number, description: string, reference?: string): { success: boolean; transaction?: WalletTransaction; error?: string } => {
    if (amount <= 0) {
      return { success: false, error: 'Invalid purchase amount.' };
    }
    if (amount > walletBalance) {
      return { success: false, error: `Insufficient wallet balance. Total due: $${amount.toFixed(2)} EVO, available: $${walletBalance.toFixed(2)} EVO.` };
    }

    const ref = reference || `PUR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTx: WalletTransaction = {
      id: ref,
      type: 'platform_transaction_fee',
      description: description,
      amount: -amount,
      currency: 'EVO',
      status: 'Completed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setWalletBalance(prev => Math.max(0, prev - amount));
    setTransactions(prev => [newTx, ...prev]);

    return { success: true, transaction: newTx };
  };

  // 4. Process P2P Member Transfer (Updates BOTH Sender and Receiver Ledger)
  const processP2PTransfer = async (amount: number, recipientInput: string): Promise<P2PTransferResult> => {
    if (amount <= 0) {
      return { success: false, error: 'Invalid transfer amount. Please enter an amount greater than 0.' };
    }
    if (amount > walletBalance) {
      return { success: false, error: `Insufficient wallet balance. Available: $${walletBalance.toFixed(2)} EVO.` };
    }

    const cleanInput = recipientInput.trim();
    if (!cleanInput) {
      return { success: false, error: 'Please specify the recipient Platform ID or Email.' };
    }

    // Disallow self transfer
    const sender = getActiveUserIdentifier();
    if (
      cleanInput.toLowerCase() === sender.email.toLowerCase() ||
      cleanInput.toUpperCase() === sender.id.toUpperCase() ||
      cleanInput.toUpperCase() === sender.id.replace('EVO-ID-', '').toUpperCase()
    ) {
      return { success: false, error: 'You cannot perform a P2P transfer to your own account.' };
    }

    // Resolve Recipient Profile
    const recipient = await lookupRecipient(cleanInput);
    if (!recipient) {
      return { success: false, error: `Recipient "${cleanInput}" could not be found. Please verify the Platform ID or Email.` };
    }

    const txDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const txTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const transferId = `TRF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // A. Create Outgoing Transaction for SENDER
    const senderTx: WalletTransaction = {
      id: `${transferId}-OUT`,
      type: 'wallet_transfer_out',
      description: `P2P Transfer to ${recipient.name} (${recipient.id})`,
      amount: -amount,
      currency: 'EVO',
      status: 'Completed',
      date: txDate,
      time: txTime,
    };

    // B. Create Incoming Transaction for RECEIVER
    const receiverTx: WalletTransaction = {
      id: `${transferId}-IN`,
      type: 'wallet_transfer_in',
      description: `P2P Transfer from ${sender.name} (${sender.id})`,
      amount: amount, // Positive credit
      currency: 'EVO',
      status: 'Completed',
      date: txDate,
      time: txTime,
    };

    // 1. Debit Sender in Active Memory State
    setWalletBalance(prev => Math.max(0, prev - amount));
    setTransactions(prev => [senderTx, ...prev]);

    // 2. Credit Receiver in Persistent Storage (for both email and ID aliases)
    try {
      const recipientKeys = [
        recipient.email.toLowerCase(),
        recipient.id.toUpperCase(),
        cleanInput.toLowerCase(),
        cleanInput.toUpperCase(),
      ];

      for (const rKey of recipientKeys) {
        const balKey = getUserStorageKey(rKey, 'balance');
        const ledgerKey = getUserStorageKey(rKey, 'ledger');

        const currentBalRaw = localStorage.getItem(balKey);
        const currentBal = currentBalRaw ? parseFloat(currentBalRaw) : 0.00;
        localStorage.setItem(balKey, (currentBal + amount).toFixed(2));

        const currentLedgerRaw = localStorage.getItem(ledgerKey);
        const currentLedger: WalletTransaction[] = currentLedgerRaw ? JSON.parse(currentLedgerRaw) : [];
        localStorage.setItem(ledgerKey, JSON.stringify([receiverTx, ...currentLedger]));
      }

      // 3. Register in Global P2P Registry for Real-time Ingestion
      const registryRaw = localStorage.getItem(LOCAL_STORAGE_P2P_REGISTRY_KEY);
      const registry: P2PRegistryEntry[] = registryRaw ? JSON.parse(registryRaw) : [];
      registry.push({
        id: receiverTx.id,
        senderId: sender.id,
        senderName: sender.name,
        senderEmail: sender.email,
        recipientTarget: cleanInput,
        recipientId: recipient.id,
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        amount: amount,
        date: txDate,
        time: txTime,
        claimedBy: [],
      });
      localStorage.setItem(LOCAL_STORAGE_P2P_REGISTRY_KEY, JSON.stringify(registry));

      // 4. Background Sync to Supabase Database
      try {
        // Sync sender balance in DB
        await supabase
          .from('Member')
          .update({
            walletBalance: Math.max(0, walletBalance - amount),
            wallet_balance: Math.max(0, walletBalance - amount),
          })
          .or(`id.eq.${sender.id},email.ilike.${sender.email}`);

        // Sync recipient balance in DB
        const { data: recipDb } = await supabase
          .from('Member')
          .select('id, walletBalance, wallet_balance')
          .or(`id.eq.${recipient.id},memberCode.eq.${recipient.id},email.ilike.${recipient.email}`)
          .maybeSingle();

        if (recipDb) {
          const updatedRecipBal = Number(recipDb.walletBalance || recipDb.wallet_balance || 0) + amount;
          await supabase
            .from('Member')
            .update({
              walletBalance: updatedRecipBal,
              wallet_balance: updatedRecipBal,
            })
            .eq('id', recipDb.id);
        }
      } catch (dbErr) {
        console.warn('[WalletContext] Database P2P sync note:', dbErr);
      }
    } catch (storageErr) {
      console.warn('[WalletContext] Recipient storage write note:', storageErr);
    }

    return {
      success: true,
      transaction: senderTx,
      recipient,
      message: `Successfully transferred ${amount.toFixed(2)} EVO Tokens to ${recipient.name} (${recipient.id})!`,
    };
  };

  // 5. Credit Commission
  const creditCommission = (amount: number, type: LedgerEventType, description: string, reference?: string): WalletTransaction => {
    const ref = reference || `COM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTx: WalletTransaction = {
      id: ref,
      type: type,
      description: description,
      amount: amount,
      currency: 'EVO',
      status: 'Completed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setWalletBalance(prev => prev + amount);
    setTransactions(prev => [newTx, ...prev]);

    return newTx;
  };

  const resetLedger = () => {
    setWalletBalance(0.00);
    setTransactions([]);
    localStorage.removeItem('eviona_wallet_balance');
    localStorage.removeItem('eviona_wallet_ledger_txs');
    localStorage.removeItem(LOCAL_STORAGE_P2P_REGISTRY_KEY);
  };

  return (
    <WalletContext.Provider
      value={{
        walletBalance,
        tokenBalance: walletBalance,
        availableBalance: walletBalance,
        transactions,
        addDeposit,
        processWithdrawal,
        processPurchase,
        processP2PTransfer,
        creditCommission,
        lookupRecipient,
        resetLedger,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
