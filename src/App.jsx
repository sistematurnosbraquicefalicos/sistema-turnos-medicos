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

  const horarios = {
    Lunes: { medico: 'Dr. García', horas: ['09:00', '10:00', '11:00'] },
    Martes: { medico: 'Dra. López', horas: ['09:00', '10:30', '11:30'] },
    Miércoles: { medico: 'Dr. Martínez', horas: ['14:00', '15:00', '16:00'] },
    Jueves: { medico: 'Dra. Silva', horas: ['09:00', '10:00', '11:00'] },
    Viernes: { medico: 'Dr. García', horas: ['10:00', '11:00', '14:00'] }
  };

  const buttonStyle = { padding: '8px 12px', margin: '5px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' };

  const guardarEnSheets = async (turno) => {
    try {
      setCargando(true);
      let turnosGuardados = JSON.parse(localStorage.getItem('turnos')) || [];
      turnosGuardados.push(turno);
      localStorage.setItem('turnos', JSON.stringify(turnosGuardados));
      console.log('✅ Turno guardado localmente');
      setCargando(false);
    } catch (error) {
      console.log('❌ Error', error);
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
    alert('✅ Turno creado!');
    setForm({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
    setDiaHora(null);
    setPlanilla({ alergias: '', medicamentos: '', antecedentes: '' });
    setPaso(1);
  };

  if (page === 'home') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🏥 Sistema de Turnos Médicos</h1>
        <button onClick={() => setPage('login')} style={{ ...buttonStyle, background: '#4CAF50', color: 'white', padding: '12px 24px', fontSize: '16px' }}>
          👨‍💼 Propietario
        </button>
        <button onClick={() => setPage('paciente')} style={{ ...buttonStyle, background: '#2196F3', color: 'white', padding: '12px 24px', fontSize: '16px' }}>
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
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          {passwordError && <p style={{ color: 'red' }}>❌ Incorrecta</p>}
          <button type="submit" style={{ ...buttonStyle, background: '#4CAF50', color: 'white', width: '100%' }}>
            Ingresar
          </button>
        </form>
        <button onClick={() => setPage('home')} style={{ ...buttonStyle, background: '#999', color: 'white', marginTop: '20px' }}>
          ← Atrás
        </button>
      </div>
    );
  }

  if (page === 'propietario') {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>🏥 Panel de Gestión</h1>
        <button onClick={() => setPage('home')} style={{ ...buttonStyle, background: '#f44336', color: 'white' }}>
          Salir
        </button>
        <h2>📋 Turnos: {turnos.length}</h2>
        {turnos.length === 0 ? <p>Sin turnos</p> : turnos.map((t) => (
          <div key={t.id} style={{ background: '#f0f0f0', padding: '12px', margin: '10px 0', borderRadius: '4px' }}>
            <p><strong>{t.nombre}</strong> - {t.dia} {t.hora}</p>
            <p>📧 {t.email} | 📱 {t.telefono} | 🐕 {t.raza}</p>
            <p>👨‍⚕️ {t.medico} | {t.estado}</p>
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>📋 Planilla</summary>
              <div style={{ background: 'white', padding: '10px', marginTop: '10px' }}>
                <p><strong>Alergias:</strong> {t.alergias || '-'}</p>