import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MessageSquare, Clock, MapPin, Wrench, AlertTriangle, User } from "lucide-react";

// Mock contact data
const contacts = {
  property_manager: {
    name: "Ana Martínez",
    role: "Gestora de Propiedades",
    phone: "+34 123 456 789",
    email: "ana.martinez@liventy.com",
    availability: "Lun-Vie 9:00-18:00",
    photo: "AM"
  },
  maintenance: {
    name: "Servicio Técnico",
    role: "Mantenimiento",
    phone: "+34 987 654 321",
    email: "mantenimiento@liventy.com",
    availability: "Lun-Vie 9:00-18:00",
    photo: "ST"
  },
  emergency: {
    name: "Emergencias 24h",
    role: "Atención de Urgencias",
    phone: "+34 600 000 000",
    availability: "24 horas, 7 días",
    photo: "EM"
  },
  general: {
    name: "Atención al Cliente",
    role: "Consultas Generales",
    phone: "+34 900 123 456",
    email: "info@liventy.com",
    availability: "Lun-Vie 9:00-20:00, Sáb 10:00-14:00",
    photo: "AC"
  }
};
export default function TenantContact() {
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };
  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };
  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Contacto</h1>
        <p className="text-muted-foreground">
          Encuentra toda la información de contacto para resolver tus dudas y consultas
        </p>
      </div>

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-800">Emergencias</CardTitle>
              <p className="text-red-700 text-sm">Para situaciones urgentes que requieren atención inmediata</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-800">{contacts.emergency.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{contacts.emergency.availability}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => handleCall(contacts.emergency.phone)}>
                <Phone className="h-4 w-4 mr-2" />
                Llamar Ahora
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleWhatsApp(contacts.emergency.phone)} className="border-red-300 text-red-700 hover:bg-red-50">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Contacts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Property Manager */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{contacts.property_manager.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{contacts.property_manager.role}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.property_manager.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.property_manager.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.property_manager.availability}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1" onClick={() => handleCall(contacts.property_manager.phone)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEmail(contacts.property_manager.email)}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{contacts.maintenance.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{contacts.maintenance.role}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.maintenance.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.maintenance.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.maintenance.availability}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1" onClick={() => handleCall(contacts.maintenance.phone)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEmail(contacts.maintenance.email)}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Support */}
        <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{contacts.general.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{contacts.general.role}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.general.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.general.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{contacts.general.availability}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1" onClick={() => handleCall(contacts.general.phone)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEmail(contacts.general.email)}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2" asChild>
              <a href="/area-clientes/inquilino/servicios">
                <Wrench className="h-6 w-6" />
                <span>Solicitar Mantenimiento</span>
              </a>
            </Button>
            
            <Button variant="outline" className="h-16 flex-col gap-2" asChild>
              <a href="/area-clientes/inquilino/consulta">
                <MessageSquare className="h-6 w-6" />
                <span>Chat de Soporte</span>
              </a>
            </Button>
            
            <Button variant="outline" className="h-16 flex-col gap-2" asChild>
              <a href="/area-clientes/documentos">
                <MapPin className="h-6 w-6" />
                <span>Ver Documentos</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Office Info */}
      
    </div>;
}