// Authentication utilities for Inventory Link Nexus

// Secret key for JWT signing (in a real app, this would be in .env and not in the frontend)
// This is just for demonstration purposes
const JWT_SECRET = 'inventory-link-nexus-secret-key';

export type UserRole = 'client' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // Additional fields specific to role
  clientId?: string;
  staffRole?: 'warehouse_manager' | 'inventory_clerk' | 'admin';
}

/**
 * Generate a JWT token
 */
export const generateToken = (user: User): string => {
  // In a real implementation, we would use a proper JWT library
  // For this demo, we'll create a simple encoded token
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 30 * 60 * 1000, // 30 minutes expiry
  };
  
  // Basic encoding (NOT secure, just for demo)
  return btoa(JSON.stringify(payload));
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): User | null => {
  try {
    // Basic decoding (NOT secure, just for demo)
    const payload = JSON.parse(atob(token));
    
    // Check if token has expired
    if (payload.exp && payload.exp < Date.now()) {
      return null; // Token expired
    }
    
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name || '',
      role: payload.role,
      clientId: payload.clientId,
      staffRole: payload.staffRole
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

/**
 * Store authentication data in localStorage
 */
export const setAuthData = (token: string, user: User): void => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get current authentication data from localStorage
 */
export const getAuthData = (): { token: string | null, user: User | null } => {
  const token = localStorage.getItem('auth_token');
  const userJson = localStorage.getItem('user');
  
  let user: User | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch (error) {
      console.error('Failed to parse user data:', error);
    }
  }
  
  return { token, user };
};

/**
 * Remove authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

/**
 * Check if user has specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  return user !== null && user.role === role;
};
