-- CreateEnum
CREATE TYPE "tipo_motor" AS ENUM ('GASOLINA', 'DIESEL', 'ELECTRICO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "correo_elec" VARCHAR(100) NOT NULL,
    "contrasenya" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(255),
    "telefono" VARCHAR(20),
    "ciudad" VARCHAR(100),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "token" VARCHAR(64) NOT NULL,
    "id_usuario" UUID NOT NULL,
    "creada_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "matricula" VARCHAR(10) NOT NULL,
    "tipo_motor" "tipo_motor" NOT NULL,
    "consumo" DOUBLE PRECISION NOT NULL,
    "favorito" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_elec_key" ON "usuarios"("correo_elec");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_id_usuario_matricula_key" ON "vehiculos"("id_usuario", "matricula");

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
