import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function InscribirSalon() {
  const [form, setForm] = useState({
    nombre_propietario: "",
    email: "",
    telefono: "",
    nombre_salon: "",
    direccion: "",
    descripcion: ""
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost/citasbelleza/api/solicitudes/store.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const text = await res.text();
      let data: any = {};

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Respuesta invalida del servidor");
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "No se pudo guardar la solicitud");
      }

      setMensaje("Solicitud enviada correctamente. Te contactaremos pronto por WhatsApp o correo.");
      setForm({
        nombre_propietario: "",
        email: "",
        telefono: "",
        nombre_salon: "",
        direccion: "",
        descripcion: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Inscribir salon</CardTitle>
          <CardDescription>
            Envia tus datos para que revisemos tu salon y podamos activarlo en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Propietario *</label>
              <Input name="nombre_propietario" value={form.nombre_propietario} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefono *</label>
              <Input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+507 6000-0000" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del salon *</label>
              <Input name="nombre_salon" value={form.nombre_salon} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Direccion *</label>
              <Input name="direccion" value={form.direccion} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Descripcion</label>
              <Textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={4} />
            </div>

            {mensaje && <p className="md:col-span-2 text-sm text-green-600">{mensaje}</p>}
            {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}

            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
