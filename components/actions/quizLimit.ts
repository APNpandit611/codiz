"use server";
import { prisma } from "@/lib/prisma";

export async function getDailyLimit(userId: string | undefined) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) return { count: 0 };

    const today = new Date().toDateString();
    if (!user?.lastResetDate || user?.lastResetDate.toDateString() !== today) {
        await prisma.user.update({
            where: { id: userId },
            data: { lastResetDate: new Date(), clickCount: 0 },
        });

        return { count: 0 };
    }

    return { count: user.clickCount ?? 0 };
}

export async function incrementDailyLimit(userId: string | undefined) {
    if (!userId) return;

    await prisma.user.update({
        where: { id: userId },
        data: { clickCount: { increment: 1 } },
    });
}
