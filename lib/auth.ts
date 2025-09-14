import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// Create a global Prisma instance to avoid multiple connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Détecter l'environnement pour choisir le bon provider
const isDevelopment = process.env.NODE_ENV === "development";
const databaseProvider = isDevelopment ? "sqlite" : "postgresql";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: databaseProvider as "sqlite" | "postgresql", 
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
    },
  },
  callbacks: {
    session: {
      jwt: async ({ session, user }: { session: any; user: any }) => {
        // Inclure le rôle dans la session JWT
        if (user?.role) {
          session.user.role = user.role;
        }
        return session;
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-here-make-it-32-chars-minimum",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;
