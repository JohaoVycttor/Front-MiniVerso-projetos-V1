// O painel tem servidor e autenticação próprios em miniverso-admin-main.
export const adminLoginUrl = process.env.NEXT_PUBLIC_ADMIN_LOGIN_URL || (process.env.NODE_ENV === "production" ? "/admin" : "http://localhost:3001/admin/login");
