export interface JwtPayload {
  sub: string;       // userId
  firmId?: string;
  companyId?: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  totpCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    totpEnabled: boolean;
  };
}

export interface RefreshRequest {
  refreshToken: string;
}
