-- CreateTable
CREATE TABLE "estadojuego" (
    "id" SERIAL NOT NULL,
    "estado" VARCHAR(20),
    "descripcion" VARCHAR(255),

    CONSTRAINT "estadojuego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "juego" (
    "id" SERIAL NOT NULL,
    "id_estadojuego" INTEGER NOT NULL,
    "fecha_inicializacion" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "juego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "juego_grupo" (
    "id" SERIAL NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "id_grupo" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "juego_grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jugador" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jugador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jugador_grupo" (
    "id" SERIAL NOT NULL,
    "id_jugador" INTEGER NOT NULL,
    "id_grupo" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jugador_grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jugador_sancion" (
    "id" SERIAL NOT NULL,
    "fecha_sancion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_jugador" INTEGER NOT NULL,
    "id_sancion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jugador_sancion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oferta" (
    "id" SERIAL NOT NULL,
    "monto" INTEGER NOT NULL,
    "id_juego_grupo" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sancion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "detalle" VARCHAR(255),

    CONSTRAINT "sancion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jugador_email_key" ON "jugador"("email");

-- AddForeignKey
ALTER TABLE "juego_grupo" ADD CONSTRAINT "fk_grupo" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "juego_grupo" ADD CONSTRAINT "fk_juego" FOREIGN KEY ("id_juego") REFERENCES "juego"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jugador_grupo" ADD CONSTRAINT "fk_grupo" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jugador_grupo" ADD CONSTRAINT "fk_jugador" FOREIGN KEY ("id_jugador") REFERENCES "jugador"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jugador_sancion" ADD CONSTRAINT "fk_jugador" FOREIGN KEY ("id_jugador") REFERENCES "jugador"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jugador_sancion" ADD CONSTRAINT "fk_sancion" FOREIGN KEY ("id_sancion") REFERENCES "sancion"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "oferta" ADD CONSTRAINT "fk_juego_grupo" FOREIGN KEY ("id_juego_grupo") REFERENCES "juego_grupo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
