"use client";

import { useCallback, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ctas } from "@/data/ctas";
import ProfileCard from "./ProfileCard";
import { AboutContent } from "./AboutContent";
import styles from "./AboutFlipCard.module.css";

const COASTAL_GRADIENT =
  "linear-gradient(145deg, rgba(13, 59, 102, 0.55) 0%, rgba(42, 157, 143, 0.35) 100%)";

const INTERACTIVE_SELECTOR = "button, a, input, textarea, select, [data-no-flip]";

/** Flippable card — React Bits profile on front, resume details on back. Click the card to flip. */
export function AboutFlipCard() {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const handleCardClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) return;
      toggleFlip();
    },
    [toggleFlip],
  );

  const handleContactClick = useCallback(() => {
    window.location.href = ctas.contact.href;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleFlip();
      }
    },
    [toggleFlip],
  );

  return (
    <div className={styles.root}>
      <h2 id="about-title" className={styles.srOnly}>
        About Noah Buller
      </h2>

      <div
        className={`${styles.scene} ${flipped ? styles.flipped : ""}`}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipped ? "Show profile card" : "Show about details"}
      >
        <div className={styles.inner}>
          <div className={`${styles.face} ${styles.front}`} aria-hidden={flipped}>
            <ProfileCard
              name={ctas.hero.label}
              title={ctas.hero.subtitle}
              handle="noahbuller"
              status="Open to work"
              contactText="Contact"
              avatarUrl="/assets/profile/avatar.png"
              iconUrl="/assets/profile/iconpattern.png"
              grainUrl="/assets/profile/grain.png"
              showUserInfo
              enableTilt={!flipped}
              enableMobileTilt={false}
              onContactClick={handleContactClick}
              behindGlowEnabled
              behindGlowColor="rgba(255, 209, 102, 0.55)"
              innerGradient={COASTAL_GRADIENT}
              className={styles.profileCard}
            />
          </div>

          <div className={`${styles.face} ${styles.back}`} aria-hidden={!flipped}>
            <div className={styles.backPanel}>
              <AboutContent />
            </div>
          </div>
        </div>
      </div>

      <p className={styles.flipHint} aria-hidden="true">
        {flipped ? "Tap card to return to profile" : "Tap card for details"}
      </p>
    </div>
  );
}
