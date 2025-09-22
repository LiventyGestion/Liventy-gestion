import { useEffect, useState } from "react";

const ComparisonTable = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const footer = document.querySelector('footer');
    if (footer) observer.observe(footer);

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const handleCTAClick = () => {
    // GA4 tracking via dataLayer
    if (typeof (window as any).dataLayer !== 'undefined') {
      (window as any).dataLayer.push({
        event: 'cta_click',
        cta_id: 'cta_sticky_comparativa',
        page: location.pathname
      });
    }
    
    // Navigate to valuation page
    window.location.href = '/herramientas?calc=precio';
  };

  const comparisonData = [
    {
      label: "Difusión",
      soloYou: { text: "Limitada", status: false },
      liventy: { text: "Multicanal", status: true }
    },
    {
      label: "Papeleo",
      soloYou: { text: "A tu cargo", status: false },
      liventy: { text: "Nos encargamos", status: true }
    },
    {
      label: "Tiempo",
      soloYou: { text: "Horas/semana", status: false },
      liventy: { text: "Delegado", status: true }
    },
    {
      label: "Selección de inquilinos",
      soloYou: { text: "Sin scoring", status: false },
      liventy: { text: "Verificación y scoring", status: true }
    },
    {
      label: "Firma",
      soloYou: { text: "Presencial", status: false },
      liventy: { text: "Digital", status: true }
    },
    {
      label: "Atención incidencias",
      soloYou: { text: "Reactiva", status: false },
      liventy: { text: "Ágil y trazada", status: true }
    }
  ];

  const styles = {
    section: {
      background: '#fff',
      padding: '64px 16px',
      color: '#323232',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px',
    },
    kicker: {
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase' as const,
      color: '#666',
      margin: '0 0 8px',
      fontSize: '0.875rem',
    },
    title: {
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      lineHeight: 1.2,
      margin: 0,
      fontWeight: 700,
      color: '#323232',
    },
    tableWrap: {
      overflow: 'auto',
      border: '1px solid #E6E6E6',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      background: 'white',
      transition: 'all 0.3s ease',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate' as const,
      borderSpacing: 0,
    },
    thead: {
      fontWeight: 700,
      textAlign: 'center' as const,
      padding: '20px 16px',
      background: '#F7F7F7',
      borderBottom: '2px solid #E6E6E6',
      color: '#323232',
      fontSize: '1rem',
    },
    theadFirst: {
      textAlign: 'left' as const,
      borderTopLeftRadius: '20px',
    },
    theadLast: {
      borderTopRightRadius: '20px',
    },
    td: {
      padding: '24px 20px',
      verticalAlign: 'middle' as const,
      textAlign: 'center' as const,
    },
    thFeature: {
      width: '44%',
      fontWeight: 600,
      color: '#323232',
      textAlign: 'left' as const,
      padding: '24px 20px',
      verticalAlign: 'middle' as const,
    },
    flag: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      marginBottom: '8px',
      transition: 'all 0.3s ease',
    },
    flagYes: {
      background: 'rgba(230, 126, 15, 0.15)',
      color: '#0A7A31',
      border: '2px solid rgba(230, 126, 15, 0.3)',
    },
    flagNo: {
      background: '#fff',
      color: '#B00020',
      border: '2px solid #E6E6E6',
    },
    note: {
      color: '#3a3a3a',
      fontSize: '0.95rem',
      fontWeight: 500,
      display: 'block',
    },
    stickyCtaMobile: {
      position: 'fixed' as const,
      left: 0,
      right: 0,
      bottom: 0,
      display: isMobile && !isFooterVisible ? 'block' : 'none',
      padding: '16px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 20%, #fff 50%)',
      zIndex: 9999,
      borderTop: '1px solid #E6E6E6',
      backdropFilter: 'blur(10px)',
    },
    stickyBtn: {
      display: 'block',
      textAlign: 'center' as const,
      background: '#E67E0F',
      color: '#fff',
      padding: '16px 24px',
      borderRadius: '16px',
      fontWeight: 700,
      textDecoration: 'none',
      boxShadow: '0 8px 32px rgba(230, 126, 15, 0.4)',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      fontSize: '1.1rem',
    },
    srOnly: {
      position: 'absolute' as const,
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      whiteSpace: 'nowrap' as const,
      border: 0,
    }
  };

  return (
    <>
      <section style={styles.section} aria-labelledby="cmp-title">
        <div style={styles.container}>
          <header style={styles.header}>
            <p style={styles.kicker}>Comparativa</p>
            <h2 id="cmp-title" style={styles.title}>Tú solo vs. Liventy</h2>
          </header>

          <div 
            style={styles.tableWrap} 
            role="region" 
            aria-labelledby="cmp-title"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
            }}
          >
            <table style={styles.table}>
              <caption style={styles.srOnly}>
                Comparativa de servicios entre gestionarlo tú solo y Liventy
              </caption>
              <thead>
                <tr>
                  <th scope="col" style={{...styles.thead, ...styles.theadFirst}}>Aspecto</th>
                  <th scope="col" style={styles.thead}>Tú solo</th>
                  <th scope="col" style={{...styles.thead, ...styles.theadLast}}>Liventy</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr 
                    key={index}
                    style={{
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      background: index % 2 === 1 ? '#F7F7F7' : 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f9ff';
                      e.currentTarget.style.transform = 'scale(1.01)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 126, 15, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 1 ? '#F7F7F7' : 'white';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <th scope="row" style={styles.thFeature}>{row.label}</th>
                    <td style={styles.td} data-label="Tú solo">
                      <div
                        style={{...styles.flag, ...styles.flagNo}}
                        aria-label="No"
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"/>
                        </svg>
                        <span style={styles.srOnly}>No</span>
                      </div>
                      <span style={styles.note}>{row.soloYou.text}</span>
                    </td>
                    <td style={styles.td} data-label="Liventy">
                      <div
                        style={{...styles.flag, ...styles.flagYes}}
                        aria-label="Sí"
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="currentColor" d="M9 16.17 4.83 12A1 1 0 1 0 3.41 13.41l5.3 5.29a1 1 0 0 0 1.41 0l10.17-10.17a1 1 0 0 0-1.41-1.41Z"/>
                        </svg>
                        <span style={styles.srOnly}>Sí</span>
                      </div>
                      <span style={styles.note}>{row.liventy.text}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sticky CTA for mobile */}
        <div style={styles.stickyCtaMobile} role="region" aria-label="Acción rápida">
          <button
            onClick={handleCTAClick}
            style={styles.stickyBtn}
            data-analytics="cta_sticky_comparativa"
            aria-label="Valora tu piso gratis - ir a calculadora de valoración"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(230, 126, 15, 0.5)';
              e.currentTarget.style.background = '#d16e00';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(230, 126, 15, 0.4)';
              e.currentTarget.style.background = '#E67E0F';
            }}
          >
            Valora tu piso gratis
          </button>
        </div>
      </section>

      {/* Add bottom padding when sticky CTA is visible */}
      {isMobile && !isFooterVisible && (
        <div style={{ height: '100px' }} aria-hidden="true" />
      )}
    </>
  );
};

export default ComparisonTable;