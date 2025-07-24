import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Euro } from "lucide-react";

const RentalSimulator = () => {
  const [propertyValue, setPropertyValue] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [results, setResults] = useState<{
    annualRent: number;
    grossYield: number;
    netYield: number;
  } | null>(null);

  const calculateYield = () => {
    const value = parseFloat(propertyValue);
    const rent = parseFloat(monthlyRent);
    
    if (!value || !rent) return;

    const annualRent = rent * 12;
    const grossYield = (annualRent / value) * 100;
    const netYield = grossYield * 0.85; // Estimación considerando gastos

    setResults({
      annualRent,
      grossYield,
      netYield,
    });
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simula la rentabilidad de tu propiedad
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre el potencial de ingresos de tu inmueble con nuestro simulador.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              Calculadora de Rentabilidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Valor de la propiedad (€)
                </label>
                <Input
                  type="number"
                  placeholder="350000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alquiler mensual estimado (€)
                </label>
                <Input
                  type="number"
                  placeholder="1500"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <Button 
              onClick={calculateYield}
              size="lg"
              className="w-full h-12"
              disabled={!propertyValue || !monthlyRent}
            >
              Calcular Rentabilidad
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>

            {results && (
              <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Euro className="h-5 w-5 text-primary" />
                  Resultados de tu simulación
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos anuales</p>
                    <p className="text-xl font-bold text-primary">
                      €{results.annualRent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rentabilidad bruta</p>
                    <p className="text-xl font-bold text-primary">
                      {results.grossYield.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rentabilidad neta est.</p>
                    <p className="text-xl font-bold text-primary">
                      {results.netYield.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  *Estimación basada en datos del mercado. Para un análisis personalizado, 
                  <Button variant="link" className="px-1 h-auto">
                    contacta con nosotros
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RentalSimulator;