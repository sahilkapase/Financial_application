"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = auth();
    if (!userId) return { budget: null, currentExpenses: 0 };

    // Find or create user if not found
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      // Instead of throwing error, create a new user
      console.log("User not found in getCurrentBudget, attempting to create");
      try {
        user = await db.user.create({
          data: {
            clerkUserId: userId,
            name: "New User", // Default name
            email: "user@example.com", // Default email
          },
        });
        console.log("Created new user:", user.id);
      } catch (createError) {
        console.error("Failed to create user:", createError);
        return { budget: null, currentExpenses: 0 };
      }
    }

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    // Get current month's expenses
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Add safety checks
    if (!accountId) {
      return {
        budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
        currentExpenses: 0,
      };
    }

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: expenses._sum?.amount
        ? expenses._sum.amount.toNumber()
        : 0,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    // Return empty data instead of throwing
    return { budget: null, currentExpenses: 0 };
  }
}

export async function updateBudget(amount) {
  try {
    const { userId } = auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Find or create user if not found
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      // Instead of throwing error, try to create a new user
      console.log("User not found in updateBudget, attempting to create");
      try {
        user = await db.user.create({
          data: {
            clerkUserId: userId,
            name: "New User", // Default name
            email: "user@example.com", // Default email
          },
        });
        console.log("Created new user:", user.id);
      } catch (createError) {
        console.error("Failed to create user:", createError);
        return { success: false, error: "Failed to create user" };
      }
    }

    // Convert amount to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Validate amount
    if (isNaN(numericAmount)) {
      return { success: false, error: "Invalid budget amount" };
    }

    // Update or create budget
    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: {
        amount: numericAmount,
      },
      create: {
        userId: user.id,
        amount: numericAmount,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}