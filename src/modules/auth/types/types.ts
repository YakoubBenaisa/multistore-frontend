

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  // Define additional response fields as needed.
  accessToken?: string;
  
}

export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
  }