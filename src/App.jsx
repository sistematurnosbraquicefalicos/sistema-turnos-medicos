import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
  const [diaHora, setDiaHora] = useState(null);
  const [planilla, setPlanilla] = useState({ alergias: '', medicamentos: '', antecedentes: '' });
  const [paso, setPaso] = useState(1);

  const horarios = {
    Lunes: { medico: 'Dr. García', horas: ['09:00', '10:00', '11:00'] },
    Martes: { medico: 'Dra. López', horas: ['09:00', '10:30', '11:30'] },
    Miércoles: { medico: 'Dr. Martínez', horas: ['14:00', '15:00', '16:00'] },
    Jueves: { medico: 'Dra. Silva', horas: ['09:00', '10:00', '11:00'] },
    Viernes: { medico: 'Dr. García', horas: ['10:00', '11:00', '14:00'] }
  };

  const crearTurno = () => {
    if (!form.nombre || !form.email || !diaHora) {
      alert('Completa todos los datos');
      return;
    }
    const turno = {
      id: Date.now(),
      ...form,
      ...diaHora,
      medico: horarios[diaHora.dia].medico,
      estado: 'Pendiente',
      planilla
    };
    setTurnos([...turnos, turno]);
    alert('✅ Turno creado! Planilla guardada.');
    setForm({ nombre: '', email: '', telefono: '', raza: '', peso: '', edad: '' });
    setDiaHora(null);
    setPlanilla({ alergias: '', medicamentos: '', antecedentes: '' });
    setPaso(1);
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🏥 Sistema de Turnos Médicos</h1>
        <button onClick={() => setUser('propietario')} style={{ padding: '12px 24px', margin: '10px', fontSize: '16px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          👨‍💼 Propietario
        </button>
        <button onClick={() => setUser('paciente')} style={{ padding: '12px 24px', margin: '10px', fontSize: '16px', cursor: 'pointer', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}>
          👨‍⚕️ Paciente
        </button>
      </div>
    );
  }

  if (user === 'propietario') {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>🏥 Panel de Gestión</h1>
        <button onClick={() => setUser(null)} style={{ padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Salir
        </button>
        <h2>Turnos: {turnos.length}</h2>
        {turnos.map(t => (
          <div key={t.id} style={{ background: '#f0f0f0', padding: '12px', margin: '10px 0', borderRadius: '4px' }}>
            <p><strong>{t.nombre}</strong> - {t.dia} {t.hora}</p>
            <p>Médico: {t.medico} | Estado: {t.estado}</p>
          </div>
        ))}
      </div>
    );
  }

  if (user === 'paciente') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px' }}>
        <h1>👨‍⚕️ Reservar Turno</h1>
        <button onClick={() => setUser(null)} style={{ padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Salir
        </button>

        {paso === 1 && (
          <div>
            <h2>Datos personales</h2>
            <input type="text" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="tel" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="text" placeholder="Raza" value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="number" placeholder="Peso (kg)" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="number" placeholder="Edad" value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} />

            <h2>Selecciona día y hora</h2>
            {Object.entries(horarios).map(([dia, config]) => (
              <div key={dia} style={{ background: '#f9f9f9', padding: '12px', margin: '10px 0', borderRadius: '4px' }}>
                <p><strong>{dia}</strong> - {config.medico}</p>
                {config.horas.map(hora => (
                  <button key={hora} onClick={() => setDiaHora({ dia, hora })} style={{ padding: '6px 12px', margin: '5px', background: diaHora?.dia === dia && diaHora?.hora === hora ? '#2196F3' : '#ddd', color: diaHora?.dia === dia && diaHora?.hora === hora ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {hora}
                  </button>
                ))}
              </div>
            ))}

            <button onClick={() => setPaso(2)} style={{ width: '100%', padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
              Siguiente →
            </button>
          </div>
        )}

        {paso === 2 && (
          <div>
            <h2>Completa tu planilla</h2>
            <textarea placeholder="Alergias" value={planilla.alergias} onChange={(e) => setPlanilla({ ...planilla, alergias: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} rows="3" />
            <textarea placeholder="Medicamentos" value={planilla.medicamentos} onChange={(e) => setPlanilla({ ...planilla, medicamentos: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} rows="3" />
            <textarea placeholder="Antecedentes" value={planilla.antecedentes} onChange={(e) => setPlanilla({ ...planilla, antecedentes: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }} rows="3" />

            <button onClick={() => setPaso(1)} style={{ padding: '12px 24px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
              ← Atrás
            </button>
            <button onClick={crearTurno} style={{ padding: '12px 24px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              ✅ Confirmar turno
            </button>
          </div>
        )}
      </div>
    );
  }
}