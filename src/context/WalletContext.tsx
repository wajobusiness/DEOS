import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletTransaction, LedgerEventType } from '../types';
import { paymentGateway, PaymentProviderType } from '../engine/paymentGatewayEngine';

interface WalletContextType {
  walletBalance: number;
  tokenBalance: number;
  availableBalance: number;
  transactions: WalletTransaction[];
  addDeposit: (amount: number, rail: string, reference?: string, description?: string) => Promise<WalletTransaction>;
  processWithdrawal: (amount: number, method: string, destination?: any) => Promise<{ success: boolean; transaction: WalletTransaction; message: string }>;
  processPurchase: (amount: number, description: string, reference?: string) => { success: boolean; transaction?: WalletTransaction; error?: string };
  processP2PTransfer: (amount: number, recipient: string) => { success: boolean; transaction?: WalletTransaction; error?: string };
  creditCommission: (amount: number, type: LedgerEventType, description: string, reference?: string) => WalletTransaction;
  resetLedger: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const LOCAL_STORAGE_WALLET_BALANCE_KEY = 'eviona_wallet_balance';
const LOCAL_STORAGE_LEDGER_KEY = 'eviona_wallet_ledger_txs';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent real wallet balance
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WALLET_BALANCE_KEY);
      return saved ? parseFloat(saved) : 0.00;
    } catch {
      return 0.00;
    }
  });

  // Load persistent real transactions
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LEDGER_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever balance or transactions change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WALLET_BALANCE_KEY, walletBalance.toFixed(2));
      localStorage.setItem(LOCAL_STORAGE_LEDGER_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.warn('[WalletContext] Failed to persist wallet state:', e);
    }
  }, [walletBalance, transactions]);

  // 1. Add Deposit (Real Ledger Ingestion)
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

    setWalletBalance(prev => {
      const updated = prev + amount;
      return updated;
    });

    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  // 2. Process Withdrawal (Real Ledger Debit)
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

  // 3. Process Purchase (Marketplace, Courses, Subscriptions)
  const processPurchase = (amount: number, description: string, reference?: string): { success: boolean; transaction?: WalletTransaction; error?: string } => {
    if (amount <= 0) {
      return { success: false, error: 'Invalid purchase amount.' };
    }
    if (amount > walletBalance) {
      return { success: false, error: `Insufficient wallet balance. Total due: $${amount.toFixed(2)} EVO, available: $${walletBalance.toFixed(2)} EVO. Please deposit funds first.` };
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

  // 4. Process P2P Member Transfer
  const processP2PTransfer = (amount: number, recipient: string): { success: boolean; transaction?: WalletTransaction; error?: string } => {
    if (amount <= 0) {
      return { success: false, error: 'Invalid transfer amount.' };
    }
    if (amount > walletBalance) {
      return { success: false, error: `Insufficient wallet balance for transfer.` };
    }

    const ref = `TRF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTx: WalletTransaction = {
      id: ref,
      type: 'wallet_transfer_out',
      description: `P2P Transfer to ${recipient}`,
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

  // 5. Credit Affiliate / Binary / Seller Commission
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
    localStorage.removeItem(LOCAL_STORAGE_WALLET_BALANCE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_LEDGER_KEY);
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
