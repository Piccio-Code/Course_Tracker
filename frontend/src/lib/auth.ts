import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt } from "better-auth/plugins";

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  
  // JWT Plugin Configuration
  plugins: [
    jwt(),
  ],

  // Email and Password Authentication
  emailAndPassword: {
    enabled: true
  },

  // Session Configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (session will be updated if it's older than this)
  },

  // Base URL Configuration
  baseURL: process.env.BETTER_AUTH_URL,
  
  // Secret for encryption and hashing
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});

