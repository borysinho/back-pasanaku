SELECT  pg_terminate_backend (pg_stat_activity.pid) FROM  pg_stat_activity WHERE  pg_stat_activity.datname = 'pasanaku';




DROP DATABASE IF EXISTS pasanaku;


CREATE DATABASE pasanaku WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';

--ALTER DATABASE pasanaku OWNER TO postgres;

CREATE TABLE Jugador (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(200) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE Grupo (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(200) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE Jugador_Grupo (
	id SERIAL PRIMARY KEY,
	id_jugador INT NOT NULL,
	id_grupo INT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	
	CONSTRAINT fk_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id) ON DELETE CASCADE,
	CONSTRAINT fk_grupo FOREIGN KEY (id_grupo) REFERENCES Grupo(id) ON DELETE CASCADE
);

CREATE TABLE Sancion (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(30) NOT NULL,
	detalle VARCHAR(255)
);

CREATE TABLE Jugador_Sancion (
	id SERIAL PRIMARY KEY,
	"fecha_sancion" TIMESTAMP NOT NULL DEFAULT now(),
	id_jugador INT NOT NULL,
	id_sancion INT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	
	CONSTRAINT fk_sancion FOREIGN KEY (id_sancion) REFERENCES Sancion(id) ON DELETE CASCADE,
	CONSTRAINT fk_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id) ON DELETE CASCADE
);

CREATE TABLE Juego (
	id SERIAL PRIMARY KEY,
	id_estadojuego INT NOT NULL,
  fecha_inicializacion TIMESTAMP NOT NULL,
	
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
	
CREATE TABLE Juego_Grupo (
	id SERIAL PRIMARY KEY,
	id_juego INT NOT NULL,
	id_grupo INT NOT NULL,
	created_at timestamp with time zone NOT NULL DEFAULT now(),
	updated_at timestamp with time zone NOT NULL DEFAULT now(),
	
	CONSTRAINT fk_juego FOREIGN KEY (id_juego) REFERENCES Juego(id) ON DELETE CASCADE,
	CONSTRAINT fk_grupo FOREIGN KEY (id_grupo) REFERENCES Grupo(id) ON DELETE CASCADE
);

CREATE TABLE Oferta (
	id SERIAL PRIMARY KEY,
	monto INT NOT NULL,
	id_juego_grupo INT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	
	CONSTRAINT fk_juego_grupo FOREIGN KEY (id_juego_grupo) REFERENCES Juego_Grupo(id) ON DELETE CASCADE
);

CREATE TABLE EstadoJuego (
	id SERIAL PRIMARY KEY,
	estado VARCHAR (20),
	descripcion VARCHAR (255)
);
	
