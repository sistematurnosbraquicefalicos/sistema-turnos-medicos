import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [turnos, setTurnos] = useState(() => JSON.parse(localStorage.getItem('turnos')) || []);
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
  const [diaHora, setDiaHora] = useState(null);
  const [planilla, setPlanilla] = useState({ alergias: '', medicamentos: '', antecedentes: '' });
  const [paso, setPaso] = useState(1);

  const CONTRASEÑA = 'braquicefalicos';
  const SHEETDB_URL = 'https://sheetdb.io/api/v1/ey5n5cdouz9mc';

  const horarios = {
    Lunes: { medico: 'Dr. García', horas: ['09:00', '10:00', '11:00'] },
    Martes: { medico: 'Dra. López', horas: ['09:00', '10:30', '11:30'] },
    Miercoles: { medico: 'Dr. Martínez', horas: ['14:00', '15:00', '16:00'] },
    Jueves: { medico: 'Dra. Silva', horas: ['09:00', '10:00', '11:00'] },
    Viernes: { medico: 'Dr. García', horas: ['10:00', '11:00', '14:00'] }
  };

  const guardarEnSheets = async (turno) => {
    setCargando(true);
    try {
      const response = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: turno })
      });
      
      if (response.ok) {
        console.log('Turno guardado en Google Sheets');
      }
    } catch (error) {
      console.log('Error con SheetDB:', error);
    }
    
    let turnosGuardados = JSON.parse(localStorage.getItem('turnos')) || [];
    turnosGuardados.push(turno);
    localStorage.setItem('turnos', JSON.stringify(turnosGuardados));
    setCargando(false);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (password === CONTRASEÑA) {
      setPage('propietario');
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  const crearTurno = async () => {
    if (!form.nombre || !form.email || !diaHora) {
      alert('Completa todos los datos');
      return;
    }

    const nuevoTurno = {
      id: Date.now(),
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono,
      raza: form.raza,
      peso: form.peso,
      edad: form.edad,
      dia: diaHora.dia,
      hora: diaHora.hora,
      medico: horarios[diaHora.dia].medico,
      estado: 'Pendiente',
      alergias: planilla.alergias,
      medicamentos: planilla.medicamentos,
      antecedentes: planilla.antecedentes,
      fechaCreacion: new Date().toLocaleDateString()
    };

    await guardarEnSheets(nuevoTurno);
    setTurnos([...turnos, nuevoTurno]);
    alert('Turno creado!');
    setForm({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
    setDiaHora(null);
    setPlanilla({ alergias: '', medicamentos: '', antecedentes: '' });
    setPaso(1);
  };

  const btnStyle = { border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const inputStyle = { width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' };

  if (page === 'home') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Sistema de Turnos Medicos</h1>
        <button onClick={() => setPage('login')} style={{ ...btnStyle, padding: '12px 24px', margin: '10px', fontSize: '16px', background: '#4CAF50', color: 'white' }}>Propietario</button>
        <button onClick={() => setPage('paciente')} style={{ ...btnStyle, padding: '12px 24px', margin: '10px', fontSize: '16px', background: '#2196F3', color: 'white' }}>Solicitar turno</button>
      </div>
    );
  }

  if (page === 'login') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Acceso Propietario</h1>
        <form onSubmit={handlePassword} style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px', maxWidth: '300px', margin: '0 auto' }}>
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          {passwordError && <p style={{ color: 'red' }}>Incorrecta</p>}
          <button type="submit" style={{ ...btnStyle, width: '100%', padding: '10px', background: '#4CAF50', color: 'white', marginTop: '10px' }}>Ingresar</button>
        </form>
        <button onClick={() => setPage('home')} style={{ ...btnStyle, padding: '10px 20px', background: '#999', color: 'white', marginTop: '20px' }}>Atras</button>
      </div>
    );
  }

  if (page === 'propietario') {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Panel de Gestion</h1>
        <button onClick={() => setPage('home')} style={{ ...btnStyle, padding: '8px 12px', background: '#f44336', color: 'white' }}>Salir</button>
        <h2>Turnos: {turnos.length}</h2>
        {turnos.map((t) => (
          <div key={t.id} style={{ background: '#f0f0f0', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}>
            <p><strong>{t.nombre}</strong> - {t.dia} {t.hora}</p>
            <p>Email: {t.email} Telefono: {t.telefono}</p>
            <p>Raza: {t.raza} Peso: {t.peso}kg Edad: {t.edad}</p>
            <p>Medico: {t.medico} Estado: {t.estado}</p>
            <p>Alergias: {t.alergias}</p>
            <p>Medicamentos: {t.medicamentos}</p>
            <p>Antecedentes: {t.antecedentes}</p>
          </div>
        ))}
      </div>
    );
  }

  if (page === 'paciente') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Solicitar Turno</h1>
        <button onClick={() => setPage('home')} style={{ ...btnStyle, padding: '8px 12px', background: '#f44336', color: 'white' }}>Salir</button>

        {paso === 1 && (
          <div>
            <h2>Datos personales</h2>
            <input type="text" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={inputStyle} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input type="tel" placeholder="Telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Raza" value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })} style={inputStyle} />
            <input type="number" placeholder="Peso kg" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} style={inputStyle} />
            <input type="number" placeholder="Edad" value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })} style={inputStyle} />

            <h2>Selecciona dia y hora</h2>
            {Object.keys(horarios).map((dia) => {
              const btnHoraSelected = { ...btnStyle, padding: '6px 12px', margin: '5px', background: '#2196F3', color: 'white' };
              const btnHoraDefault = { ...btnStyle, padding: '6px 12px', margin: '5px', background: '#ddd', color: 'black' };
              return (
                <div key={dia} style={{ background: '#f9f9f9', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <p><strong>{dia}</strong> - {horarios[dia].medico}</p>
                  {horarios[dia].horas.map((hora) => {
                    const isSelected = diaHora && diaHora.dia === dia && diaHora.hora === hora;
                    return (
                      <button key={hora} type="button" onClick={() => setDiaHora({ dia, hora })} style={isSelected ? btnHoraSelected : btnHoraDefault}>{hora}</button>
                    );
                  })}
                </div>
              );
            })}

            <button type="button" onClick={() => setPaso(2)} style={{ ...btnStyle, width: '100%', padding: '12px', background: '#4CAF50', color: 'white', marginTop: '10px' }}>Siguiente</button>
          </div>
        )}

        {paso === 2 && (
          <div>
            <h2>Planilla medica</h2>
            <textarea placeholder="Alergias" value={planilla.alergias} onChange={(e) => setPlanilla({ ...planilla, alergias: e.target.value })} style={inputStyle} rows="3"></textarea>
            <textarea placeholder="Medicamentos" value={planilla.medicamentos} onChange={(e) => setPlanilla({ ...planilla, medicamentos: e.target.value })} style={inputStyle} rows="3"></textarea>
            <textarea placeholder="Antecedentes" value={planilla.antecedentes} onChange={(e) => setPlanilla({ ...planilla, antecedentes: e.target.value })} style={inputStyle} rows="3"></textarea>

            <button type="button" onClick={() => setPaso(1)} style={{ ...btnStyle, padding: '12px 24px', background: '#999', color: 'white', marginRight: '10px' }}>Atras</button>
            <button type="button" onClick={crearTurno} disabled={cargando} style={{ ...btnStyle, padding: '12px 24px', background: cargando ? '#999' : '#4CAF50', color: 'white' }}>{cargando ? 'Guardando...' : 'Confirmar'}</button>
          </div>
        )}
      </div>
    );
  }
}