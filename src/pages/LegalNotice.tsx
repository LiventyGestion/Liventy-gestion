import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold font-montserrat mb-4">Aviso Legal</h1>
            <p className="text-muted-foreground mb-8 font-lato">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">1. Datos Identificativos</h2>
                <p className="text-muted-foreground font-lato mb-4">
                  En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información 
                  y Comercio Electrónico, se informa de los datos identificativos del titular del sitio web:
                </p>
                <ul className="list-none space-y-2 text-muted-foreground font-lato">
                  <li><strong>Denominación social:</strong> Liventy Gestión S.L.</li>
                  <li><strong>NIF:</strong> B12345678</li>
                  <li><strong>Domicilio social:</strong> Calle Gran Vía, 1, 48001 Bilbao, Vizcaya</li>
                  <li><strong>Email:</strong> info@liventygestion.com</li>
                  <li><strong>Teléfono:</strong> +34 944 123 456</li>
                  <li><strong>Registro Mercantil:</strong> Inscrita en el Registro Mercantil de Vizcaya, Tomo XXX, Folio YYY, Hoja BI-ZZZZZ</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">2. Objeto</h2>
                <p className="text-muted-foreground font-lato">
                  El presente aviso legal regula el uso y utilización del sitio web www.liventygestion.com, del que es titular 
                  Liventy Gestión S.L. La navegación por el sitio web atribuye la condición de usuario del mismo e implica la 
                  aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">3. Condiciones de Uso</h2>
                <p className="text-muted-foreground font-lato mb-4">
                  El acceso y uso del sitio web se realiza bajo la exclusiva responsabilidad del usuario. El usuario se compromete a:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-lato">
                  <li>Hacer un uso adecuado y lícito del sitio web</li>
                  <li>No utilizar el sitio con fines o efectos ilícitos o contrarios a lo establecido en el presente Aviso Legal</li>
                  <li>No acceder o intentar acceder a recursos restringidos del sitio web</li>
                  <li>No provocar daños en los sistemas físicos o lógicos del sitio web</li>
                  <li>No introducir o difundir virus informáticos o cualesquiera otros sistemas que puedan causar daños</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">4. Propiedad Intelectual e Industrial</h2>
                <p className="text-muted-foreground font-lato">
                  Todos los contenidos del sitio web, incluyendo a título enunciativo pero no limitativo, textos, fotografías, 
                  gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una 
                  obra cuya propiedad pertenece a Liventy Gestión S.L., sin que puedan entenderse cedidos al usuario ninguno de 
                  los derechos de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso del sitio web.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">5. Exclusión de Garantías y Responsabilidad</h2>
                <p className="text-muted-foreground font-lato mb-4">
                  Liventy Gestión S.L. no se hace responsable, en ningún caso, de los siguientes extremos:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-lato">
                  <li>La continuidad de los contenidos del sitio web</li>
                  <li>La ausencia de errores en dichos contenidos</li>
                  <li>La ausencia de virus y/o demás componentes dañinos en el sitio web o en el servidor que lo suministra</li>
                  <li>La invulnerabilidad del sitio web y/o la inexpugnabilidad de las medidas de seguridad que se adopten</li>
                  <li>La falta de utilidad o rendimiento de los contenidos del sitio web</li>
                  <li>Los daños o perjuicios que cause, a sí mismo o a un tercero, cualquier persona que infringiera las condiciones de uso</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">6. Enlaces</h2>
                <p className="text-muted-foreground font-lato">
                  El sitio web puede incluir enlaces a otros sitios web. Liventy Gestión S.L. no ejerce ningún tipo de control 
                  sobre dichos sitios y contenidos. En ningún caso Liventy Gestión S.L. asumirá responsabilidad alguna por los 
                  contenidos de algún enlace perteneciente a un sitio web ajeno.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">7. Modificaciones</h2>
                <p className="text-muted-foreground font-lato">
                  Liventy Gestión S.L. se reserva el derecho de efectuar sin previo aviso las modificaciones que considere 
                  oportunas en su sitio web, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten 
                  a través de la misma como la forma en la que éstos aparezcan presentados o localizados.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">8. Legislación Aplicable y Jurisdicción</h2>
                <p className="text-muted-foreground font-lato">
                  La relación entre Liventy Gestión S.L. y el usuario se regirá por la normativa española vigente. 
                  Para la resolución de cualquier controversia las partes se someterán a los Juzgados y Tribunales de Bilbao, 
                  renunciando expresamente a cualquier otro fuero que pudiera corresponderles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">9. Contacto</h2>
                <p className="text-muted-foreground font-lato">
                  Para cualquier consulta relacionada con este aviso legal, puede contactarnos en:
                </p>
                <ul className="list-none space-y-2 text-muted-foreground font-lato mt-4">
                  <li><strong>Email:</strong> info@liventygestion.com</li>
                  <li><strong>Teléfono:</strong> +34 944 123 456</li>
                  <li><strong>Dirección:</strong> Calle Gran Vía, 1, 48001 Bilbao, Vizcaya</li>
                </ul>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default LegalNotice;
