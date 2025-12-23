// GA4 Analytics for Chatbot - Only fires with consent

interface DataLayerEvent {
  event: string;
  [key: string]: any;
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

// Check if analytics consent is granted
const hasAnalyticsConsent = (): boolean => {
  // Check for common consent management patterns
  if (typeof window === 'undefined') return false;
  
  // Check gtag consent state if available
  const consentState = (window as any).consentState;
  if (consentState?.analytics_storage === 'granted') return true;
  
  // Check for cookie consent
  const cookieConsent = document.cookie.includes('analytics_storage=granted');
  if (cookieConsent) return true;
  
  // Default: check localStorage for explicit consent
  const localConsent = localStorage.getItem('analytics_consent');
  return localConsent === 'granted';
};

// Get UTM parameters from URL
const getUTMParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
};

// Push event to dataLayer
const pushEvent = (eventName: string, eventParams: Record<string, any> = {}): void => {
  if (!hasAnalyticsConsent()) {
    console.log('📊 Analytics event blocked (no consent):', eventName);
    return;
  }
  
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  
  const event: DataLayerEvent = {
    event: eventName,
    ...eventParams,
    ...getUTMParams(),
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
  };
  
  window.dataLayer.push(event);
  console.log('📊 Analytics event pushed:', eventName, event);
};

// Chatbot Analytics Events
export const chatbotAnalytics = {
  // Chat opened
  chatOpen: () => {
    pushEvent('chat_open');
  },
  
  // Intent detected
  intentDetected: (intent: string, personaTipo?: string) => {
    pushEvent('intent_detected', { intent, persona_tipo: personaTipo });
  },
  
  // FAQ answered
  faqAnswered: (topic: string) => {
    pushEvent('faq_answered', { topic });
  },
  
  // Lead flow started
  leadStarted: (personaTipo: string) => {
    pushEvent('lead_started', { persona_tipo: personaTipo });
  },
  
  // Lead submitted
  leadSubmitted: (leadType: string, municipio?: string, score?: number) => {
    pushEvent('lead_submitted', { lead_type: leadType, municipio, score });
  },
  
  // Schedule booked
  scheduleBooked: (meetingType: string = 'intro_15') => {
    pushEvent('schedule_booked', { meeting_type: meetingType });
  },
  
  // WhatsApp clicked
  whatsappClick: () => {
    pushEvent('whatsapp_click');
  },
  
  // Fallback - no answer found
  fallbackNoAnswer: () => {
    pushEvent('fallback_noanswer');
  },
  
  // Quick reply clicked
  quickReplyClicked: (replyId: string, intent: string) => {
    pushEvent('quick_reply_clicked', { reply_id: replyId, intent });
  },
  
  // Consent given/denied
  consentResponse: (consented: boolean) => {
    pushEvent('consent_response', { consented });
  },
};

export default chatbotAnalytics;
