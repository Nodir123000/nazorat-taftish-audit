import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const newLogin = "xushnudhaydarov3@gmail.com"
  const targetUserId = 1

  const updatedUser = await prisma.users.update({
    where: { user_id: targetUserId },
    data: { username: newLogin }
  })
  
  console.log(`Successfully updated login for user ${updatedUser.fullname} to: ${updatedUser.username}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
