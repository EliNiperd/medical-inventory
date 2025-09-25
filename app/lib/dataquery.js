import { prisma } from '@/app/lib/prisma';

export async function fetchFilteredMedicines() {
  const medicines = await prisma.medicine.findMany();
  return medicines;
}
