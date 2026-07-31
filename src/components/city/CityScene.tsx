"use client";

import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ctas } from "@/data/ctas";
import { SocialSvg } from "@/components/icons";
import {
  FOREGROUND_TILE_WIDTH,
  GROUND,
  getForegroundBuildings,
} from "@/data/cityBuildings";
import { ROAD_HEIGHT_VH } from "./roadGeometry";
import { SkyLayer } from "./SkyLayer";
import { CloudLayer } from "./CloudLayer";
import { SunMoonToggle } from "./SunMoonToggle";
import { SkylineLayer } from "./SkylineLayer";
import { MidgroundLayer } from "./MidgroundLayer";
import { ForegroundLayer } from "./ForegroundLayer";
import { ParallaxLayer } from "./ParallaxLayer";
import { Billboard } from "./Billboard";
import { TrafficLayer } from "./TrafficLayer";
import { PlaneLayer } from "./PlaneLayer";
import styles from "./CityScene.module.css";

// The billboard tile must scroll in lockstep with the foreground buildings
// tile (both registered at speed=1) so a billboard's `left` offset always
// lands on the same building — sharing this width keeps them permanently
// in phase instead of drifting apart every lcm(tileA, tileB) pixels.
const BILLBOARD_TILE = FOREGROUND_TILE_WIDTH;

// Buildings each billboard is pinned to, by index into getForegroundBuildings().
const BUILDINGS = getForegroundBuildings();
const billboardLeft = (buildingIndex: number) => {
  const b = BUILDINGS[buildingIndex];
  return Math.round(b.x + b.w / 2);
};

// Building-mounted signs rest directly on their target building's actual
// roofline. `.foreground` renders at a fixed pixel height (GROUND), while
// `.billboards` is offset 3vh from the scene bottom — the calc() cancels
// that offset out so the sign lands exactly at (GROUND - building.top),
// the same coordinate space the foreground SVG itself uses.
const billboardBottom = (buildingIndex: number) => {
  const b = BUILDINGS[buildingIndex];
  return `calc(${GROUND - b.top}px - 3vh)`;
};

export function CityScene() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { registerLayer } = useAutoScroll({
    pixelsPerSecond: isMobile ? 22 : 35,
  });

  const renderBillboards = (decorative: boolean) => (
    <div className={styles.billboardTile} style={{ width: BILLBOARD_TILE }}>
      <div
        className={styles.slot}
        style={{ left: billboardLeft(2), bottom: billboardBottom(2) }}
      >
        <Billboard
          decorative={decorative}
          variant="cyan"
          mount="building"
          href={ctas.resume.href}
          download={ctas.resume.download}
          eyebrow="On screen now"
          title={ctas.resume.label}
          subtitle="Download CV (PDF)"
        />
      </div>

      <div
        className={styles.slot}
        style={{ left: billboardLeft(6), bottom: billboardBottom(6) }}
      >
        <Billboard
          decorative={decorative}
          mode="action"
          action="experience"
          variant="lime"
          mount="building"
          eyebrow="Career path"
          title="Experience"
          subtitle="Internships & Education"
        />
      </div>

      <div className={styles.slot} style={{ left: billboardLeft(9) }}>
        <Billboard
          decorative={decorative}
          variant="coral"
          mount="ground"
          href={ctas.contact.href}
          eyebrow="Let's talk"
          title={ctas.contact.label}
          subtitle="Say hello"
        />
      </div>

      <div
        className={styles.slot}
        style={{ left: billboardLeft(12), bottom: billboardBottom(12) }}
      >
        <Billboard
          decorative={decorative}
          mode="group"
          variant="lime"
          mount="building"
          eyebrow="Find me"
          title="Social"
        >
          {ctas.social.map((s) => (
            <a
              key={s.label}
              className={styles.socialChip}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              aria-hidden={decorative || undefined}
              tabIndex={decorative ? -1 : undefined}
            >
              <SocialSvg name={s.icon} />
            </a>
          ))}
        </Billboard>
      </div>
    </div>
  );

  return (
    <div className={styles.scene}>
      <SkyLayer />

      <ParallaxLayer
        speed={0.08}
        register={registerLayer}
        className={styles.clouds}
        renderTile={() => <CloudLayer />}
      />

      <SunMoonToggle />

      <div className={styles.heroTitle} aria-hidden="true">
        <span className={`${styles.heroName} font-display`}>
          {ctas.hero.label}
        </span>
        <span className={styles.heroSubtitle}>{ctas.hero.subtitle}</span>
      </div>

      <ParallaxLayer
        speed={0.18}
        register={registerLayer}
        className={styles.skyline}
        renderTile={() => <SkylineLayer />}
      />

      <ParallaxLayer
        speed={0.45}
        register={registerLayer}
        className={styles.midground}
        renderTile={() => <MidgroundLayer />}
      />

      <div className={styles.sunReflection} aria-hidden="true" />

      <ParallaxLayer
        speed={1}
        register={registerLayer}
        className={styles.foreground}
        renderTile={() => <ForegroundLayer />}
      />

      <div
        className={styles.road}
        aria-hidden="true"
        style={{ "--road-height-vh": ROAD_HEIGHT_VH } as React.CSSProperties}
      >
        <div className={styles.roadLine} />
      </div>

      <TrafficLayer />

      <ParallaxLayer
        speed={1}
        register={registerLayer}
        className={styles.billboards}
        renderTile={renderBillboards}
      />

      <PlaneLayer />
    </div>
  );
}
