import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyInfo from "@/components/PropertyInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Building,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock documents data
const mockDocuments = [
  {
    id: '1',
    name: 'Contrato de Arrendamiento - Calle Mayor, 15',
    type: 'contract',
    property: 'Calle Mayor, 15, 2ºB',
    date: '2024-01-15',
    size: '2.4 MB',
    category: 'contractual'
  },
  {
    id: '2',
    name: 'Inventario de la Vivienda',
    type: 'inventory',
    property: 'Calle Mayor, 15, 2ºB',
    date: '2024-01-15',
    size: '1.8 MB',
    category: 'inventario'
  },
  {
    id: '3',
    name: 'Normativas del Edificio',
    type: 'rules',
    property: 'Calle Mayor, 15, 2ºB',
    date: '2024-01-15',
    size: '850 KB',
    category: 'normativas'
  },
  {
    id: '4',
    name: 'Certificado Energético',
    type: 'certificate',
    property: 'Calle Mayor, 15, 2ºB',
    date: '2023-12-01',
    size: '1.2 MB',
    category: 'certificados'
  },
  {
    id: '5',
    name: 'Póliza de Seguro',
    type: 'insurance',
    property: 'Calle Mayor, 15, 2ºB',
    date: '2024-01-01',
    size: '960 KB',
    category: 'seguros'
  }
];

export default function GlobalDocuments() {
  const { user } = useAuth();
  const [documents] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getDocumentIcon = (type: string) => {
    const icons = {
      'contract': FileText,
      'inventory': FileText,
      'rules': FileText,
      'certificate': FileText,
      'insurance': FileText,
      'report': FileText
    };
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="h-8 w-8 text-primary" />;
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      'contract': 'Contrato',
      'inventory': 'Inventario',
      'rules': 'Normativas',
      'certificate': 'Certificado',
      'insurance': 'Seguro',
      'report': 'Informe'
    };
    
    return (
      <Badge variant="secondary">
        {typeLabels[type as keyof typeof typeLabels] || type}
      </Badge>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'contractual': 'bg-blue-100 text-blue-800',
      'inventario': 'bg-green-100 text-green-800',
      'normativas': 'bg-purple-100 text-purple-800',
      'certificados': 'bg-orange-100 text-orange-800',
      'seguros': 'bg-red-100 text-red-800'
    };
    
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDownload = (documentId: string, documentName: string) => {
    // Simulate download
    console.log(`Downloading document: ${documentName}`);
    // In real implementation, this would trigger the actual download
  };

  const handleView = (documentId: string, documentName: string) => {
    // Simulate view in new tab
    console.log(`Viewing document: ${documentName}`);
    // In real implementation, this would open the document viewer
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Documentos</h1>
        <p className="text-muted-foreground">
          Accede a todos tus documentos relacionados con {user?.role === 'inquilino' ? 'tu contrato y vivienda' : 'tus propiedades'}
        </p>
      </div>

      {/* Property Info for tenants */}
      {user?.role === 'inquilino' && (
        <PropertyInfo />
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="contractual">Contractual</SelectItem>
                  <SelectItem value="inventario">Inventario</SelectItem>
                  <SelectItem value="normativas">Normativas</SelectItem>
                  <SelectItem value="certificados">Certificados</SelectItem>
                  <SelectItem value="seguros">Seguros</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="inventory">Inventario</SelectItem>
                  <SelectItem value="rules">Normativas</SelectItem>
                  <SelectItem value="certificate">Certificado</SelectItem>
                  <SelectItem value="insurance">Seguro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{doc.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {getTypeBadge(doc.type)}
                      <Badge className={getCategoryColor(doc.category)}>
                        {doc.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span className="truncate">{doc.property}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{doc.date}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownload(doc.id, doc.name)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleView(doc.id, doc.name)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron documentos</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all" || typeFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No tienes documentos disponibles"
                  }
                </p>
                {searchTerm || categoryFilter !== "all" || typeFilter !== "all" ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                      setTypeFilter("all");
                    }}
                  >
                    Limpiar filtros
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Información sobre documentos</h4>
              <p className="text-sm text-muted-foreground">
                Todos los documentos están organizados por propiedad y categoría. 
                Si necesitas un documento específico que no encuentras aquí, 
                contacta con tu gestor de propiedades.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}