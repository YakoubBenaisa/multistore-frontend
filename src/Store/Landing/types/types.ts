export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshTokon?: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}
export interface RegisterResponse {
  
}

