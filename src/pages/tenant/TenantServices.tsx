import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDatePicker } from "@/components/CalendarDatePicker";
import { CleaningForm } from "@/components/CleaningForm";
import { MaintenanceForm } from "@/components/MaintenanceForm";
import { Sparkles, Wrench, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TenantServices() {
  const [selectedService, setSelectedService] = useState<'limpieza' | 'mantenimiento' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showTimeSlot, setShowTimeSlot] = useState(false);
  const { toast } = useToast();

  const handleServiceSelect = (service: 'limpieza' | 'mantenimiento') => {
    setSelectedService(service);
    setSelectedDate(undefined);
    setShowTimeSlot(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setShowTimeSlot(true);
    }
  };

  const handleCloseDialog = () => {
    setSelectedService(null);
    setSelectedDate(undefined);
    setShowTimeSlot(false);
  };

  const handleServiceComplete = (type: string) => {
    toast({
      title: "Servicio solicitado",
      description: `Tu solicitud de ${type} ha sido registrada correctamente.`,
    });
    handleCloseDialog();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Solicitar Servicios</h1>
        <p className="text-muted-foreground">
          Solicita servicios de limpieza y mantenimiento para tu vivienda
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => handleServiceSelect('limpieza')}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Servicio de Limpieza</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Programa una limpieza profesional de tu vivienda
            </p>
            <Button className="w-full" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Solicitar Limpieza
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => handleServiceSelect('mantenimiento')}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Reporta problemas y solicita reparaciones
            </p>
            <Button className="w-full" size="lg">
              <Clock className="mr-2 h-4 w-4" />
              Solicitar Mantenimiento
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Service Dialog */}
      <Dialog open={selectedService !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedService === 'limpieza' ? (
                <>
                  <Sparkles className="h-5 w-5" />
                  Solicitar Limpieza
                </>
              ) : (
                <>
                  <Wrench className="h-5 w-5" />
                  Solicitar Mantenimiento
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Step 1: Calendar */}
            {!showTimeSlot && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Selecciona una fecha</h3>
                <CalendarDatePicker 
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
              </div>
            )}

            {/* Step 2: Time slot and form */}
            {showTimeSlot && selectedDate && selectedService === 'limpieza' && (
              <CleaningForm 
                selectedDate={selectedDate}
                onComplete={() => handleServiceComplete('limpieza')}
                onBack={() => setShowTimeSlot(false)}
              />
            )}

            {showTimeSlot && selectedDate && selectedService === 'mantenimiento' && (
              <MaintenanceForm 
                selectedDate={selectedDate}
                onComplete={() => handleServiceComplete('mantenimiento')}
                onBack={() => setShowTimeSlot(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}