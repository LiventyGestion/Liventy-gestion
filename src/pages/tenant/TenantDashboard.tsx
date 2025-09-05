import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyInfo from "@/components/PropertyInfo";
import { Calendar, Wrench, FileText, MessageSquare } from "lucide-react";

// Mock data for quick stats
const mockStats = {
  nextPaymentDate: "1 Abr",
  activeRequests: 2,
  totalDocuments: 5,
  supportAvailable: "24/7"
};

export default function TenantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel de Inquilino</h1>
        <p className="text-muted-foreground">
          Información general de tu contrato y vivienda
        </p>
      </div>

      {/* Property Info */}
      <PropertyInfo />

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximo Pago</p>
                <p className="text-2xl font-bold">{mockStats.nextPaymentDate}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solicitudes</p>
                <p className="text-2xl font-bold">{mockStats.activeRequests}</p>
              </div>
              <Wrench className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documentos</p>
                <p className="text-2xl font-bold">{mockStats.totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Soporte</p>
                <p className="text-lg font-bold">{mockStats.supportAvailable}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => window.location.href = '/area-clientes/inquilino/servicios'}>
              <CardContent className="p-4 text-center">
                <Wrench className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Solicitar Servicios</h3>
                <p className="text-sm text-muted-foreground">Limpieza y mantenimiento</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.location.href = '/area-clientes/inquilino/consulta'}>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Chat de Consultas</h3>
                <p className="text-sm text-muted-foreground">Contacta con soporte</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.location.href = '/area-clientes/documentos'}>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Documentos</h3>
                <p className="text-sm text-muted-foreground">Contratos y certificados</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}