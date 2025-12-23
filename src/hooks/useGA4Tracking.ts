/**
 * GA4 Event Tracking Hook
 * Tracks clicks on the 4 main CTAs:
 * - valora_tu_piso_gratis
 * - empieza_ahora
 * - quiero_inscribirme
 * - agenda_llamada
 */

type CTAType = 'valora_tu_piso_gratis' | 'empieza_ahora' | 'quiero_inscribirme' | 'agenda_llamada';

interface TrackCTAParams {
  ctaType: CTAType;
  location: string;
  destination?: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackCTAClick = ({ ctaType, location, destination }: TrackCTAParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'CTA',
      event_label: ctaType,
      cta_type: ctaType,
      cta_location: location,
      destination_url: destination || '',
    });
  }
  
  // Also log to console in development
  if (import.meta.env.DEV) {
    console.log('[GA4 Track]', { ctaType, location, destination });
  }
};

export const useGA4Tracking = () => {
  const trackValoraTuPiso = (location: string, destination?: string) => {
    trackCTAClick({ ctaType: 'valora_tu_piso_gratis', location, destination });
  };

  const trackEmpiezaAhora = (location: string, destination?: string) => {
    trackCTAClick({ ctaType: 'empieza_ahora', location, destination });
  };

  const trackQuieroInscribirme = (location: string, destination?: string) => {
    trackCTAClick({ ctaType: 'quiero_inscribirme', location, destination });
  };

  const trackAgendaLlamada = (location: string, destination?: string) => {
    trackCTAClick({ ctaType: 'agenda_llamada', location, destination });
  };

  return {
    trackValoraTuPiso,
    trackEmpiezaAhora,
    trackQuieroInscribirme,
    trackAgendaLlamada,
    trackCTAClick,
  };
};
