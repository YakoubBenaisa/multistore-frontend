export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshTokon?: string;
}

export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
  }