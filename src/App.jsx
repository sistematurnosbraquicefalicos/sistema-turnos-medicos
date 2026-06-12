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
  const SHEETDB_URL = 'https://sheetdb.io/api/v1/ey5n5cdouz9mc';
  const LOGO_URL = 'https://www.fvet.uba.ar/sites/default/files/pictures/membrete-2022.jpg';
  const FONDO_VIOLETA = '#E9D5FF';

  const horarios = {
    Lunes: { medico: 'Dr. García', horas: ['09:00', '10:00', '11:00'] },
    Martes: { medico: 'Dra. López', horas: ['09:00', '10:30', '11:30'] },
    Miercoles: { medico: 'Dr. Martínez', horas: ['14:00', '15:00', '16:00'] },
    Jueves: { medico: 'Dra. Silva', horas: ['09:00', '10:00', '11:00'] },
    Viernes: { medico: 'Dr. García', horas: ['10:00', '11:00', '14:00'] }
  };

  const Header = () => (
    <div style={{ background: '#f5f5f5', padding: '1rem', borderBottom: '2px solid #333', textAlign: 'center' }}>
      <img src={LOGO_URL} alt="UBA Veterinaria" style={{ height: '60px', marginBottom: '0.5rem' }} />
      <h2 style={{ margin: '0.5rem 0', color: '#333', fontSize: '18px' }}>Hospital Escuela</h2>
      <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '14px' }}>Facultad de Ciencias Veterinarias - UBA</p>
      <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>Servicio de Anestesiología</p>
    </div>
  );

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
    
    setCargando(false);
  };

  const actualizarEstadoEnSheets = async (turnoId, nuevoEstado) => {
    try {
      const turnoAActualizar = turnos.find(t => t.id === turnoId);
      if (!turnoAActualizar) return;

      const searchResponse = await fetch(`${SHEETDB_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          search: {
            nombre: turnoAActualizar.nombre,
            dia: turnoAActualizar.dia,
            hora: turnoAActualizar.hora
          }
        })
      });

      if (searchResponse.ok) {
        const data = await searchResponse.json();
        if (data.data && data.data.length > 0) {
          const id = data.data[0].id;
          
          const updateResponse = await fetch(`${SHEETDB_URL}/id/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: { estado: nuevoEstado }
            })
          });

          if (updateResponse.ok) {
            console.log('Estado actualizado en Google Sheets');
            const turnosActualizados = turnos.map(t => 
              t.id === turnoId ? { ...t, estado: nuevoEstado } : t
            );
            setTurnos(turnosActualizados);
          }
        }
      }
    } catch (error) {
      console.log('Error actualizando estado:', error);
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
    alert('Turno creado!');
    setForm({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
    setDiaHora(null);
    setPlanilla({ alergias: '', medicamentos: '', antecedentes: '' });
    setPaso(1);
  };

  const btnStyle = { border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' };
  const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '18px' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '18px' };

  const getEstadoColor = (estado) => {
    if (estado === 'Confirmado') return '#4CAF50';
    if (estado === 'Rechazado') return '#f44336';
    return '#FF9800';
  };

  if (page === 'home') {
    return (
      <div style={{ background: FONDO_VIOLETA, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px' }}>Sistema de Turnos Médicos</h1>
          <button onClick={() => setPage('login')} style={{ ...btnStyle, padding: '14px 28px', margin: '10px', fontSize: '18px', background: '#4CAF50', color: 'white' }}>Propietario</button>
          <button onClick={() => setPage('paciente')} style={{ ...btnStyle, padding: '14px 28px', margin: '10px', fontSize: '18px', background: '#2196F3', color: 'white' }}>Solicitar turno</button>
        </div>
      </div>
    );
  }

  if (page === 'login') {
    return (
      <div style={{ background: FONDO_VIOLETA, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px' }}>Acceso Propietario</h1>
          <form onSubmit={handlePassword} style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px', maxWidth: '300px', margin: '0 auto' }}>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" placeholder="Ingresa la contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            {passwordError && <p style={{ color: 'red', fontSize: '16px' }}>Incorrecta</p>}
            <button type="submit" style={{ ...btnStyle, width: '100%', padding: '12px', background: '#4CAF50', color: 'white', marginTop: '10px', fontSize: '18px' }}>Ingresar</button>
          </form>
          <button onClick={() => setPage('home')} style={{ ...btnStyle, padding: '10px 20px', background: '#999', color: 'white', marginTop: '20px', fontSize: '16px' }}>Atrás</button>
        </div>
      </div>
    );
  }

  if (page === 'propietario') {
    return (
      <div style={{ background: FONDO_VIOLETA, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '28px' }}>Panel de Gestión</h1>
            <button onClick={() => setPage('home')} style={{ ...btnStyle, padding: '8px 12px', background: '#f44336', color: 'white', fontSize: '16px' }}>Salir</button>
          </div>
          
          <h2 style={{ fontSize: '22px' }}>Total de Turnos: {turnos.length}</h2>
          
          {turnos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem', fontSize: '18px' }}>No hay turnos agendados.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {turnos.map((t) => (
                <div key={t.id} style={{ 
                  background: '#fff', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  border: `3px solid ${getEstadoColor(t.estado)}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '20px' }}>{t.nombre}</h3>
                      <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '16px' }}><strong>Día:</strong> {t.dia} - <strong>Hora:</strong> {t.hora}</p>
                      <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '16px' }}><strong>Médico:</strong> {t.medico}</p>
                    </div>
                    <div style={{ 
                      background: getEstadoColor(t.estado), 
                      color: 'white', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {t.estado}
                    </div>
                  </div>

                  <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    <p style={{ margin: '0.3rem 0', fontSize: '16px' }}><strong>Email:</strong> {t.email}</p>
                    <p style={{ margin: '0.3rem 0', fontSize: '16px' }}><strong>Teléfono:</strong> {t.telefono}</p>
                    <p style={{ margin: '0.3rem 0', fontSize: '16px' }}><strong>Raza:</strong> {t.raza} | <strong>Peso:</strong> {t.peso}kg | <strong>Edad:</strong> {t.edad} años</p>
                    <p style={{ margin: '0.3rem 0', fontSize: '16px' }}><strong>Alergias:</strong> {t.alergias || 'N/A'}</p>
                    <p style={{ margin: '0.3rem 0', fontSize: '16px' }}><strong>Medicamentos:</strong> {t.medicamentos || 'N/A'}</p>
                    <p style={{ margin: '0.3rem 0', fontSize: '16px' }}><strong>Antecedentes:</strong> {t.antecedentes || 'N/A'}</p>
                  </div>

                  {t.estado === 'Pendiente' && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={() => actualizarEstadoEnSheets(t.id, 'Confirmado')}
                        style={{ 
                          ...btnStyle, 
                          flex: 1,
                          padding: '12px', 
                          background: '#4CAF50', 
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        ✓ Confirmar
                      </button>
                      <button 
                        onClick={() => actualizarEstadoEnSheets(t.id, 'Rechazado')}
                        style={{ 
                          ...btnStyle, 
                          flex: 1,
                          padding: '12px', 
                          background: '#f44336', 
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        ✕ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (page === 'paciente') {
    return (
      <div style={{ background: FONDO_VIOLETA, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '28px' }}>Solicitar Turno</h1>
            <button onClick={() => setPage('home')} style={{ ...btnStyle, padding: '8px 12px', background: '#f44336', color: 'white', fontSize: '16px' }}>Salir</button>
          </div>

          {paso === 1 && (
            <div>
              <h2 style={{ fontSize: '22px' }}>Datos personales</h2>
              <label style={labelStyle}>Nombre</label>
              <input type="text" placeholder="Tu nombre completo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={inputStyle} />
              
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="tu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              
              <label style={labelStyle}>Teléfono</label>
              <input type="tel" placeholder="Tu teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} style={inputStyle} />
              
              <label style={labelStyle}>Raza</label>
              <input type="text" placeholder="ej: Bulldog Francés" value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })} style={inputStyle} />
              
              <label style={labelStyle}>Peso (kg)</label>
              <input type="number" placeholder="Peso en kg" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} style={inputStyle} />
              
              <label style={labelStyle}>Edad (años)</label>
              <input type="number" placeholder="Edad en años" value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })} style={inputStyle} />

              <h2 style={{ fontSize: '22px', marginTop: '1.5rem' }}>Selecciona día y hora</h2>
              {Object.keys(horarios).map((dia) => {
                const btnHoraSelected = { ...btnStyle, padding: '8px 14px', margin: '5px', background: '#2196F3', color: 'white', fontSize: '16px' };
                const btnHoraDefault = { ...btnStyle, padding: '8px 14px', margin: '5px', background: '#ddd', color: 'black', fontSize: '16px' };
                return (
                  <div key={dia} style={{ background: '#f9f9f9', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}><strong>{dia}</strong> - {horarios[dia].medico}</p>
                    {horarios[dia].horas.map((hora) => {
                      const isSelected = diaHora && diaHora.dia === dia && diaHora.hora === hora;
                      return (
                        <button key={hora} type="button" onClick={() => setDiaHora({ dia, hora })} style={isSelected ? btnHoraSelected : btnHoraDefault}>{hora}</button>
                      );
                    })}
                  </div>
                );
              })}

              <button type="button" onClick={() => setPaso(2)} style={{ ...btnStyle, width: '100%', padding: '14px', background: '#4CAF50', color: 'white', marginTop: '10px', fontSize: '18px', fontWeight: 'bold' }}>Siguiente</button>
            </div>
          )}

          {paso === 2 && (
            <div>
              <h2 style={{ fontSize: '22px' }}>Planilla médica</h2>
              
              <label style={labelStyle}>Alergias</label>
              <textarea placeholder="Alergias conocidas" value={planilla.alergias} onChange={(e) => setPlanilla({ ...planilla, alergias: e.target.value })} style={{ ...inputStyle, fontSize: '18px' }} rows="3"></textarea>
              
              <label style={labelStyle}>Medicamentos</label>
              <textarea placeholder="Medicamentos que está tomando" value={planilla.medicamentos} onChange={(e) => setPlanilla({ ...planilla, medicamentos: e.target.value })} style={{ ...inputStyle, fontSize: '18px' }} rows="3"></textarea>
              
              <label style={labelStyle}>Antecedentes</label>
              <textarea placeholder="Antecedentes médicos relevantes" value={planilla.antecedentes} onChange={(e) => setPlanilla({ ...planilla, antecedentes: e.target.value })} style={{ ...inputStyle, fontSize: '18px' }} rows="3"></textarea>

              <button type="button" onClick={() => setPaso(1)} style={{ ...btnStyle, padding: '12px 24px', background: '#999', color: 'white', marginRight: '10px', fontSize: '18px' }}>Atrás</button>
              <button type="button" onClick={crearTurno} disabled={cargando} style={{ ...btnStyle, padding: '12px 24px', background: cargando ? '#999' : '#4CAF50', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{cargando ? 'Guardando...' : 'Confirmar'}</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}