import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "Acme Corp",
    },
  });

  // 2. Create Department
  const dept = await prisma.department.create({
    data: {
      name: "Engineering",
      organizationId: org.id,
    },
  });

  // 3. Create Users
  const user1 = await prisma.user.create({
    data: {
      email: "alice@acme.com",
      name: "Alice",
      organizationId: org.id,
      departmentId: dept.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "bob@acme.com",
      name: "Bob",
      organizationId: org.id,
      departmentId: dept.id,
    },
  });

  // 4. Create IngestionAuditLog
  await prisma.ingestionAuditLog.create({
    data: {
      fileId: "test-file-001",
      status: "COMPLETED",
      successCount: 100,
      errorCount: 0,
    },
  });

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
