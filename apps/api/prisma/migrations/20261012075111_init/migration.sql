-- CreateTable
CREATE TABLE "rutas" (
    "id" UUID NOT NULL,
    "origen_lat" DOUBLE PRECISION NOT NULL,
    "origen_lon" DOUBLE PRECISION NOT NULL,
    "destino_lat" DOUBLE PRECISION NOT NULL,
    "destino_lon" DOUBLE PRECISION NOT NULL,
    "modo" TEXT NOT NULL,
    "distancia_m" DOUBLE PRECISION NOT NULL,
    "duracion_s" DOUBLE PRECISION NOT NULL,
    "geometria" JSONB NOT NULL,
    "creada_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rutas_pkey" PRIMARY KEY ("id")
);
