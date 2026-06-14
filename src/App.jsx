import React, { useState, useEffect } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';

emailjs.init('SOKEjUWWw81_MdcxU');

export default function App() {
  const [page, setPage] = useState('home');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
  const [diaHoraSeleccionado, setDiaHoraSeleccionado] = useState(null);
  const [planilla, setPlanilla] = useState({ alergias: '', medicamentos: '', antecedentes: '' });
  const [paso, setPaso] = useState(1);
  const [adminTab, setAdminTab] = useState('turnos');
  
  // Estados para edición
  const [editandoTurno, setEditandoTurno] = useState(null);
  const [editandoDoctor, setEditandoDoctor] = useState(null);
  const [editandoHorario, setEditandoHorario] = useState(null);
  const [nuevoDoctor, setNuevoDoctor] = useState('');
  const [nuevoHorarioForm, setNuevoHorarioForm] = useState({ doctor: '', semana: '', dia: '', hora: '' });

  const CONTRASEÑA = 'braquicefalicos';
  const SHEETDB_URL = 'https://sheetdb.io/api/v1/ey5n5cdouz9mc';
  const LOGO_URL = 'https://www.fvet.uba.ar/sites/default/files/pictures/membrete-2022.jpg';
  const FONDO_VIOLETA = '#E9D5FF';

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    await Promise.all([cargarTurnos(), cargarHorarios(), cargarDoctores()]);
  };

  const cargarTurnos = async () => {
    try {
      const response = await fetch(SHEETDB_URL);
      if (response.ok) {
        const data = await response.json();
        const turnosFiltrados = data.data.filter(item => !item.tipo || item.tipo !== 'horario_disponible' && item.tipo !== 'doctor');
        setTurnos(turnosFiltrados);
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

  const cargarDoctores = async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: { tipo: 'doctor' } })
      });
      if (response.ok) {
        const data = await response.json();
        setDoctores(data.data || []);
      }
    } catch (error) {
      console.log('Error cargando doctores:', error);
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
    } catch (error) {
      console.log('Error enviando email:', error);
    }
  };

  const guardarEnSheets = async (dato) => {
    try {
      const response = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dato })
      });
      return response.ok;
    } catch (error) {
      console.log('Error guardando:', error);
      return false;
    }
  };

  const actualizarEnSheets = async (id, dato) => {
    try {
      const response = await fetch(`${SHEETDB_URL}/id/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dato })
      });
      return response.ok;
    } catch (error) {
      console.log('Error actualizando:', error);
      return false;
    }
  };

  const eliminarDeSheets = async (id) => {
    try {
      const response = await fetch(`${SHEETDB_URL}/id/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.log('Error eliminando:', error);
      return false;
    }
  };

  const crearDoctor = async () => {
    if (!nuevoDoctor.trim()) {
      alert('Ingresa nombre del doctor');
      return;
    }
    
    const doctor = {
      id: Date.now(),
      nombre: nuevoDoctor,
      tipo: 'doctor',
      fechaCreacion: new Date().toLocaleDateString()
    };

    if (await guardarEnSheets(doctor)) {
      setDoctores([...doctores, doctor]);
      setNuevoDoctor('');
      alert('Doctor creado');
    }
  };

  const actualizarDoctor = async (id, nuevoNombre) => {
    if (await actualizarEnSheets(id, { nombre: nuevoNombre })) {
      setDoctores(doctores.map(d => d.id === id ? { ...d, nombre: nuevoNombre } : d));
      setEditandoDoctor(null);
      alert('Doctor actualizado');
    }
  };

  const eliminarDoctor = async (id) => {
    if (window.confirm('¿Eliminar este doctor?')) {
      if (await eliminarDeSheets(id)) {
        setDoctores(doctores.filter(d => d.id !== id));
        alert('Doctor eliminado');
      }
    }
  };

  const crearHorario = async () => {
    if (!nuevoHorarioForm.doctor || !nuevoHorarioForm.semana || !nuevoHorarioForm.dia || !nuevoHorarioForm.hora) {
      alert('Completa todos los campos');
      return;
    }

    const horario = {
      id: Date.now(),
      doctor: nuevoHorarioForm.doctor,
      semana: nuevoHorarioForm.semana,
      dia: nuevoHorarioForm.dia,
      hora: nuevoHorarioForm.hora,
      tipo: 'horario_disponible',
      fechaCreacion: new Date().toLocaleDateString()
    };

    if (await guardarEnSheets(horario)) {
      setHorariosDisponibles([...horariosDisponibles, horario]);
      setNuevoHorarioForm({ doctor: '', semana: '', dia: '', hora: '' });
      alert('Horario creado');
    }
  };

  const actualizarHorario = async (id, cambios) => {
    if (await actualizarEnSheets(id, cambios)) {
      setHorariosDisponibles(horariosDisponibles.map(h => h.id === id ? { ...h, ...cambios } : h));
      setEditandoHorario(null);
      alert('Horario actualizado');
    }
  };

  const eliminarHorario = async (id) => {
    if (window.confirm('¿Eliminar este horario?')) {
      if (await eliminarDeSheets(id)) {
        setHorariosDisponibles(horariosDisponibles.filter(h => h.id !== id));
        alert('Horario eliminado');
      }
    }
  };

  const actualizarTurno = async (id, cambios) => {
    if (await actualizarEnSheets(id, cambios)) {
      setTurnos(turnos.map(t => t.id === id ? { ...t, ...cambios } : t));
      setEditandoTurno(null);
      alert('Turno actualizado');
    }
  };

  const eliminarTurno = async (id) => {
    if (window.confirm('¿Eliminar este turno?')) {
      if (await eliminarDeSheets(id)) {
        setTurnos(turnos.filter(t => t.id !== id));
        alert('Turno eliminado');
      }
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
      dia: diaHoraSeleccionado.dia,
      hora: diaHoraSeleccionado.hora,
      medico: diaHoraSeleccionado.medico,
      estado: 'Pendiente',
      alergias: planilla.alergias,
      medicamentos: planilla.medicamentos,
      antecedentes: planilla.antecedentes,
      fechaCreacion: new Date().toLocaleDateString()
    };

    setCargando(true);
    if (await guardarEnSheets(nuevoTurno)) {
      await enviarEmail(nuevoTurno.email, {
        nombre: nuevoTurno.nombre,
        estado: 'agendado',
        fecha: nuevoTurno.dia,
        hora: nuevoTurno.hora,
        medico: nuevoTurno.medico
      });
      setTurnos([...turnos, nuevoTurno]);
      alert('Turno creado!');
      setForm({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
      setDiaHoraSeleccionado(null);
      setPlanilla({ alergias: '', medicamentos: '', antecedentes: '' });
      setPaso(1);
    }
    setCargando(false);
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
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '28px' }}>Panel de Admin</h1>
            <button onClick={() => setPage('home')} style={{ ...btnStyle, padding: '8px 12px', background: '#f44336', color: 'white', fontSize: '16px' }}>Salir</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #ddd', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setAdminTab('turnos')}
              style={{ ...btnStyle, padding: '12px 24px', fontSize: '18px', background: adminTab === 'turnos' ? '#2196F3' : '#ddd', color: adminTab === 'turnos' ? 'white' : 'black', fontWeight: 'bold' }}
            >
              📋 Turnos
            </button>
            <button 
              onClick={() => setAdminTab('doctores')}
              style={{ ...btnStyle, padding: '12px 24px', fontSize: '18px', background: adminTab === 'doctores' ? '#2196F3' : '#ddd', color: adminTab === 'doctores' ? 'white' : 'black', fontWeight: 'bold' }}
            >
              👨‍⚕️ Doctores
            </button>
            <button 
              onClick={() => setAdminTab('horarios')}
              style={{ ...btnStyle, padding: '12px 24px', fontSize: '18px', background: adminTab === 'horarios' ? '#2196F3' : '#ddd', color: adminTab === 'horarios' ? 'white' : 'black', fontWeight: 'bold' }}
            >
              ⏰ Horarios por Semana
            </button>
          </div>

          {/* TAB TURNOS */}
          {adminTab === 'turnos' && (
            <>
              <h2 style={{ fontSize: '22px' }}>Total de Turnos: {turnos.length}</h2>
              
              {turnos.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem', fontSize: '18px' }}>No hay turnos agendados.</p>
              ) : (
                <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <thead>
                      <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Turno</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Doctor</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Día</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Hora</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Estado</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnos.map((t) => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', fontSize: '16px' }}>{t.nombre}</td>
                          <td style={{ padding: '12px', fontSize: '16px' }}>{t.medico}</td>
                          <td style={{ padding: '12px', fontSize: '16px' }}>{t.dia}</td>
                          <td style={{ padding: '12px', fontSize: '16px' }}>{t.hora}</td>
                          <td style={{ padding: '12px', fontSize: '16px' }}>
                            <span style={{ background: getEstadoColor(t.estado), color: 'white', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
                              {t.estado}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            {editandoTurno === t.id ? (
                              <div style={{ fontSize: '14px' }}>
                                <select value={editandoTurno ? turnos.find(x => x.id === editandoTurno)?.estado : t.estado} onChange={(e) => actualizarTurno(t.id, { estado: e.target.value })} style={{ ...inputStyle, margin: '5px 0' }}>
                                  <option>Pendiente</option>
                                  <option>Confirmado</option>
                                  <option>Rechazado</option>
                                </select>
                                <button onClick={() => setEditandoTurno(null)} style={{ ...btnStyle, padding: '6px 12px', background: '#999', color: 'white', fontSize: '14px', marginRight: '5px' }}>Listo</button>
                              </div>
                            ) : (
                              <>
                                <button onClick={() => setEditandoTurno(t.id)} style={{ ...btnStyle, padding: '6px 12px', background: '#2196F3', color: 'white', fontSize: '14px', marginRight: '5px' }}>✏️ Editar</button>
                                <button onClick={() => eliminarTurno(t.id)} style={{ ...btnStyle, padding: '6px 12px', background: '#f44336', color: 'white', fontSize: '14px' }}>🗑️ Eliminar</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* TAB DOCTORES */}
          {adminTab === 'doctores' && (
            <>
              <h2 style={{ fontSize: '22px' }}>Gestionar Doctores</h2>
              
              <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>Crear nuevo doctor</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Nombre del doctor" 
                    value={nuevoDoctor} 
                    onChange={(e) => setNuevoDoctor(e.target.value)} 
                    style={{...inputStyle, margin: 0, flex: 1}} 
                  />
                  <button onClick={crearDoctor} style={{ ...btnStyle, padding: '12px 24px', background: '#4CAF50', color: 'white', fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap' }}>+ Crear</button>
                </div>
              </div>

              {doctores.length === 0 ? (
                <p style={{ fontSize: '16px', color: '#999' }}>No hay doctores creados.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {doctores.map((d) => (
                    <div key={d.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {editandoDoctor === d.id ? (
                        <input 
                          type="text" 
                          defaultValue={d.nombre} 
                          onBlur={(e) => actualizarDoctor(d.id, e.target.value)} 
                          style={{...inputStyle, margin: 0}} 
                          autoFocus 
                        />
                      ) : (
                        <h3 style={{ fontSize: '20px', margin: 0 }}>{d.nombre}</h3>
                      )}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setEditandoDoctor(editandoDoctor === d.id ? null : d.id)} style={{ ...btnStyle, padding: '8px 16px', background: '#2196F3', color: 'white', fontSize: '14px' }}>✏️ Editar</button>
                        <button onClick={() => eliminarDoctor(d.id)} style={{ ...btnStyle, padding: '8px 16px', background: '#f44336', color: 'white', fontSize: '14px' }}>🗑️ Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB HORARIOS */}
          {adminTab === 'horarios' && (
            <>
              <h2 style={{ fontSize: '22px' }}>Horarios por Semana</h2>
              
              <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>Crear nuevo horario</h3>
                
                <label style={labelStyle}>Doctor</label>
                <select value={nuevoHorarioForm.doctor} onChange={(e) => setNuevoHorarioForm({ ...nuevoHorarioForm, doctor: e.target.value })} style={inputStyle}>
                  <option value="">Selecciona doctor</option>
                  {doctores.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                </select>

                <label style={labelStyle}>Semana (ej: 25)</label>
                <input type="number" placeholder="Número de semana (1-52)" min="1" max="52" value={nuevoHorarioForm.semana} onChange={(e) => setNuevoHorarioForm({ ...nuevoHorarioForm, semana: e.target.value })} style={inputStyle} />

                <label style={labelStyle}>Día</label>
                <select value={nuevoHorarioForm.dia} onChange={(e) => setNuevoHorarioForm({ ...nuevoHorarioForm, dia: e.target.value })} style={inputStyle}>
                  <option value="">Selecciona día</option>
                  <option>Lunes</option>
                  <option>Martes</option>
                  <option>Miércoles</option>
                  <option>Jueves</option>
                  <option>Viernes</option>
                </select>

                <label style={labelStyle}>Hora</label>
                <input type="time" value={nuevoHorarioForm.hora} onChange={(e) => setNuevoHorarioForm({ ...nuevoHorarioForm, hora: e.target.value })} style={inputStyle} />

                <button onClick={crearHorario} style={{ ...btnStyle, width: '100%', padding: '14px', background: '#4CAF50', color: 'white', fontWeight: 'bold', fontSize: '18px', marginTop: '1rem' }}>+ Crear Horario</button>
              </div>

              {horariosDisponibles.length === 0 ? (
                <p style={{ fontSize: '16px', color: '#999' }}>No hay horarios configurados.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <thead>
                      <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Doctor</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Semana</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Día</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Hora</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {horariosDisponibles.map((h) => (
                        <tr key={h.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', fontSize: '16px' }}>{h.doctor}</td>
                          <td style={{ padding: '12px', fontSize: '16px' }}>Semana {h.semana}</td>
                          <td style={{ padding: '12px', fontSize: '16px' }}>{h.dia}</td>
                          <td style={{ padding: '12px', fontSize: '16px' }}>{h.hora}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button onClick={() => setEditandoHorario(editandoHorario === h.id ? null : h.id)} style={{ ...btnStyle, padding: '6px 12px', background: '#2196F3', color: 'white', fontSize: '14px', marginRight: '5px' }}>✏️ Editar</button>
                            <button onClick={() => eliminarHorario(h.id)} style={{ ...btnStyle, padding: '6px 12px', background: '#f44336', color: 'white', fontSize: '14px' }}>🗑️ Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    const isSelected = diaHoraSeleccionado && diaHoraSeleccionado.id === h.id;
                    return (
                      <button 
                        key={idx}
                        type="button" 
                        onClick={() => setDiaHoraSeleccionado({ id: h.id, doctor: h.doctor, dia: h.dia, hora: h.hora })}
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
                        Semana {h.semana} - {h.dia} {h.hora} ({h.doctor})
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