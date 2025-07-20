
import type { User } from '../types';
import { MOCK_USERS_WITH_PASSWORDS } from '../constants';

type UserWithPassword = User & { password?: string };

const CURRENT_USER_STORAGE_KEY = 'geminigram_currentUser';
const ALL_USERS_KEY = 'geminigram_allUsers';

const getStoredUsers = (): UserWithPassword[] => {
    try {
        const storedUsers = localStorage.getItem(ALL_USERS_KEY);
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
    } catch (e) { 
        console.error("Failed to parse users from localStorage", e);
    }
    // If nothing in storage, seed it with mock data
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(MOCK_USERS_WITH_PASSWORDS));
    return MOCK_USERS_WITH_PASSWORDS;
};

let allUsers: UserWithPassword[] = getStoredUsers();

const saveUsers = () => {
    try {
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
    } catch (e) {
        console.error("Failed to save users to localStorage", e);
    }
};

const sanitizeUser = (user: UserWithPassword): User => {
    const { password, ...sanitized } = user;
    return sanitized;
};

export const login = (username: string, password_input: string): Promise<User | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = allUsers.find(u => u.username === username && u.password === password_input);
            if (user) {
                const sanitized = sanitizeUser(user);
                localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sanitized));
                resolve(sanitized);
            } else {
                resolve(null);
            }
        }, 500);
    });
};

export const signup = (username: string, password_input: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (allUsers.some(u => u.username === username)) {
                reject(new Error("Username already exists."));
                return;
            }
            const newUser: UserWithPassword = {
                id: `user-${Date.now()}`,
                username,
                password: password_input,
                avatarUrl: `https://picsum.photos/seed/${username}/100/100`,
            };
            allUsers.push(newUser);
            saveUsers();
            const sanitized = sanitizeUser(newUser);
            localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sanitized));
            resolve(sanitized);
        }, 500);
    });
};

export const logout = (): void => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        console.error("Failed to get current user from localStorage", e);
        return null;
    }
};
