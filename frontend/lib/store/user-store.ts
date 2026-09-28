import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../mock-data/users';
import { mockUsers } from '../mock-data/users';

interface UserStore {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  clearUser: () => void;
  isRole: (role: User['role']) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: mockUsers[0], // Default to first user (Dr. Sarah Johnson)
      
      setCurrentUser: (user: User) => {
        set({ currentUser: user });
      },
      
      clearUser: () => {
        set({ currentUser: null });
      },
      
      isRole: (role: User['role']) => {
        const { currentUser } = get();
        return currentUser?.role === role;
      },
    }),
    {
      name: 'anapath-user-storage', // localStorage key
    }
  )
);

// Hook to get current user
export const useCurrentUser = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  return currentUser;
};

// Hook to check if user has a specific role
export const useIsRole = (role: User['role']) => {
  const isRole = useUserStore((state) => state.isRole);
  return isRole(role);
};

// Hook to get user actions
export const useUserActions = () => {
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const clearUser = useUserStore((state) => state.clearUser);
  
  return {
    setCurrentUser,
    clearUser,
  };
};
