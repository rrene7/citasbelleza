import { useState } from "react";

export default function InscribirSalon() {
  const [form, setForm] = useState({
    nombre_propietario: "",
    email: "",
    telefono: "",
    nombre_salon: "",
    direccion: "",
    descripcion: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost/citasbelleza/api/solicitudes/store.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.ok) {
      alert("Solicitud enviada. Te contactaremos pronto.");
      setForm({
        nombre_propietario: "",
        email: "",
        telefono: "",
        nombre_salon: "",
        direccion: "",
        descripcion: ""
      });
    } else {
      alert(data.error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Registrar Salón</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre_propietario" placeholder="Propietario" value={form.nombre_propietario} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="nombre_salon" placeholder="Nombre del salón" value={form.nombre_salon} onChange={handleChange} />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <button type="submit">Enviar solicitud</button>
      </form>
    </div>
  );
}
