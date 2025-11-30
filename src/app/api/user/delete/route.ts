import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Delete user data from our database
        // The cascade delete in schema should handle related records if set up,
        // but we'll be explicit about what we're deleting if needed.
        // Assuming the User model is linked via the Clerk ID.

        // First check if user exists in our DB
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (dbUser) {
            await prisma.user.delete({
                where: { id: userId },
            });
        }

        // Note: We cannot delete the Clerk user from here without the Backend API Key
        // and proper permissions. The client-side flow should handle the Clerk sign-out
        // and potentially redirect to a page explaining the account is deleted.
        // For App Store compliance, deleting the app-specific data (Postgres) is the critical part.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[USER_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
