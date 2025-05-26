CREATE TABLE IF NOT EXISTS cerdas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha_inseminacion DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS cerdas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha_inseminacion DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS lechones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  fecha_nacimiento DATE
);

CREATE TABLE IF NOT EXISTS engorde (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  fecha_compra DATE
);
