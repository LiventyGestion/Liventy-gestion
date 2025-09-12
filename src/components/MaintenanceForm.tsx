import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Upload, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useUnifiedLeads } from "@/hooks/useUnifiedLeads";
import { sanitizeInput, RateLimiter } from '@/utils/security';
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceFormProps {
  selectedDate: Date;
  onComplete: () => void;
  onBack: () => void;
}

export function MaintenanceForm({ selectedDate, onComplete, onBack }: MaintenanceFormProps) {
  const [availableHours, setAvailableHours] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  
  // Rate limiter instance
  const rateLimiter = new RateLimiter();
  
  const { submitLead, isSubmitting } = useUnifiedLeads({
    onSuccess: () => {
      onComplete();
    }
  });

  const categories = [
    { value: "albanileria", label: "Albañilería" },
    { value: "pintura", label: "Pintura" },
    { value: "fontaneria", label: "Fontanería" },
    { value: "grifos", label: "Grifos" },
    { value: "banos", label: "Baños" },
    { value: "cisternas", label: "Cisternas" },
    { value: "bajantes", label: "Bajantes" },
    { value: "atascos", label: "Atascos" },
    { value: "cocinas", label: "Cocinas" },
    { value: "persianas", label: "Persianas" },
    { value: "calefaccion", label: "Calefacción" },
    { value: "electricidad", label: "Electricidad en general" }
  ];

  const priorities = [
    { value: "baja", label: "Baja", color: "bg-green-100 text-green-800" },
    { value: "media", label: "Media", color: "bg-orange-100 text-orange-800" },
    { value: "alta", label: "Alta", color: "bg-red-100 text-red-800" }
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos([...photos, ...files]);
  };

  const handleSubmit = async () => {
    // Sanitize inputs
    const sanitizedDescription = sanitizeInput(description);
    
    if (!availableHours || !category || !priority || !sanitizedDescription) {
      return;
    }
    
    // Rate limiting check (max 5 maintenance requests per hour)
    if (!rateLimiter.isAllowed(`maintenance_${Date.now()}`, 5, 3600000)) {
      return;
    }
    
    await submitLead({
      origen: 'servicio_mantenimiento',
      nombre: 'Solicitud de Mantenimiento',
      email: 'admin@liventygestion.com',
      mensaje: `Solicitud de mantenimiento para ${format(selectedDate, 'dd/MM/yyyy')}:
Horas disponibles: ${availableHours}
Categoría: ${categories.find(cat => cat.value === category)?.label || category}
Prioridad: ${priorities.find(prio => prio.value === priority)?.label || priority}
Descripción: ${sanitizedDescription}
Fotos adjuntas: ${photos.length}`,
      info_adicional: `Servicio: Mantenimiento - ${category}, Prioridad: ${priority}, Fotos: ${photos.length}`,
      acepta_comercial: true, // Service request implies consent
      payload: {
        selectedDate: format(selectedDate, 'yyyy-MM-dd'),
        availableHours,
        category,
        priority,
        description: sanitizedDescription,
        photosCount: photos.length
      }
    });
  };

  const isFormValid = availableHours && category && priority && description;
  const selectedPriority = priorities.find(p => p.value === priority);

  return (
    <div className="space-y-6">
      {/* Header with date */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
          </span>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del mantenimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Available hours */}
          <div>
            <Label htmlFor="hours">Horas disponibles</Label>
            <Input
              id="hours"
              placeholder="Ej: Mañanas de 9:00 a 13:00, Tardes después de las 15:00"
              value={availableHours}
              onChange={(e) => setAvailableHours(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Tipo de servicio</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de mantenimiento" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <Label>Prioridad</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {priorities.map((prio) => (
                <Card 
                  key={prio.value}
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    priority === prio.value ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setPriority(prio.value)}
                >
                  <CardContent className="p-3 text-center">
                    <Badge className={prio.color}>
                      {prio.value === 'alta' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {prio.label}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descripción del problema</Label>
            <Textarea
              id="description"
              placeholder="Describe en detalle el problema que necesita ser reparado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Photo upload */}
          <div>
            <Label>Fotos (opcional)</Label>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir fotos
                    <input
                      id="photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {photos.length} {photos.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}
                </span>
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded truncate">
                      {photo.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {isFormValid && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de la solicitud</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span className="font-semibold">
                  {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Disponibilidad:</span>
                <span className="font-semibold">{availableHours}</span>
              </div>
              <div className="flex justify-between">
                <span>Servicio:</span>
                <span className="font-semibold">
                  {categories.find(cat => cat.value === category)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Prioridad:</span>
                <Badge className={selectedPriority?.color}>
                  {selectedPriority?.label}
                </Badge>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6" 
              size="lg" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando solicitud...' : 'Confirmar Solicitud de Mantenimiento'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}