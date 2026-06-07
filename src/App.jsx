import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
  const [diaHora, setDiaHora] = useState(null);
  const [planilla, setPlanilla] = useState({ alergias: '', medicamentos: '', antecedentes: '' });
  const [paso, setPaso] = useState(1);

  const CONTRASEÑA = 'braquicefalicos';
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby39Gd8O8hZS4RYhAv4QYJPBYUFQnmMrPIxWsVIZAW078wXIeMJuUZt3WGyXZ1PV6CMpg/exec';

  const horarios = {
    Lunes: { medico: 'Dr. García', horas: ['09:00', '10:00', '11:00'] },
    Martes: { medico: 'Dra. López', horas: ['09:00', '10:30', '11:30'] },
    Miércoles: { medico: 'Dr. Martínez', horas: ['14:00', '15:00', '16:00'] },
    Jueves: { medico: 'Dra. Silva', horas: ['09:00', '10:00', '11:00'] },
    Viernes: { medico: 'Dr. García', horas: ['10:00', '11:00', '14:00'] }
  };

  const guardarEnSheets = async (turno) => {
    try {
      setCargando(true);
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turno)
      });
      if (response.ok) {
        console.log('✅ Turno guardado en Google Sheets');
      }
      setCargando(false);
    } catch (error) {
      console.log('❌ Error al guardar en Sheets', error);
      setCargando(false);
    }
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
    alert('✅ Turno creado y guardado en Google Sheets!');
    setForm({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
    setDiaHora(null);
    setPlanilla({ alergias: '', medicamentos: '', antecedentes: '' });
    setPaso(1);
  };

  if (page === 'home') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🏥 Sistema de Turnos Médicos</h1>
        <button onClick={() => setPage('login')} style={{ padding: '12px 24px', margin: '10px', fontSize: '16px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          👨‍💼 Propietario
        </button>
        <button onClick={() => setPage('paciente')} style={{ padding: '12px 24px', margin: '10px', fontSize: '16px', cursor: 'pointer', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}>
          📅 Solicitar turno
        </button>
      </div>
    );
  }

  if (page === 'login') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🔐 Acceso Propietario</h1>
        <form onSubmit={handlePassword} style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px', maxWidth: '300px', margin: '0 auto' }}>
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: passwordError ? '2px solid red' : '1px solid #ddd', boxSizing: 'border-box' }} />
          {passwordError && <p style={{ color: 'red', fontSize: '14px' }}>❌ Contraseña incorrecta</p>}
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontSize: '16px' }}>
            Ingresar
          </button>
        </form>
        <button onClick={() => setPage('home')} style={{ padding: '10px 20px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>
          ← Atrás
        </button>
      </div>
    );
  }

  if (page === 'propietario') {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>🏥 Panel de Gestión</h1>
        <button onClick={() => setPage('home')} style={{ padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Salir
        </button>
        <h2>📋 Turnos: {turnos.length}</h2>
        {turnos.length === 0 ? (
          <p>No hay turnos aún</p>
        ) : (
          turnos.map((t) => (
            <div key={t.id} style={{ background: '#f0f0f0', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}>
              <p><strong>{t.nombre}</strong> - {t.dia} {t.hora}</p>
              <p>📧 {t.email} | 📱 {t.telefono}</p>
              <p>🐕 {t.raza} | ⚖️ {t.peso}kg | 📅 {t.edad} años</p>
              <p>👨‍⚕️ Médico: {t.medico} | 🔔 Estado: {t.estado}</p>
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>📋 Ver Planilla Médica</summary>
                <div style={{ background: 'white', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
                  <p><strong>Alergias:</strong> {t.alergias || '-'}</p>
                  <p><strong>Medicamentos:</strong> {t.medicamentos || '-'}</p>
                  <p><strong>Antecedentes:</strong> {t.antecedentes || '-'}</p>
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    );
  }

  if (page === 'paciente') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1>📅 Solicitar Turno</h1>
        <button onClick={() => setPage('home')} style={{ padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Salir
        </button>

        {paso === 1 && (
          <div>
            <h2>Datos personales</h2>
            <input type="text" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <input type="tel" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Raza" value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <input type="number" placeholder="Peso (kg)" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <input type="number" placeholder="Edad" value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />

            <h2>Selecciona día y hora</h2>
            {Object.keys(horarios).map((dia) => {
              const config = horarios[dia];
              return (
                <div key={dia} style={{ background: '#f9f9f9', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <p><strong>{dia}</strong> - {config.medico}</p>
                  {config.horas.map((hora) => {
                    const isSelected = diaHora && diaHora.dia === dia && diaHora.hora === hora;
                    return (
                      <button
                        key={hora}
                        type="button"
                        onClick={() => setDiaHora({ dia, hora })}
                        style={{ padding: '6px 12px', margin: '5px', background: isSelected ? '#2196F3' : '#ddd', color: isSelected ? 'white' : 'black',