import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsofHashing = 10;

async function main() {
  //update password user admin
  const passwordAdmin = await bcrypt.hash('Niperd2012', roundsofHashing);
  await prisma.users.update({
    where: {
      id_user: '$1$BuoWcN0Y$oclKGWYmVduy4I6hTrZh20',
    },
    data: {
      password: passwordAdmin,
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
