-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "admin1" VARCHAR(255) NOT NULL,
    "admin2" VARCHAR(255) NOT NULL,
    "admin3" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "elevation" DOUBLE PRECISION NOT NULL,
    "country" VARCHAR(255) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "defaultLocation" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserLocations" (
    "userId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Location_name_idx" ON "Location"("name");

-- CreateIndex
CREATE INDEX "UserLocations_userId_locationId_idx" ON "UserLocations"("userId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLocations_userId_locationId_key" ON "UserLocations"("userId", "locationId");
