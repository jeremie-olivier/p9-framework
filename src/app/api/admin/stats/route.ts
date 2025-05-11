export const runtime = 'nodejs'; 

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
  // Authenticate admin
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== "admin@example.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parallel counts
  const [totalUsers, recentSignups, completedCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    // Use completedAt rather than answers JSON
    prisma.user.count({
      where: {
        completedAt: { not: null },
      },
    }),
  ]);

  // Archetype distribution
  const rawDistribution = await prisma.user.groupBy({
    by: ["archetype"],
    _count: { archetype: true },
    orderBy: { _count: { archetype: "desc" } },
  });

  const archetypes = rawDistribution
    .filter((d) => d.archetype) // drop nulls
    .map((d) => ({
      name: d.archetype!,
      count: d._count.archetype,
    }));

  const completionRate = totalUsers
    ? +(completedCount / totalUsers * 100).toFixed(1)
    : 0;

  return NextResponse.json(
    {
      userStats: {
        totalUsers,
        recentSignups,
        completedCount,
        completionRate,
      },
      archetypes,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
