export interface User {
    name: string;
    email: string;
    password: string;
}

export interface AuthState {
    users: User[];  // store multiple users
    currentUser: User | null; // logged in user
    tempEmail?: string;
    tempPassword?: string;
    tempOtp?: string;
}