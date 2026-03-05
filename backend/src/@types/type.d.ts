export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  pagination?: unknown;
}

declare global {
    namespace Express {
        interface Request {
            decoded: DecodedPayload;
            user: User;
        }
    }
}