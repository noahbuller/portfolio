"use client";

import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ctas } from "@/data/ctas";
import { SocialSvg } from "@/components/icons";
import { SkyLayer } from "./SkyLayer";
import { SkylineLayer } from "./SkylineLayer";
import { MidgroundLayer } from "./MidgroundLayer";
import { ForegroundLayer } from "./ForegroundLayer";
import { ParallaxLayer } from "./ParallaxLayer";
import { Billboard } from "./Billboard";
import { TrafficLayer } from "./TrafficLayer";
import { PlaneLayer } from "./PlaneLayer";
import styles from "./CityScene.module.css";

const BILLBOARD_TILE = 2400;

export function CityScene() {
  // Slowed to 50% of the original 70px/s.
  const { registerLayer } = useAutoScroll({ pixelsPerSecond: 35 });

  const renderBillboards = (decorative: boolean) => (
    <div className={styles.billboardTile} style={{ width: BILLBOARD_TILE }}>
      <div className={`${styles.slot} ${styles.slotElevated}`} style={{ left: 300 }}>
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

      <div className={styles.slot} style={{ left: 1150 }}>
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

      <div className={`${styles.slot} ${styles.slotElevated}`} style={{ left: 1950 }}>
        <Billboard
          decorative={decorative}
          variant="lime"
          mount="building"
          href={ctas.social[0]?.href ?? "#"}
          external
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

      <div className={styles.heroTitle} aria-hidden="true">
        <span className={styles.heroName}>{ctas.hero.label}</span>
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

      <div className={styles.road} aria-hidden="true">
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
