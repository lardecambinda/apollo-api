import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.users.findUnique({ where: { email: 'admin@larfraterno.com' } })

  if (!existing) {
    const password = await bcrypt.hash('admin123', 10)
    await prisma.users.create({
      data: {
        email: 'admin@larfraterno.com',
        password,
        user_name: 'Admin',
        role: 'ADMIN',
      }
    })
    console.log('✅ Admin user created')
  } else {
    console.log('ℹ️  Admin user already exists')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
