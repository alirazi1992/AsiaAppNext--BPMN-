import { create } from 'zustand';

export interface UpdateUserData {
    id: string;
    userName: string;
    accessFailedCount: number;
    lockoutEnd: string;
    twoFactorEnabled: boolean;
    lockoutEnabled: boolean;
    isActive: boolean;
    email: string,
    phoneNumber: string
    setState: (newUser: any) => Promise<void>;
}

const useStore = create<UpdateUserData>((set) => ({
    id: '',
    userName: '',
    accessFailedCount: 0,
    lockoutEnd: '',
    twoFactorEnabled: false,
    lockoutEnabled: false,
    isActive: false,
    email: '',
    phoneNumber: '',
    setState: async (newUser: UpdateUserData) => {
        set((state) => ({
            ...state,
            id: newUser.id,
            userName: newUser.userName,
            accessFailedCount: newUser.accessFailedCount,
            lockoutEnd: newUser.lockoutEnd,
            twoFactorEnabled: newUser.twoFactorEnabled,
            lockoutEnabled: newUser.lockoutEnabled,
            isActive: newUser.isActive,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
        }))
    }
}))



export default useStore;
