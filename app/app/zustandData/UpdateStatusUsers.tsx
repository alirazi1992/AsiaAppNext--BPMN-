import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfileDocumentsModel {
    userName: string | null,
    userId: string | null,
}

export interface UpdateUserData {
    userName: string | null,
    userId: string | null,
    setState: (newUser: any) => Promise<void>;
    GetState: () => UserProfileDocumentsModel;
}

const useStore = create<UpdateUserData>()(
    persist(
        (set, get) => ({
            userName: null,
            userId: null,
            setState: async (newUser: UpdateUserData) => {
                set((state) => ({
                    userName: newUser.userName,
                    userId: newUser.userId
                }))
            },
            GetState: (): UserProfileDocumentsModel => {
                return {
                    userName: get().userName,
                    userId: get().userId
                } as UserProfileDocumentsModel
            }
        }),
        {
            name: "StatusUser-store"
        }
    )
)


export default useStore;