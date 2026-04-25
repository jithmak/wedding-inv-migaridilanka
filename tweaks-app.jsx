// Tweaks app for the wedding invitation
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "bgColor": "#e9dff5",
  "plumColor": "#3d2966",
  "accentColor": "#8b6db5",
  "starColor": "#ffffff",
  "starGlow": "#c4a8e2",
  "starCount": 22,
  "starSize": 18,
  "starsOn": true,
  "headingFont": "Dancing Script",
  "showCountdown": true,
  "showMap": true,
  "rsvpDeadline": "Kindly RSVP by May 25, 2026",
  "whatsappNumber": "94000000000"
}/*EDITMODE-END*/;

const HEADING_FONTS = [
  'Dancing Script',
  'Great Vibes',
  'Cormorant Garamond',
  'Pinyon Script',
  'Allura',
  'Sacramento'
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply CSS variable overrides
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--bg-lavender', t.bgColor);
    r.setProperty('--plum', t.plumColor);
    r.setProperty('--gold', t.accentColor);
  }, [t.bgColor, t.plumColor, t.accentColor]);

  // Heading font swap
  useEffect(() => {
    const id = 'tweak-font-link';
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const fam = t.headingFont.replace(/ /g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${fam}:wght@400;500;600;700&display=swap`;

    let style = document.getElementById('tweak-font-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'tweak-font-style';
      document.head.appendChild(style);
    }
    style.textContent = `
      .script-hero, .arch-names, .arch-amp, .rsvp-title,
      .footer-names, .section-title, .intro-save, .intro-date-script {
        font-family: '${t.headingFont}', cursive, serif !important;
      }
    `;
  }, [t.headingFont]);

  // Stars rebuild
  useEffect(() => {
    if (!window.__starConfig) return;
    Object.keys(window.__starConfig).forEach(k => {
      window.__starConfig[k].color = t.starColor;
      window.__starConfig[k].glow = t.starGlow;
      window.__starConfig[k].sizeMax = Number(t.starSize);
      window.__starConfig[k].sizeMin = Math.max(4, Number(t.starSize) - 12);
    });
    window.__starConfig.intro.count    = Number(t.starCount);
    window.__starConfig.countdown.count= Math.max(6, Math.round(t.starCount * 0.6));
    window.__starConfig.rsvp.count     = Math.max(8, Math.round(t.starCount * 0.8));
    if (window.rebuildAllStars) window.rebuildAllStars();
    document.querySelectorAll('.star-field').forEach(el => {
      el.style.display = t.starsOn ? '' : 'none';
    });
  }, [t.starColor, t.starGlow, t.starSize, t.starCount, t.starsOn]);

  // Sections visibility
  useEffect(() => {
    const cd = document.getElementById('countdown');
    const v  = document.getElementById('venue');
    if (cd) cd.style.display = t.showCountdown ? '' : 'none';
    if (v)  v.style.display  = t.showMap ? '' : 'none';
  }, [t.showCountdown, t.showMap]);

  // RSVP deadline + WhatsApp
  useEffect(() => {
    document.querySelectorAll('.rsvp-deadline').forEach(el => {
      const icon = el.querySelector('.material-icons-round');
      el.innerHTML = '';
      if (icon) el.appendChild(icon);
      el.appendChild(document.createTextNode(' ' + t.rsvpDeadline));
    });
  }, [t.rsvpDeadline]);

  useEffect(() => {
    const btn = document.querySelector('.whatsapp-btn');
    if (btn) {
      btn.href = `https://wa.me/94769397125?text=Hello%21%20I%20am%20confirming%20my%20attendance%20to%20Migari%20%26%20Dilanka%27s%20wedding%20on%20June%2011%2C%202026.`;
    }
  }, [t.whatsappNumber]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Colors" />
      <TweakColor label="Background" value={t.bgColor}
        onChange={(v) => setTweak('bgColor', v)} />
      <TweakColor label="Plum (text)" value={t.plumColor}
        onChange={(v) => setTweak('plumColor', v)} />
      <TweakColor label="Accent" value={t.accentColor}
        onChange={(v) => setTweak('accentColor', v)} />

      <TweakSection label="Stars" />
      <TweakToggle label="Show stars" value={t.starsOn}
        onChange={(v) => setTweak('starsOn', v)} />
      <TweakColor label="Star color" value={t.starColor}
        onChange={(v) => setTweak('starColor', v)} />
      <TweakColor label="Star glow" value={t.starGlow}
        onChange={(v) => setTweak('starGlow', v)} />
      <TweakSlider label="Star count" value={t.starCount}
        min={4} max={60} step={1}
        onChange={(v) => setTweak('starCount', v)} />
      <TweakSlider label="Star size" value={t.starSize} unit="px"
        min={8} max={32} step={1}
        onChange={(v) => setTweak('starSize', v)} />

      <TweakSection label="Typography" />
      <TweakSelect label="Heading font" value={t.headingFont}
        options={HEADING_FONTS}
        onChange={(v) => setTweak('headingFont', v)} />

      <TweakSection label="Sections" />
      <TweakToggle label="Countdown" value={t.showCountdown}
        onChange={(v) => setTweak('showCountdown', v)} />
      <TweakToggle label="Map" value={t.showMap}
        onChange={(v) => setTweak('showMap', v)} />

      <TweakSection label="RSVP" />
      <TweakText label="Deadline copy" value={t.rsvpDeadline}
        onChange={(v) => setTweak('rsvpDeadline', v)} />
      <TweakText label="WhatsApp number" value={t.whatsappNumber}
        onChange={(v) => setTweak('whatsappNumber', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
