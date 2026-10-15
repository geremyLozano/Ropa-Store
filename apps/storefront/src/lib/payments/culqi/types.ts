export interface CulqiTokenResponce{
    token: string;
}

export interface CulqiChargeRequest{
    token: string;
    email: string;
    amount: number;
}