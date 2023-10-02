import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createSuperadmin() {
  if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) return;

  console.log('\n < Seeding database - SUPERADMIN >');
  const superadminEmail = process.env.SUPERADMIN_EMAIL;

  const user = await prisma.user.findUnique({
    where: { email: superadminEmail },
  });
  console.log(` Superadmin already exists with email ${superadminEmail}, exiting...`);
  if (user) return;

  const superadminPassword = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 12);
  await prisma.$transaction(
    async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: superadminEmail,
          password: superadminPassword,
          role: Role.super_admin,
        },
      });
      await tx.admin.create({
        data: { name: 'Superadmin', userId: createdUser.id },
      });
    },
    { isolationLevel: 'ReadUncommitted' },
  );

  console.log('Superadmin CREATED');
}

async function main() {
  await createSuperadmin();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
