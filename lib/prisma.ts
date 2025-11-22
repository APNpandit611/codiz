// import { PrismaClient } from "@/app/generated/prisma/client";

// const prismaClientSingleton = () => new PrismaClient();

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;


// lib/prisma.ts
// import { PrismaClient } from "@/app/generated/prisma/client";

// const prismaClientSingleton = () => new PrismaClient();

// declare const globalThis: {
//   prismaGlobal: PrismaClient | undefined;
// } & typeof global;

// export const prisma =
//   globalThis.prismaGlobal ?? prismaClientSingleton();

// // Prevent creating multiple instances in development
// if (process.env.NODE_ENV !== "production") {
//   globalThis.prismaGlobal = prisma;
// }

import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Create a singleton to avoid exhausting connections in serverless environments
declare const globalThis: {
  prismaGlobal?: PrismaClient;
} & typeof global;

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    adapter,
    log: ["query", "error"], // optional logging
  });

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;