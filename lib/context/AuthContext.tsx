"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import pb, { User, UserProfile } from '@/lib/pocketbase';

interface AuthUser extends User {
  profile?: UserProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from PocketBase auth store on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.model) {
          const userData = pb.authStore.model as unknown as User;
          // Fetch user profile
          try {
            const profile = await pb.collection('user_profiles').getFirstListItem<UserProfile>(
              `user="${userData.id}"`
            );
            setUser({ ...userData, profile });
          } catch {
            // No profile yet
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        pb.authStore.clear();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for auth changes
    pb.authStore.onChange(() => {
      if (!pb.authStore.isValid) {
        setUser(null);
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await pb.collection('users').authWithPassword(email, password);
    const userData = authData.record as unknown as User;

    // Fetch profile
    try {
      const profile = await pb.collection('user_profiles').getFirstListItem<UserProfile>(
        `user="${userData.id}"`
      );
      setUser({ ...userData, profile });
    } catch {
      setUser(userData);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const refreshUser = async () => {
    if (!pb.authStore.isValid || !pb.authStore.model) return;

    const userData = await pb.collection('users').getOne<User>(pb.authStore.model.id);
    try {
      const profile = await pb.collection('user_profiles').getFirstListItem<UserProfile>(
        `user="${userData.id}"`
      );
      setUser({ ...userData, profile });
    } catch {
      setUser(userData);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user?.profile?.id) return;

    const updated = await pb.collection('user_profiles').update<UserProfile>(
      user.profile.id,
      data
    );
    setUser({ ...user, profile: updated });
  };

  const updateAvatar = async (file: File): Promise<string> => {
    if (!user?.profile?.id) throw new Error('No profile found');

    const formData = new FormData();
    formData.append('avatar', file);

    const updated = await pb.collection('user_profiles').update<UserProfile>(
      user.profile.id,
      formData
    );

    setUser({ ...user, profile: updated });

    // Return the avatar URL
    if (updated.avatar) {
      return `${pb.baseUrl}/api/files/user_profiles/${updated.id}/${updated.avatar}`;
    }
    return '';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        updateProfile,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Demo user for testing (when PocketBase is not available)
export const DEMO_USER: AuthUser = {
  id: 'demo-user-1',
  email: 'ahmad.abdullah@company.com.my',
  name: 'Ahmad bin Abdullah',
  role: 'student',
  phone: '+60 12-345 6789',
  company: 'Petronas Dagangan Berhad',
  created: '2024-01-15T00:00:00Z',
  updated: '2024-12-20T00:00:00Z',
  profile: {
    id: 'profile-1',
    user: 'demo-user-1',
    bio: 'Passionate about driving organizational change through effective project management and agile practices. 15+ years of experience in the oil & gas industry.',
    linkedin: 'linkedin.com/in/ahmadabdullah',
    department: 'Digital Transformation',
    position: 'Senior Project Manager',
    skills: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'PMO Setup', 'Stakeholder Management'],
    avatar: '',
    member_type: 'premium',
    member_until: '2025-12-31T00:00:00Z',
    notification_email: true,
    notification_courses: true,
    notification_events: true,
    created: '2024-01-15T00:00:00Z',
    updated: '2024-12-20T00:00:00Z',
  },
};
