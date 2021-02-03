export interface User {
    uid: string;
    id?: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    coins: number;
    highScore: number;
    boughtSkins: any;
    activeSkin: number;
}

export interface Leader {
    uid: string;
    score: number;
    name: string;
}
