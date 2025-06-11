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
const DESTETE_DIAS = 25;
const SALIDA_DIAS_LECHONES = 60;
const SALIDA_DIAS_ENGORDE = 90;
const HIERRO_DIAS = 3;
const PRIMERA_DOSIS_RESPISURE_DIAS = 7;
const SEGUNDA_DOSIS_RESPISURE_DIAS = 21;
const CASTRACION_DIAS = 15;
const VITAMINA_DESPARACITACION_DIAS = 35;
const COLERA_DIAS = 40;
const VACUNA_ENGORDE_DIAS = 45;


// Crear cerda
app.post('/cerdas', async (req, res) => {
  const { nombre, fecha_inseminacion, berraco } = req.body;
  if (!nombre || !fecha_inseminacion || !berraco) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO cerdas (nombre, fecha_inseminacion, berraco) VALUES ($1, $2, $3) RETURNING *',
      [nombre, fecha_inseminacion, berraco]
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

      const diasTranscurridos = Math.floor((hoy - fechaInsem) / (1000 * 60 * 60 * 24));

      return {
        ...cerda,
        fecha_inseminacion: cerda.fecha_inseminacion.toISOString().split('T')[0],
        fecha_parto: fechaParto.toISOString().split('T')[0],
        progreso: progreso.toFixed(2),
        dias_transcurridos: diasTranscurridos,
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
  const { nombre, fecha_inseminacion, berraco } = req.body;

  if (!nombre && !fecha_inseminacion && !berraco) {
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
    if (berraco) {
      fields.push(`berraco = $${idx++}`);
      values.push(berraco);
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
  const { nombre, cantidad_machos, cantidad_hembras,fecha_nacimiento } = req.body;
  if (!nombre || !fecha_nacimiento || !cantidad_machos || !cantidad_hembras) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const result = await pool.query(
  'INSERT INTO lechones (nombre, cantidad_machos, cantidad_hembras, fecha_nacimiento) VALUES ($1, $2, $3, $4)',
  [nombre, cantidad_machos, cantidad_hembras, fecha_nacimiento] // <- corregido
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

    const lechonesConProgreso = result.rows.map(lechon => {
      const fechaNac = new Date(lechon.fecha_nacimiento);
      const fechaHierro = new Date(lechon.fecha_nacimiento);
      const fechaRespisurePrimeraDosis = new Date(lechon.fecha_nacimiento);
      const fechaCastracion = new Date(lechon.fecha_nacimiento);
      const fechaRespisureSegundaDosis = new Date(lechon.fecha_nacimiento);
      const fechaDestete = new Date(lechon.fecha_nacimiento);
      const fechaDesparacitacion = new Date(lechon.fecha_nacimiento);
      const fechaColera = new Date(lechon.fecha_nacimiento);
      const fechaSalida = new Date(lechon.fecha_nacimiento);
      

      fechaDestete.setDate(fechaDestete.getDate() + DESTETE_DIAS);
      fechaHierro.setDate(fechaHierro.getDate() + HIERRO_DIAS);
      fechaRespisurePrimeraDosis.setDate(fechaRespisurePrimeraDosis.getDate() + PRIMERA_DOSIS_RESPISURE_DIAS);
      fechaCastracion.setDate(fechaCastracion.getDate() + CASTRACION_DIAS);
      fechaRespisureSegundaDosis.setDate(fechaRespisureSegundaDosis.getDate() + SEGUNDA_DOSIS_RESPISURE_DIAS);
      fechaDesparacitacion.setDate(fechaDesparacitacion.getDate() + VITAMINA_DESPARACITACION_DIAS);
      fechaColera.setDate(fechaColera.getDate() + COLERA_DIAS);
      fechaSalida.setDate(fechaSalida.getDate() + SALIDA_DIAS_LECHONES);
      
      return {
        ...lechon,
        fecha_nacimiento: fechaNac.toISOString().split('T')[0],
        fecha_hierro: fechaHierro.toISOString().split('T')[0],
        fecha_primera_dosis_respisure: fechaRespisurePrimeraDosis.toISOString().split('T')[0],
        fecha_castracion: fechaCastracion.toISOString().split('T')[0],
        fecha_segunda_dosis_respisure: fechaRespisureSegundaDosis.toISOString().split('T')[0],
        fecha_destete: fechaDestete.toISOString().split('T')[0],
        fecha_desparacito: fechaDesparacitacion.toISOString().split('T')[0],
        fecha_colera: fechaColera.toISOString().split('T')[0],
        fecha_salida: fechaSalida.toISOString().split('T')[0],
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
      const fechaVitamina = new Date(fechaCompra);
      const fechaSalida = new Date(fechaCompra);
      
      fechaVitamina.setDate(fechaVitamina.getDate() + VACUNA_ENGORDE_DIAS);
      fechaSalida.setDate(fechaSalida.getDate() + SALIDA_DIAS_ENGORDE);

      let progreso = ((hoy - fechaCompra) / (fechaSalida - fechaCompra)) * 100;
      progreso = Math.min(Math.max(progreso, 0), 100);

      return {
        ...engorde,
        fecha_compra: engorde.fecha_compra.toISOString().split('T')[0],
        fecha_vitamina: fechaVitamina.toISOString().split('T')[0],
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
///////////////////////              HIstorial

//Mover al historial de cerdas
app.post('/cerdas/mover-historial/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM cerdas WHERE id = $1', [id]);
    const cerda = rows[0];

    if (!cerda) {
      return res.status(404).json({ message: 'Cerda no encontrada' });
    }

    await pool.query(
      `INSERT INTO cerdas_historial (nombre, fecha_inseminacion, berraco)
       VALUES ($1, $2, $3)`,
      [cerda.nombre, cerda.fecha_inseminacion, cerda.berraco]
    );

    await pool.query('DELETE FROM cerdas WHERE id = $1', [id]);

    res.json({ message: 'Cerda movida al historial' });
  } catch (err) {
    console.error('Error al mover cerda al historial:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Leer historial de cerdas
app.get('/cerdas/historial', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cerdas_historial');
    const cerdasConProgreso = result.rows.map(cerda => {
      const fechaInsem = new Date(cerda.fecha_inseminacion);
      const fechaParto = new Date(fechaInsem);
      fechaParto.setDate(fechaParto.getDate() + GESTACION_DIAS);

      return {
        ...cerda,
        fecha_inseminacion: cerda.fecha_inseminacion.toISOString().split('T')[0],
        fecha_parto: fechaParto.toISOString().split('T')[0],
      };
    });

    res.json(cerdasConProgreso);
  } catch (err) {
    console.error('Error al obtener historial de cerdas:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Mover al historial de engorde
app.post('/engorde/mover-historial/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM engorde WHERE id = $1', [id]);
    const engorde = rows[0];

    if (!engorde) {
      return res.status(404).json({ message: 'Animal de engorde no encontrado' });
    }

    await pool.query(
      `INSERT INTO engorde_historial (nombre, fecha_compra)
       VALUES ($1, $2)`,
      [engorde.nombre, engorde.fecha_compra]
    );

    await pool.query('DELETE FROM engorde WHERE id = $1', [id]);

    res.json({ message: 'Engorde movido al historial' });
  } catch (err) {
    console.error('Error al mover engorde al historial:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Leer historial de engorde
app.get('/engorde/historial', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM engorde_historial');
    const engordes = result.rows.map(engorde => {
      const fechaCompra = new Date(engorde.fecha_compra);
      const fechaVitamina = new Date(fechaCompra); fechaVitamina.setDate(fechaVitamina.getDate() + VACUNA_ENGORDE_DIAS);
      const fechaSalida = new Date(fechaCompra); fechaSalida.setDate(fechaSalida.getDate() + SALIDA_DIAS_ENGORDE);

      return {
        ...engorde,
        fecha_compra: engorde.fecha_compra.toISOString().split('T')[0],
        fecha_vitamina: fechaVitamina.toISOString().split('T')[0],
        fecha_salida: fechaSalida.toISOString().split('T')[0],
      };
    });

    res.json(engordes);
  } catch (err) {
    console.error('Error al obtener historial de engorde:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

//
// Mover al historial de lechones
app.post('/lechones/mover-historial/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM lechones WHERE id = $1', [id]);
    const lechon = rows[0];

    if (!lechon) {
      return res.status(404).json({ message: 'Lechón no encontrado' });
    }

    await pool.query(
      `INSERT INTO lechones_historial (nombre, cantidad_machos, cantidad_hembras, fecha_nacimiento)
       VALUES ($1, $2, $3, $4)`,
      [lechon.nombre, lechon.cantidad_machos, lechon.cantidad_hembras, lechon.fecha_nacimiento]
    );

    await pool.query('DELETE FROM lechones WHERE id = $1', [id]);

    res.json({ message: 'Lechón movido al historial' });
  } catch (err) {
    console.error('Error al mover lechón al historial:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Leer historial de lechones
app.get('/lechones/historial', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lechones_historial');
    const lechones = result.rows.map(lechon => {
      const fechaNac = new Date(lechon.fecha_nacimiento);
      const fechaHierro = new Date(fechaNac); fechaHierro.setDate(fechaHierro.getDate() + HIERRO_DIAS);
      const fechaRespisurePrimeraDosis = new Date(fechaNac); fechaRespisurePrimeraDosis.setDate(fechaRespisurePrimeraDosis.getDate() + PRIMERA_DOSIS_RESPISURE_DIAS);
      const fechaCastracion = new Date(fechaNac); fechaCastracion.setDate(fechaCastracion.getDate() + CASTRACION_DIAS);
      const fechaRespisureSegundaDosis = new Date(fechaNac); fechaRespisureSegundaDosis.setDate(fechaRespisureSegundaDosis.getDate() + SEGUNDA_DOSIS_RESPISURE_DIAS);
      const fechaDestete = new Date(fechaNac); fechaDestete.setDate(fechaDestete.getDate() + DESTETE_DIAS);
      const fechaDesparacitacion = new Date(fechaNac); fechaDesparacitacion.setDate(fechaDesparacitacion.getDate() + VITAMINA_DESPARACITACION_DIAS);
      const fechaColera = new Date(fechaNac); fechaColera.setDate(fechaColera.getDate() + COLERA_DIAS);
      const fechaSalida = new Date(fechaNac); fechaSalida.setDate(fechaSalida.getDate() + SALIDA_DIAS_LECHONES);

      return {
        ...lechon,
        fecha_nacimiento: lechon.fecha_nacimiento.toISOString().split('T')[0],
        fecha_hierro: fechaHierro.toISOString().split('T')[0],
        fecha_primera_dosis_respisure: fechaRespisurePrimeraDosis.toISOString().split('T')[0],
        fecha_castracion: fechaCastracion.toISOString().split('T')[0],
        fecha_segunda_dosis_respisure: fechaRespisureSegundaDosis.toISOString().split('T')[0],
        fecha_destete: fechaDestete.toISOString().split('T')[0],
        fecha_desparacito: fechaDesparacitacion.toISOString().split('T')[0],
        fecha_colera: fechaColera.toISOString().split('T')[0],
        fecha_salida: fechaSalida.toISOString().split('T')[0],
      };
    });

    res.json(lechones);
  } catch (err) {
    console.error('Error al obtener historial de lechones:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

