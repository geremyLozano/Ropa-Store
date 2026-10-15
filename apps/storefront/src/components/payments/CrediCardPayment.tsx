'use client';

import { CreditCard, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { paymentConfig } from '@/lib/payments/config';
import CardIcons from './CardIcons';

export default function CreditCardPayment() {
    const isConfigured =
        paymentConfig.culqi.publickey.trim().length > 0;

    return (
        <div className="mt-6 rounded-xl border bg-card p-6 space-y-6">

            <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary" />

                <div>
                    <h3 className="font-semibold">
                        Pago con tarjeta
                    </h3>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Aceptamos las siguientes tarjetas
                        </p>

                        <CardIcons />
                    </div>
                </div>
            </div>

            <Alert>
                <ShieldCheck className="h-4 w-4" />

                <AlertDescription>
                    Tus datos serán procesados directamente por Culqi.
                    Esta tienda nunca almacena información de tarjetas.
                </AlertDescription>
            </Alert>

            {/* Aquí Culqi insertará el formulario */}

            <div
                id="culqi-checkout-container"
                className="min-h-[220px] rounded-lg border-2 border-dashed border-muted flex items-center justify-center"
            >
                <p className="text-sm text-muted-foreground">
                    {isConfigured
                        ? 'Inicializando Culqi...'
                        : 'Esperando configuración de Culqi'}
                </p>
            </div>

            <div className="text-xs text-muted-foreground">
                Ambiente:
                <span className="ml-1 font-medium uppercase">
                    {paymentConfig.culqi.environment}
                </span>
            </div>

        </div>
    );
}