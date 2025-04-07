import { auth } from "@clerk/nextjs";
import { db } from "@/lib/prisma"; // Make sure you import your db

export const checkUser = async () => {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }
  
  try {
    // First check if user exists
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    
    if (loggedInUser) {
      return loggedInUser;
    }
    
    // Get user details from Clerk
    // We can't directly use currentUser() here in server components
    // So we'll rely on the Clerk API client
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());
    
    // Create a new user
    const name = `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim();
    
    const newUser = await db.user.create({
      data: {
        clerkUserId: userId,
        name: name || 'New User',
        imageUrl: clerkUser.image_url,
        email: clerkUser.email_addresses?.[0]?.email_address || '',
        github: clerkUser.external_accounts?.find(a => a.provider === 'github')?.username || null,
      },
    });
    
    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error.message);
    return null;
  }
};