const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg');

const app = express();
app.use(cors()); 
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'midb',
  password: '1234',
  port: 5432,
});

const GESTACION_DIAS = 114;
const DESTETE_DIAS = 30;
const SALIDA_DIAS_LECHONES = 60;
const SALIDA_DIAS_ENGORDE = 90;

// Crear cerda
app.post('/cerdas', async (req, res) => {
  const { nombre, fecha_inseminacion } = req.body;
  if (!nombre || !fecha_inseminacion) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO cerdas (nombre, fecha_inseminacion) VALUES ($1, $2) RETURNING *',
      [nombre, fecha_inseminacion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leer todas las cerdas con progreso calculado
app.get('/cerdas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cerdas');
    const hoy = new Date();

    const cerdasConProgreso = result.rows.map(cerda => {
      const fechaInsem = new Date(cerda.fecha_inseminacion);
      const fechaParto = new Date(fechaInsem);
      fechaParto.setDate(fechaParto.getDate() + GESTACION_DIAS);

      let progreso = ((hoy - fechaInsem) / (fechaParto - fechaInsem)) * 100;
      progreso = Math.min(Math.max(progreso, 0), 100);

      return {
        ...cerda,
        fecha_inseminacion: cerda.fecha_inseminacion.toISOString().split('T')[0],
        fecha_parto: fechaParto.toISOString().split('T')[0],
        progreso: progreso.toFixed(2),
      };
    });

    res.json(cerdasConProgreso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cerda por id
app.put('/cerdas/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_inseminacion } = req.body;

  if (!nombre && !fecha_inseminacion) {
    return res.status(400).json({ error: 'Debes enviar al menos un campo para actualizar' });
  }

  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (nombre) {
      fields.push(`nombre = $${idx++}`);
      values.push(nombre);
    }
    if (fecha_inseminacion) {
      fields.push(`fecha_inseminacion = $${idx++}`);
      values.push(fecha_inseminacion);
    }

    values.push(id);

    const query = `UPDATE cerdas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cerda no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar cerda por id
app.delete('/cerdas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM cerdas WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cerda no encontrada' });
    }

    res.json({ message: 'Cerda eliminada correctamente', cerda: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});


/////////////////

// Lechones
// Crear lechón
app.post('/lechones', async (req, res) => {
  const { nombre, fecha_nacimiento } = req.body;
  if (!nombre || !fecha_nacimiento) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO lechones (nombre, fecha_nacimiento) VALUES ($1, $2) RETURNING *',
      [nombre, fecha_nacimiento]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leer todos los lechones
app.get('/lechones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lechones');
    const hoy = new Date();

    const lechonesConProgreso = result.rows.map(lechon => {
      const fechaNac = new Date(lechon.fecha_nacimiento);
      const fechaDestete = new Date(lechon.fecha_nacimiento);
      const fechaSalida = new Date(lechon.fecha_nacimiento);

      fechaSalida.setDate(fechaSalida.getDate() + SALIDA_DIAS_LECHONES);
      fechaDestete.setDate(fechaDestete.getDate() + DESTETE_DIAS);

      let progresoSalida = ((hoy - fechaNac) / (fechaSalida - fechaNac)) * 100;
      progresoSalida = Math.min(Math.max(progresoSalida, 0), 100);

      let progresoDestete = ((hoy - fechaNac) / (fechaDestete - fechaNac)) * 100;
      progresoDestete = Math.min(Math.max(progresoDestete, 0), 100);
      
      return {
        ...lechon,
        fecha_nacimiento: lechon.fecha_nacimiento.toISOString().split('T')[0],
        fecha_salida: fechaSalida.toISOString().split('T')[0],
        fecha_destete: fechaDestete.toISOString().split('T')[0],
        progreso_salida: progresoSalida.toFixed(2),
        progreso_destete: progresoDestete.toFixed(2),
      };
    });

    
    res.json(lechonesConProgreso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar lechón por id
app.put('/lechones/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_nacimiento } = req.body;

  try {
    const result = await pool.query(
      'UPDATE lechones SET nombre = $1, fecha_nacimiento = $2 WHERE id = $3 RETURNING *',
      [nombre, fecha_nacimiento, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Lechón no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar lechón por id
app.delete('/lechones/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM lechones WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Lechón no encontrado' });
    }
    res.json({ message: 'Lechón eliminado correctamente', lechon: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

///////////

// Engorde 

// Crear animal de engorde
app.post('/engorde', async (req, res) => {
  const { nombre, fecha_compra } = req.body;
  if (!nombre || !fecha_compra) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO engorde (nombre, fecha_compra) VALUES ($1, $2) RETURNING *',
      [nombre, fecha_compra]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leer todos los animales de engorde
app.get('/engorde', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM engorde');
    const hoy = new Date();
    const engordeConProgreso = result.rows.map(engorde => {
      const fechaCompra = new Date(engorde.fecha_compra);
      const fechaSalida = new Date(fechaCompra);
      
      fechaSalida.setDate(fechaSalida.getDate() + SALIDA_DIAS_ENGORDE);

      let progreso = ((hoy - fechaCompra) / (fechaSalida - fechaCompra)) * 100;
      progreso = Math.min(Math.max(progreso, 0), 100);

      return {
        ...engorde,
        fecha_compra: engorde.fecha_compra.toISOString().split('T')[0],
        fecha_salida: fechaSalida.toISOString().split('T')[0],
        progreso: progreso.toFixed(2),
      };
    });
    res.json(engordeConProgreso);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar animal de engorde por id
app.put('/engorde/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_compra } = req.body;

  try {
    const result = await pool.query(
      'UPDATE engorde SET nombre = $1, fecha_compra = $2 WHERE id = $3 RETURNING *',
      [nombre, fecha_compra, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Animal de engorde no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar animal de engorde por id
app.delete('/engorde/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM engorde WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Animal de engorde no encontrado' });
    }
    res.json({ message: 'Animal de engorde eliminado correctamente', engorde: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////////////