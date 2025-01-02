export interface UserPublic {
    id?: string;
    email?: string;
    name?: string;
}

export interface UserRegister {
    email?: string;
    name?: string;
    password?: string;
}

export interface UserLogin {
    email: string;
    password: string;
}