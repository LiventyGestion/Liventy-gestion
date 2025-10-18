import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold font-montserrat mb-4">Términos y Condiciones</h1>
            <p className="text-muted-foreground mb-8 font-lato">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">1. Aceptación de los Términos</h2>
                <p className="text-muted-foreground font-lato">
                  Al acceder y utilizar los servicios de Liventy Gestión, usted acepta estar sujeto a estos términos y condiciones, 
                  todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">2. Uso de Servicios</h2>
                <p className="text-muted-foreground font-lato mb-4">
                  Nuestros servicios están destinados a propietarios e inquilinos de propiedades residenciales. Al utilizar nuestros servicios, usted se compromete a:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-lato">
                  <li>Proporcionar información veraz y actualizada</li>
                  <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                  <li>Utilizar los servicios de manera legal y apropiada</li>
                  <li>No interferir con el funcionamiento de la plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">3. Servicios de Gestión</h2>
                <p className="text-muted-foreground font-lato">
                  Liventy Gestión ofrece servicios de gestión integral de propiedades, incluyendo pero no limitado a:
                  gestión de alquileres, mantenimiento, asesoramiento legal y atención al cliente. Los términos específicos
                  de cada servicio se detallarán en los contratos individuales.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">4. Responsabilidades</h2>
                <p className="text-muted-foreground font-lato mb-4">
                  Liventy Gestión se compromete a proporcionar servicios profesionales y de calidad. Sin embargo:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-lato">
                  <li>No nos hacemos responsables de daños causados por terceros</li>
                  <li>Los propietarios mantienen la responsabilidad final sobre sus propiedades</li>
                  <li>Actuamos como intermediarios en las relaciones contractuales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">5. Pagos y Facturación</h2>
                <p className="text-muted-foreground font-lato">
                  Los términos de pago se establecerán en los contratos individuales. Los servicios se facturarán según 
                  lo acordado, y los pagos deben realizarse en los plazos especificados. El retraso en los pagos puede 
                  resultar en la suspensión temporal de los servicios.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">6. Protección de Datos</h2>
                <p className="text-muted-foreground font-lato">
                  Cumplimos con el RGPD y la LOPDGDD. Para más información sobre cómo tratamos sus datos personales,
                  consulte nuestra Política de Privacidad.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">7. Modificaciones</h2>
                <p className="text-muted-foreground font-lato">
                  Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                  Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">8. Ley Aplicable</h2>
                <p className="text-muted-foreground font-lato">
                  Estos términos se rigen por las leyes de España. Cualquier disputa se someterá a la jurisdicción 
                  de los tribunales de Bilbao, Vizcaya.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold font-montserrat mt-8 mb-4">9. Contacto</h2>
                <p className="text-muted-foreground font-lato">
                  Para cualquier pregunta sobre estos términos y condiciones, puede contactarnos en:
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

export default TermsConditions;
