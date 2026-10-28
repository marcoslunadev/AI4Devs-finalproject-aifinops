/*
  Warnings:

  - You are about to drop the column `aiModel` on the `ExecutionLog` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `ExecutionLog` table. All the data in the column will be lost.
  - You are about to drop the `IngestionAuditLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `costUsd` to the `ExecutionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `ExecutionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `ExecutionLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FINOPS_VIEWER');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('DEV', 'PRE', 'PRO');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('SUCCESS', 'ERROR', 'TIMEOUT', 'RATE_LIMIT_EXCEEDED');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "ExecutionLog" DROP COLUMN "aiModel",
DROP COLUMN "cost",
ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "batchId" TEXT,
ADD COLUMN     "completionTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "costUsd" DECIMAL(12,6) NOT NULL,
ADD COLUMN     "environment" "Environment" NOT NULL DEFAULT 'PRO',
ADD COLUMN     "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "latencyMs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "promptTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "status" "ExecutionStatus" NOT NULL DEFAULT 'SUCCESS',
ADD COLUMN     "totalTokens" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'FINOPS_VIEWER';

-- DropTable
DROP TABLE "IngestionAuditLog";

-- CreateTable
CREATE TABLE "AiAgent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "departmentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelPrice" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptPricePer1k" DECIMAL(10,6) NOT NULL,
    "completionPricePer1k" DECIMAL(10,6) NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngestionBatch" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSizeBytes" INTEGER,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "processedRecords" INTEGER NOT NULL DEFAULT 0,
    "failedRecords" INTEGER NOT NULL DEFAULT 0,
    "errorSummary" TEXT,
    "status" "BatchStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IngestionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModelPrice_provider_model_effectiveFrom_key" ON "ModelPrice"("provider", "model", "effectiveFrom");

-- CreateIndex
CREATE INDEX "ExecutionLog_executedAt_idx" ON "ExecutionLog"("executedAt");

-- CreateIndex
CREATE INDEX "ExecutionLog_userId_idx" ON "ExecutionLog"("userId");

-- CreateIndex
CREATE INDEX "ExecutionLog_agentId_idx" ON "ExecutionLog"("agentId");

-- CreateIndex
CREATE INDEX "ExecutionLog_environment_idx" ON "ExecutionLog"("environment");

-- AddForeignKey
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionLog" ADD CONSTRAINT "ExecutionLog_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionLog" ADD CONSTRAINT "ExecutionLog_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "IngestionBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
