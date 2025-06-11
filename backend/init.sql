CREATE TABLE IF NOT EXISTS cerdas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha_inseminacion DATE NOT NULL,
  berraco VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS lechones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  cantidad_machos INT NOT NULL,
  cantidad_hembras INT NOT NULL,
  fecha_nacimiento DATE
);

CREATE TABLE IF NOT EXISTS engorde (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  fecha_compra DATE
);

CREATE TABLE IF NOT EXISTS cerdas_historial (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha_inseminacion DATE NOT NULL,
  berraco VARCHAR(100) NOT NULL,
  fecha_movido_historial TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lechones_historial (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  cantidad_machos INT NOT NULL,
  cantidad_hembras INT NOT NULL,
  fecha_nacimiento DATE,
  fecha_movido_historial TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS engorde_historial (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  fecha_compra DATE,
  fecha_movido_historial TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
