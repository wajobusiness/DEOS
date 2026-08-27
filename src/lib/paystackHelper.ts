export interface PaystackCheckoutOptions {
  publicKey?: string;
  email: string;
  amountUSD: number;
  ngnExchangeRate?: number;
  reference?: string;
  customerName?: string;
  metadata?: Record<string, any>;
  onSuccess: (response: { reference: string; status: string; channel?: string }) => void;
  onClose?: () => void;
}

export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).PaystackPop) {
      resolve(true);
      return;
    }
    const existing = document.getElementById('paystack-inline-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-inline-js';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function launchPaystackPopup(options: {
  publicKey?: string;
  email: string;
  amountUSD: number;
  ngnExchangeRate?: number;
  reference?: string;
  customerName?: string;
  metadata?: Record<string, any>;
  onSuccess: (response: { reference: string; status: string }) => void;
  onClose?: () => void;
}): Promise<boolean> {
  const key = options.publicKey?.trim();
  if (!key || key.length < 5) {
    return false;
  }

  const loaded = await loadPaystackScript();
  if (!loaded || !(window as any).PaystackPop) {
    return false;
  }

  const rate = options.ngnExchangeRate || 1550;
  const amountKobo = Math.round(options.amountUSD * rate * 100);
  const ref = options.reference || `EVP-${Date.now().toString().slice(-6)}`;

  try {
    const handler = (window as any).PaystackPop.setup({
      key,
      email: options.email || 'customer@evionaecosystem.com',
      amount: amountKobo,
      currency: 'NGN',
      ref,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: options.customerName || 'Customer' },
          { display_name: 'Amount in USD', variable_name: 'amount_usd', value: options.amountUSD.toString() },
          ...(options.metadata?.custom_fields || []),
        ],
        ...options.metadata,
      },
      callback: (res: any) => {
        options.onSuccess({
          reference: res.reference || ref,
          status: 'success',
        });
      },
      onClose: () => {
        if (options.onClose) options.onClose();
      },
    });

    handler.openIframe();
    return true;
  } catch (err) {
    console.warn('[PaystackPop] Error launching inline popup:', err);
    return false;
  }
}
