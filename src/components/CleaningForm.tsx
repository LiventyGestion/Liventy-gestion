import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useServiceRequests } from "@/hooks/useServiceRequests";

interface CleaningFormProps {
  selectedDate: Date;
  onComplete: () => void;
  onBack: () => void;
}

export function CleaningForm({ selectedDate, onComplete, onBack }: CleaningFormProps) {
  const [hours, setHours] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const { createServiceRequest, isLoading } = useServiceRequests();

  const timeSlots = [
    { value: "morning", label: "Mañana (9:00 - 13:00)", available: true },
    { value: "afternoon", label: "Tarde (14:00 - 18:00)", available: true },
    { value: "specific", label: "Horario específico", available: true }
  ];

  const hourOptions = [
    { value: "2", label: "2 horas", price: 40 },
    { value: "3", label: "3 horas", price: 60 },
    { value: "4", label: "4 horas", price: 80 },
    { value: "6", label: "6 horas", price: 120 }
  ];

  const handleSubmit = async () => {
    if (!hours || !timeSlot) return;
    
    const timeSlotLabel = timeSlots.find(slot => slot.value === timeSlot)?.label || timeSlot;
    
    const result = await createServiceRequest({
      type: 'limpieza',
      date: selectedDate,
      time_slot: timeSlotLabel,
      hours: parseInt(hours)
    });

    if (result) {
      onComplete();
    }
  };

  const selectedHourOption = hourOptions.find(option => option.value === hours);

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

      {/* Hours selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selecciona las horas de limpieza</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {hourOptions.map((option) => (
              <Card 
                key={option.value} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  hours === option.value ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setHours(option.value)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold">{option.label}</div>
                  <div className="text-2xl font-bold text-primary">€{option.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time slot selection */}
      {hours && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selecciona la franja horaria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <Card 
                  key={slot.value} 
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    timeSlot === slot.value ? 'ring-2 ring-primary' : ''
                  } ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => slot.available && setTimeSlot(slot.value)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{slot.label}</span>
                    </div>
                    {slot.available ? (
                      <Badge variant="secondary">Disponible</Badge>
                    ) : (
                      <Badge variant="destructive">No disponible</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary and submit */}
      {hours && timeSlot && (
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
                <span>Duración:</span>
                <span className="font-semibold">{selectedHourOption?.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Horario:</span>
                <span className="font-semibold">
                  {timeSlots.find(slot => slot.value === timeSlot)?.label}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Total:</span>
                <span className="font-bold text-primary">€{selectedHourOption?.price}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6" 
              size="lg" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Enviando solicitud...' : 'Confirmar Solicitud de Limpieza'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}