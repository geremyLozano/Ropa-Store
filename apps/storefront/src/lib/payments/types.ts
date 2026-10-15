export type PaymenProvider = 'culqi';

export interface PaymentResult {
    success: boolean;
    message?: string;
    token?: string;
}

export interface CreditCardPaymentData {
    email: string;
    amount: number;
    currency: string;
}