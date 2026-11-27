import { useEffect, useRef, useState } from 'react';
import { Expand, Film } from 'lucide-react';

export function DroneScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [fullscreenMessage, setFullscreenMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(document.fullscreenElement === sceneRef.current);
    document.addEventListener('fullscreenchange', updateFullscreen);
    return () => document.removeEventListener('fullscreenchange', updateFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    const scene = sceneRef.current;
    if (!scene) return;
    setFullscreenMessage(null);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (scene.requestFullscreen) await scene.requestFullscreen();
      else setFullscreenMessage('Le plein écran n’est pas pris en charge.');
    } catch {
      setFullscreenMessage('Impossible d’activer le plein écran sur cet appareil.');
    }
  };

  return (
    <section aria-labelledby="drone-scene-title" className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 id="drone-scene-title" className="text-sm font-bold text-white sm:text-base">
          Observer la scène
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-cyan-950/60 px-2.5 py-1 text-[0.65rem] font-semibold text-cyan-100">
          <Film className="h-3.5 w-3.5" aria-hidden="true" />
          Scène animée
        </span>
      </div>

      <div
        ref={sceneRef}
        className={`relative h-[145px] overflow-hidden rounded-2xl border border-[#078bff]/50 bg-[#071631] shadow-[0_0_18px_rgba(0,137,255,0.17)] sm:h-[185px] ${
          isFullscreen ? 'h-screen sm:h-screen' : ''
        }`}
      >
        <svg
          viewBox="0 0 1800 600"
          role="img"
          aria-labelledby="drone-scene-svg-title drone-scene-description"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <title id="drone-scene-svg-title">Toit d’hôpital sous une pluie battante</title>
          <desc id="drone-scene-description">
            Une scène animée montre un drone médical immobilisé près d’un colis en carton mouillé,
            sous la pluie, devant un hôpital avec une croix rouge.
          </desc>
          <defs>
            <linearGradient id="drone-scene-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#172c49" />
              <stop offset=".62" stopColor="#53677a" />
              <stop offset="1" stopColor="#9aabb4" />
            </linearGradient>
            <linearGradient id="drone-scene-roof" x1="0" x2=".9" y1="0" y2="1">
              <stop offset="0" stopColor="#566677" />
              <stop offset="1" stopColor="#1c2b3c" />
            </linearGradient>
            <linearGradient id="drone-scene-box" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#c99a61" />
              <stop offset=".58" stopColor="#90623f" />
              <stop offset="1" stopColor="#68472f" />
            </linearGradient>
            <linearGradient id="drone-scene-water" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#b5ecff" stopOpacity=".5" />
              <stop offset="1" stopColor="#3a88a9" stopOpacity=".15" />
            </linearGradient>
            <filter id="drone-scene-shadow" x="-.3" y="-.5" width="1.6" height="2">
              <feGaussianBlur stdDeviation="13" />
            </filter>
            <pattern id="drone-scene-rain" width="90" height="100" patternUnits="userSpaceOnUse">
              <path d="M12-18L-5 28M54 10L37 56M88 61L72 101" fill="none" stroke="#e1f4fb" strokeWidth="2.2" strokeLinecap="round" opacity=".58" />
              <animateTransform
                attributeName="patternTransform"
                type="translate"
                values="0 0;0 100"
                dur=".72s"
                repeatCount="indefinite"
              />
            </pattern>
          </defs>

          <rect width="1800" height="600" fill="url(#drone-scene-sky)" />
          <g opacity=".8">
            <path d="M0 130Q100 82 210 120T430 106T650 122T900 95T1160 118T1410 92T1800 116V240H0Z" fill="#26394e" />
            <path d="M0 180Q160 133 290 174T560 154T820 181T1090 150T1370 178T1600 147T1800 165V275H0Z" fill="#354a5b" />
            <animateTransform attributeName="transform" type="translate" values="-14 0;14 0;-14 0" dur="38s" repeatCount="indefinite" />
          </g>
          <path d="M0 233Q180 190 370 226T720 214T1050 234T1390 204T1800 222V315H0Z" fill="#70818a" opacity=".42" />

          <g stroke="#d8eff7" strokeWidth="3" strokeLinecap="round" opacity=".42">
            <path d="M104 180l-34 75M182 153l-31 70M302 197l-39 86M465 147l-34 76M570 188l-37 84M742 153l-34 78M866 196l-35 79M1011 155l-35 79M1180 192l-39 88M1317 146l-37 82M1495 188l-39 88M1669 151l-36 81M1765 196l-29 67M236 162l-29 67M386 185l-34 78M653 153l-31 72M937 187l-35 80M1115 154l-35 78M1391 172l-33 75M1577 145l-31 70" />
            <animateTransform attributeName="transform" type="translate" values="0 -55;-18 55" dur="1.05s" repeatCount="indefinite" />
          </g>

          <g>
            <rect x="1130" y="182" width="430" height="224" rx="8" fill="#d9e0e1" />
            <rect x="1180" y="112" width="284" height="88" rx="6" fill="#e2e8e8" />
            <rect x="1244" y="75" width="152" height="44" rx="4" fill="#cbd5d8" />
            <path d="M1180 188h380M1130 283h430" stroke="#aab9be" strokeWidth="6" />
            <g fill="#536c7d">
              <rect x="1160" y="220" width="48" height="42" rx="3" /><rect x="1230" y="220" width="48" height="42" rx="3" />
              <rect x="1300" y="220" width="48" height="42" rx="3" /><rect x="1370" y="220" width="48" height="42" rx="3" />
              <rect x="1440" y="220" width="48" height="42" rx="3" /><rect x="1510" y="220" width="35" height="42" rx="3" />
              <rect x="1160" y="306" width="48" height="52" rx="3" /><rect x="1230" y="306" width="48" height="52" rx="3" />
              <rect x="1300" y="306" width="48" height="52" rx="3" /><rect x="1370" y="306" width="48" height="52" rx="3" />
              <rect x="1440" y="306" width="48" height="52" rx="3" /><rect x="1510" y="306" width="35" height="52" rx="3" />
            </g>
            <rect x="1299" y="127" width="72" height="48" rx="5" fill="#f3f5f4" />
            <path d="M1326 133h18v13h13v13h-13v13h-18v-13h-13v-13h13Z" fill="#cf203c" />
            <rect x="1466" y="142" width="55" height="26" rx="5" fill="#becdd1" />
          </g>

          <path d="M0 368Q255 321 520 352T1040 347T1450 333T1800 354V600H0Z" fill="url(#drone-scene-roof)" />
          <path d="M0 372Q280 329 540 359T1060 352T1450 343T1800 359" fill="none" stroke="#a4b7c1" strokeWidth="8" opacity=".65" />
          <path d="M80 496Q190 474 300 492T512 484M1040 526Q1160 498 1277 522T1510 516" fill="none" stroke="url(#drone-scene-water)" strokeWidth="25" strokeLinecap="round" />
          <ellipse cx="244" cy="493" rx="55" ry="7" fill="none" stroke="#c9f5ff" strokeWidth="3" opacity=".65">
            <animate attributeName="rx" values="25;80;25" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".65;.05;.65" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1326" cy="520" rx="45" ry="6" fill="none" stroke="#c9f5ff" strokeWidth="3" opacity=".55">
            <animate attributeName="rx" values="20;72;20" dur="3.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".55;.04;.55" dur="3.8s" repeatCount="indefinite" />
          </ellipse>

          <g opacity=".75">
            <rect x="164" y="320" width="116" height="54" rx="6" fill="#435564" />
            <path d="M183 320v-24h77v24" fill="#71818a" stroke="#aebbc0" strokeWidth="5" />
            <rect x="1520" y="330" width="130" height="48" rx="5" fill="#425564" />
            <path d="M1542 330v-22h86v22" fill="#778891" stroke="#b1c2c7" strokeWidth="4" />
          </g>

          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 5;0 0" dur="2.8s" repeatCount="indefinite" />
            <ellipse cx="705" cy="404" rx="178" ry="21" fill="#06101d" opacity=".55" filter="url(#drone-scene-shadow)" />
            <path d="M560 326l96-31M850 326l-96-31M560 326l95 41M850 326l-96 41" stroke="#263541" strokeWidth="17" strokeLinecap="round" />
            <path d="M560 326l96-31M850 326l-96-31M560 326l95 41M850 326l-96 41" stroke="#9cafb9" strokeWidth="7" strokeLinecap="round" />
            <g fill="#283846" stroke="#aab9bf" strokeWidth="4">
              <ellipse cx="554" cy="317" rx="47" ry="11" /><ellipse cx="856" cy="317" rx="47" ry="11" />
              <ellipse cx="554" cy="385" rx="47" ry="11" /><ellipse cx="856" cy="385" rx="47" ry="11" />
            </g>
            <g stroke="#d7e3e7" strokeWidth="3" opacity=".8">
              <path d="M518 317h72M820 317h72M518 385h72M820 385h72" />
            </g>
            <g fill="#de6c42">
              <circle cx="554" cy="317" r="7" /><circle cx="856" cy="317" r="7" />
              <circle cx="554" cy="385" r="7" /><circle cx="856" cy="385" r="7" />
            </g>
            <path d="M661 323q44-26 88 0l-12 34q-32 15-64 0Z" fill="#344b5c" stroke="#c5d1d6" strokeWidth="5" />
            <path d="M678 328q27-16 54 0l-5 15q-22 11-44 0Z" fill="#77c9df" opacity=".85" />
            <circle cx="696" cy="333" r="4" fill="#e6f8fc" /><circle cx="713" cy="333" r="4" fill="#e6f8fc" />
            <path d="M691 359v18M719 359v18M673 377h64" stroke="#dce4e6" strokeWidth="5" strokeLinecap="round" />
            <path d="M705 374v19" stroke="#d8dfe0" strokeWidth="4" strokeDasharray="4 4" />

            <g>
              <path d="M661 393l44-16 46 17-3 71-43 16-44-18Z" fill="url(#drone-scene-box)" stroke="#4f3a29" strokeWidth="4" />
              <path d="M661 393l44 17 46-16M705 410v71" fill="none" stroke="#e1bd8d" strokeWidth="5" opacity=".78" />
              <path d="M675 405l19 8-7 34-16-8ZM725 404l15-6-4 38-17 8Z" fill="#314c59" opacity=".58" />
              <path d="M672 452q12-11 20 1t19 0M720 455q10-11 22-3" fill="none" stroke="#243d49" strokeWidth="8" opacity=".62" />
              <path d="M673 391q8 8 15 3t13 5M719 392q8-5 16 1" fill="none" stroke="#d8ecf1" strokeWidth="4" opacity=".58" />
              <path d="M692 482v13M714 483v16M735 475v12" stroke="#8ac4d2" strokeWidth="4" strokeLinecap="round">
                <animate attributeName="opacity" values=".2;.9;.2" dur="2.1s" repeatCount="indefinite" />
              </path>
            </g>
          </g>

          <rect width="1800" height="600" fill="url(#drone-scene-rain)" opacity=".34" pointerEvents="none" />
        </svg>

        <span className="pointer-events-none absolute left-2 top-2 rounded-full border border-white/15 bg-[#061535]/70 px-2.5 py-1 text-[0.6rem] font-semibold text-white/90 backdrop-blur">
          Pluie · toit de l’hôpital
        </span>
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/25 bg-[#061535]/75 text-white shadow-lg backdrop-blur transition hover:bg-[#087cf0]"
          aria-label={isFullscreen ? 'Quitter le plein écran' : 'Afficher la scène en plein écran'}
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>
      {fullscreenMessage && <p className="text-xs text-amber-200" role="status">{fullscreenMessage}</p>}
    </section>
  );
}
