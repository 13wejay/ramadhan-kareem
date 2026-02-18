import { forwardRef } from 'react';
import { Insight } from '../services/insightService';
import { Quote, Moon } from 'lucide-react';

interface ShareInsightCardProps {
  insight: Insight;
}

export const typeColors: Record<string, string> = {
  hadith: '#D4A017',
  quran: '#52B788',
  names_of_allah: '#9B59B6',
  seerah: '#3498DB',
  ramadhan_fact: '#E67E22',
  dua: '#1B4332',
  quote: '#6B7280',
};

export const typeLabels: Record<string, string> = {
  hadith: 'Hadith',
  quran: 'Quran',
  names_of_allah: 'Divine Name',
  seerah: 'Seerah',
  ramadhan_fact: 'Did You Know?',
  dua: "Daily Du'a",
  quote: 'Quote',
};

const ShareInsightCard = forwardRef<HTMLDivElement, ShareInsightCardProps>(({ insight }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1920px',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '120px',
        textAlign: 'center',
        overflow: 'hidden',
        zIndex: -1000,
        fontFamily: '"Inter", sans-serif',
        background: 'linear-gradient(135deg, #fdfbf7 0%, #ebf5f0 50%, #f4f6f0 100%)',
      }}
    >
      {/* Background Blobs (Static for reliability) */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          backgroundColor: '#52b788',
          opacity: 0.2,
          filter: 'blur(150px)',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          backgroundColor: '#d4a017',
          opacity: 0.15,
          filter: 'blur(150px)',
        }}
      />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            borderRadius: '9999px',
            fontSize: '24px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'white',
            marginBottom: '40px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            backgroundColor: typeColors[insight.type] || '#6B7280',
          }}
        >
          {typeLabels[insight.type] || insight.type}
        </span>
        <h1 
          style={{
            fontFamily: 'serif',
            fontWeight: 'bold',
            color: '#1B4332',
            fontSize: '72px',
            lineHeight: 1.25,
            marginBottom: '32px',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          {insight.title}
        </h1>
        <div style={{ width: '128px', height: '8px', borderRadius: '9999px', backgroundColor: 'rgba(27, 67, 50, 0.2)', marginBottom: '32px' }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {insight.arabicText && (
          <div style={{ marginBottom: '80px', width: '100%' }}>
            <p 
              style={{
                fontSize: '68px',
                color: '#1B4332',
                lineHeight: 1.8,
                textAlign: 'center',
                fontFamily: '"Amiri", serif',
                direction: 'rtl',
                margin: '0 auto',
                maxWidth: '90%',
              }}
            >
              {insight.arabicText}
            </p>
          </div>
        )}

        {insight.translation && (
          <p 
            style={{
              fontSize: '42px',
              color: '#374151',
              lineHeight: 1.6,
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              marginBottom: '56px',
              maxWidth: '90%',
            }}
          >
            "{insight.translation}"
          </p>
        )}
        
        {!insight.arabicText && !insight.translation && insight.content && (
           <p 
            style={{
              fontSize: '42px',
              color: '#374151',
              lineHeight: 1.6,
              fontFamily: '"Playfair Display", serif',
              maxWidth: '90%',
            }}
           >
             {insight.content}
           </p>
        )}

        {insight.source && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '40px', opacity: 0.7 }}>
             <div style={{ width: '40px', height: '1px', background: '#1B4332' }} />
             <p 
              style={{
                fontSize: '26px',
                fontWeight: '600',
                color: '#1B4332',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              {insight.source}
            </p>
            <div style={{ width: '40px', height: '1px', background: '#1B4332' }} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          paddingBottom: '80px',
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '24px 56px',
            background: 'white',
            borderRadius: '100px',
            boxShadow: '0 20px 40px rgba(27, 67, 50, 0.08)',
            border: '1px solid rgba(27, 67, 50, 0.05)',
          }}
        >
          <span style={{ fontSize: '26px', fontWeight: '800', color: '#1B4332', letterSpacing: '0.08em', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: '1', marginTop: '-4px' }}>
            RAMADHAN COMPANION
          </span>
        </div>
        <p style={{ fontSize: '20px', color: '#6B7280', letterSpacing: '0.15em', fontWeight: '500', textTransform: 'uppercase' }}>
          www.ramadhan-companion.vercel.app
        </p>
      </div>
    </div>
  );
});

ShareInsightCard.displayName = 'ShareInsightCard';

export default ShareInsightCard;
