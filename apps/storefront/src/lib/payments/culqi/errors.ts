export class CulqiError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'CulqiError';
    }
}