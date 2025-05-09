import { prisma } from "@repo/db";

export default async function deleteUser(userId: string) {
    const user = await prisma.user.delete({
        where:{ id: userId }
    })

    return user;
}