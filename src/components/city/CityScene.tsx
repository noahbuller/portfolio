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
import { SIDEWALK_MID, STREET_HEIGHT } from "@/data/street";
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
// roofline. Both `.foreground` and `.billboards` sit on the scene bottom and
// are sized in px, so a building's roof is (street + building height) up.
const billboardBottom = (buildingIndex: number) => {
  const b = BUILDINGS[buildingIndex];
  return STREET_HEIGHT + GROUND - b.top;
};

export function CityScene() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const scrollSpeed = isMobile ? 22 : 35;
  const { registerLayer } = useAutoScroll({ pixelsPerSecond: scrollSpeed });

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

      <div
        className={styles.slot}
        style={{ left: billboardLeft(9), bottom: SIDEWALK_MID }}
      >
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

      {/* Ground-anchored layers (fixed pixel heights) share one wrapper so a
          single `transform: scale()` can shrink them all uniformly on short
          viewports — see .groundScene in CityScene.module.css — instead of
          letting the tallest buildings/billboards clip above the viewport. */}
      <div className={styles.groundScene}>
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

        <TrafficLayer scrollSpeed={scrollSpeed} />

        <ParallaxLayer
          speed={1}
          register={registerLayer}
          className={styles.billboards}
          renderTile={renderBillboards}
        />
      </div>

      <PlaneLayer />
    </div>
  );
}
