import React, { useState, useEffect } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';

// Inicializar EmailJS
emailjs.init('SOKEjUWWw81_MdcxU');

export default function App() {
  const [page, setPage] = useState('home');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
  const [diaHoraSeleccionado, setDiaHoraSeleccionado] = useState(null);
  const [planilla, setPlanilla] = useState({ alergias: '', medicamentos: '', antecedentes: '' });
  const [paso, setPaso] = useState(1);
  const [adminTab, setAdminTab] = useState('turnos'); // 'turnos' o 'configuracion'
  const [nuevoHorario, setNuevoHorario] = useState({ fecha: '', hora: '', medico: '' });

  const CONTRASEÑA = 'braquicefalicos';
  const SHEETDB_URL = 'https://sheetdb.io/api/v1/ey5n5cdouz9mc';
  const LOGO_URL = 'https://www.fvet.uba.ar/sites/default/files/pictures/membrete-2022.jpg';
  const FONDO_VIOLETA = '#E9D5FF';

  // Cargar turnos al iniciar
  useEffect(() => {
    cargarTurnos();
    cargarHorarios();
  }, []);

  const cargarTurnos = async () => {
    try {
      const response = await fetch(SHEETDB_URL);
      if (response.ok) {
        const data = await response.json();
        setTurnos(data.data || []);
      }
    } catch (error) {
      console.log('Error cargando turnos:', error);
    }
  };

  const cargarHorarios = async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: { tipo: 'horario_disponible' } })
      });
      if (response.ok) {
        const data = await response.json();
        setHorariosDisponibles(data.data || []);
      }
    } catch (error) {
      console.log('Error cargando horarios:', error);
    }
  };

  const enviarEmail = async (destinatario, variables) => {
    try {
      await emailjs.send('service_xr3n0jn', 'template_11egxpk', {
        to_email: destinatario,
        nombre: variables.nombre,
        estado: variables.estado,
        fecha: variables.fecha,
        hora: variables.hora,
        medico: variables.medico
      });
      console.log('Email enviado a:', destinatario);
    } catch (error) {
      console.log('Error enviando email:', error);
    }
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
        // Enviar email de confirmación
        await enviarEmail(turno.email, {
          nombre: turno.nombre,
          estado: 'agendado',
          fecha: turno.dia,
          hora: turno.hora,
          medico: turno.medico
        });
      }
    } catch (error) {
      console.log('Error guardando turno:', error);
    }
    setCargando(false);
  };

  const agregarHorarioDisponible = async () => {
    if (!nuevoHorario.fecha || !nuevoHorario.hora || !nuevoHorario.medico) {
      alert('Completa todos los campos');
      return;
    }

    try {
      const horario = {
        tipo: 'horario_disponible',
        fecha: nuevoHorario.fecha,
        hora: nuevoHorario.hora,
        medico: nuevoHorario.medico,
        fechaCreacion: new Date().toLocaleDateString()
      };

      const response = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: horario })
      });

      if (response.ok) {
        alert('Horario agregado');
        setNuevoHorario({ fecha: '', hora: '', medico: '' });
        cargarHorarios();
      }
    } catch (error) {
      console.log('Error agregando horario:', error);
    }
  };

  const actualizarEstadoTurno = async (turnoId, nuevoEstado) => {
    try {
      const turno = turnos.find(t => t.id === turnoId);
      if (!turno) return;

      const searchResponse = await fetch(`${SHEETDB_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          search: {
            nombre: turno.nombre,
            dia: turno.dia,
            hora: turno.hora
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
            // Enviar email de cambio de estado
            await enviarEmail(turno.email, {
              nombre: turno.nombre,
              estado: nuevoEstado,
              fecha: turno.dia,
              hora: turno.hora,
              medico: turno.medico
            });

            const turnosActualizados = turnos.map(t => 
              t.id === turnoId ? { ...t, estado: nuevoEstado } : t
            );
            setTurnos(turnosActualizados);
          }
        }
      }
    } catch (error) {
      console.log('Error actualizando turno:', error);
    }
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (password === CONTRASEÑA) {
      setPage('admin');
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  const crearTurno = async () => {
    if (!form.nombre || !form.email || !diaHoraSeleccionado) {
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
      dia: diaHoraSeleccionado.fecha,
      hora: diaHoraSeleccionado.hora,
      medico: diaHoraSeleccionado.medico,
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
    setDiaHoraSeleccionado(null);
    setPlanilla({ alergias: '', medicamentos: '', antecedentes: '' });
    setPaso(1);
  };

  const btnStyle = { border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' };
  const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '18px' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '18px' };

  const Header = () => (
    <div style={{ background: '#f5f5f5', padding: '1rem', borderBottom: '2px solid #333', textAlign: 'center' }}>
      <img src={LOGO_URL} alt="UBA Veterinaria" style={{ height: '60px', marginBottom: '0.5rem' }} />
      <h2 style={{ margin: '0.5rem 0', color: '#333', fontSize: '18px' }}>Hospital Escuela</h2>
      <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '14px' }}>Facultad de Ciencias Veterinarias - UBA</p>
      <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>Servicio de Anestesiología</p>
    </div>
  );

  const getEstadoColor = (estado) => {
    if (estado === 'Confirmado') return '#4CAF50';
    if (estado === 'Rechazado') return '#f44336';
    return '#FF9800';
  };

  // HOME
  if (page === 'home') {
    return (
      <div style={{ background: FONDO_VIOLETA, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px' }}>Sistema de Turnos Médicos</h1>
          <button onClick={() => setPage('login')} style={{ ...btnStyle, padding: '14px 28px', margin: '10px', fontSize: '18px', background: '#4CAF50', color: 'white' }}>Panel de Admin</button>
          <button onClick={() => setPage('paciente')} style={{ ...btnStyle, padding: '14px 28px', margin: '10px', fontSize: '18px', background: '#2196F3', color: 'white' }}>Solicitar turno</button>
        </div>
      </div>
    );
  }

  // LOGIN
  if (page === 'login') {
    return (
      <div style={{ background: FONDO_VIOLETA, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px' }}>Acceso Panel de Admin</h1>
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

  // ADMIN PANEL
  if (page === 'admin') {
    return (
      <div style={{ background: FONDO_VIOLETA, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '28px' }}>Panel de Admin</h1>
            <button onClick={() => setPage('home')} style={{ ...btnStyle, padding: '8px 12px', background: '#f44336', color: 'white', fontSize: '16px' }}>Salir</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #ddd' }}>
            <button 
              onClick={() => setAdminTab('turnos')}
              style={{ ...btnStyle, padding: '12px 24px', fontSize: '18px', background: adminTab === 'turnos' ? '#2196F3' : '#ddd', color: adminTab === 'turnos' ? 'white' : 'black', fontWeight: 'bold' }}
            >
              📋 Turnos
            </button>
            <button 
              onClick={() => setAdminTab('configuracion')}
              style={{ ...btnStyle, padding: '12px 24px', fontSize: '18px', background: adminTab === 'configuracion' ? '#2196F3' : '#ddd', color: adminTab === 'configuracion' ? 'white' : 'black', fontWeight: 'bold' }}
            >
              ⏰ Configurar Horarios
            </button>
          </div>

          {/* TAB TURNOS */}
          {adminTab === 'turnos' && (
            <>
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
                            onClick={() => actualizarEstadoTurno(t.id, 'Confirmado')}
                            style={{ ...btnStyle, flex: 1, padding: '12px', background: '#4CAF50', color: 'white', fontWeight: 'bold', fontSize: '16px' }}
                          >
                            ✓ Confirmar
                          </button>
                          <button 
                            onClick={() => actualizarEstadoTurno(t.id, 'Rechazado')}
                            style={{ ...btnStyle, flex: 1, padding: '12px', background: '#f44336', color: 'white', fontWeight: 'bold', fontSize: '16px' }}
                          >
                            ✕ Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB CONFIGURACION */}
          {adminTab === 'configuracion' && (
            <>
              <h2 style={{ fontSize: '22px' }}>Configurar Horarios Disponibles</h2>
              
              <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>Agregar nuevo horario</h3>
                
                <label style={labelStyle}>Fecha (ej: 26/07/2025)</label>
                <input 
                  type="date" 
                  value={nuevoHorario.fecha} 
                  onChange={(e) => setNuevoHorario({ ...nuevoHorario, fecha: e.target.value })} 
                  style={inputStyle} 
                />

                <label style={labelStyle}>Hora (ej: 17:00)</label>
                <input 
                  type="time" 
                  value={nuevoHorario.hora} 
                  onChange={(e) => setNuevoHorario({ ...nuevoHorario, hora: e.target.value })} 
                  style={inputStyle} 
                />

                <label style={labelStyle}>Médico</label>
                <select 
                  value={nuevoHorario.medico} 
                  onChange={(e) => setNuevoHorario({ ...nuevoHorario, medico: e.target.value })} 
                  style={inputStyle}
                >
                  <option value="">Selecciona un médico</option>
                  <option>Dr. García</option>
                  <option>Dra. López</option>
                  <option>Dr. Martínez</option>
                  <option>Dra. Silva</option>
                </select>

                <button 
                  onClick={agregarHorarioDisponible}
                  style={{ ...btnStyle, width: '100%', padding: '14px', background: '#4CAF50', color: 'white', fontWeight: 'bold', fontSize: '18px', marginTop: '1rem' }}
                >
                  + Agregar Horario
                </button>
              </div>

              <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>Horarios disponibles</h3>
              {horariosDisponibles.length === 0 ? (
                <p style={{ fontSize: '16px', color: '#999' }}>No hay horarios configurados aún.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {horariosDisponibles.map((h, idx) => (
                    <div key={idx} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <p style={{ margin: '0.3rem 0', fontSize: '16px' }}><strong>Fecha:</strong> {h.fecha} | <strong>Hora:</strong> {h.hora} | <strong>Médico:</strong> {h.medico}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // PACIENTE
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
              {horariosDisponibles.length === 0 ? (
                <p style={{ fontSize: '16px', color: '#999' }}>No hay horarios disponibles en este momento.</p>
              ) : (
                <div>
                  {horariosDisponibles.map((h, idx) => {
                    const isSelected = diaHoraSeleccionado && diaHoraSeleccionado.fecha === h.fecha && diaHoraSeleccionado.hora === h.hora;
                    return (
                      <button 
                        key={idx}
                        type="button" 
                        onClick={() => setDiaHoraSeleccionado({ fecha: h.fecha, hora: h.hora, medico: h.medico })}
                        style={{ 
                          ...btnStyle, 
                          width: '100%', 
                          padding: '12px', 
                          margin: '8px 0', 
                          background: isSelected ? '#2196F3' : '#f9f9f9',
                          color: isSelected ? 'white' : '#333',
                          border: '1px solid #ddd',
                          fontSize: '16px',
                          fontWeight: isSelected ? 'bold' : 'normal'
                        }}
                      >
                        {h.fecha} - {h.hora} ({h.medico})
                      </button>
                    );
                  })}
                </div>
              )}

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