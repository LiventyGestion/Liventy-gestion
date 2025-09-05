import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Euro, FileText } from "lucide-react";

// Mock data - in real app this would come from props/API
const mockPropertyData = {
  address: "Calle Mayor, 15, 2ºB",
  city: "Madrid",
  startDate: "15 enero 2024",
  endDate: "14 enero 2025",
  monthlyRent: 850,
  deposit: 1700,
  status: "Activo",
  type: "Larga duración",
  contractCode: "CT-2024-001"
};

export default function PropertyInfo() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Tu Vivienda en Alquiler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Dirección</p>
            <p className="font-semibold">{mockPropertyData.address}</p>
            <p className="text-sm text-muted-foreground">{mockPropertyData.city}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Periodo del Contrato</p>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="font-semibold text-sm">{mockPropertyData.startDate}</p>
            </div>
            <p className="text-sm text-muted-foreground">hasta {mockPropertyData.endDate}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Renta Mensual</p>
            <div className="flex items-center gap-2 mb-1">
              <Euro className="w-4 h-4 text-primary" />
              <p className="font-bold text-2xl text-primary">€{mockPropertyData.monthlyRent}</p>
            </div>
            <p className="text-xs text-muted-foreground">Fianza: €{mockPropertyData.deposit}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Estado del Contrato</p>
            <Badge variant="default" className="mb-1">
              {mockPropertyData.status}
            </Badge>
            <p className="text-sm text-muted-foreground">{mockPropertyData.type}</p>
            <div className="flex items-center gap-1 mt-1">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{mockPropertyData.contractCode}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}