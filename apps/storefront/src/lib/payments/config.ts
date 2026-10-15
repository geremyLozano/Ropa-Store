export const paymentConfig = {
    culqi: {
        enabled: true,
        environment: process.env.CULQI_ENVIROMENT ?? 'sandbox',
        publickey: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? '',
    }
}