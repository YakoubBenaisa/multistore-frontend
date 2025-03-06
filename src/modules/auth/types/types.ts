interface data {
  accessToken: string;
  refreshToken: string
}

// ------------------ Auth ---------------------
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
  success: boolean,
  data: data
}
export interface setUserResponse{
  userID: string,
  username: string,
  email: string,
  storeId: string | null
}

