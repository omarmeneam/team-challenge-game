import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import lottie from 'lottie-web';
import { useSelector } from 'react-redux';

const HelpAidEffects = ({ type, onComplete }) => {
  const { i18n } = useTranslation();
  const animationContainer = useRef(null);
  const isRTL = i18n.dir() === 'rtl';
  const currentTeam = useSelector(state => state.teams.currentTeam);

  useEffect(() => {
    let animation;

    const loadAnimation = async () => {
      try {
        // Load animation data based on aid type
        const animationPath = `/lottie/${type}.json`;
        const response = await fetch(animationPath);
        const animationData = await response.json();

        // Configure animation
        animation = lottie.loadAnimation({
          container: animationContainer.current,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData,
          rendererSettings: {
            progressiveLoad: true,
            preserveAspectRatio: 'xMidYMid slice',
            className: isRTL ? 'rtl' : 'ltr'
          }
        });

        // Handle animation completion
        animation.addEventListener('complete', () => {
          if (onComplete) onComplete();
        });

        // Add sound effect
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.volume = 0.5;
        await audio.play();

      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };

    loadAnimation();

    return () => {
      if (animation) {
        animation.destroy();
      }
    };
  }, [type, isRTL, onComplete]);

  // Get animation configuration based on aid type
  const getAnimationConfig = () => {
    const configs = {
      timeFreeze: {
        className: 'time-freeze-effect',
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1000,
          pointerEvents: 'none'
        }
      },
      fiftyFifty: {
        className: 'fifty-fifty-effect',
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          zIndex: 1000
        }
      },
      skip: {
        className: 'skip-effect',
        style: {
          position: 'absolute',
          top: '50%',
          left: isRTL ? 'auto' : '0',
          right: isRTL ? '0' : 'auto',
          transform: 'translateY(-50%)',
          width: '150px',
          height: '150px',
          zIndex: 1000
        }
      }
    };

    return configs[type] || {};
  };

  const { className, style } = getAnimationConfig();

  return (
    <div
      ref={animationContainer}
      className={`help-aid-effect ${className} ${isRTL ? 'rtl' : 'ltr'}`}
      style={style}
      data-team={currentTeam?.name}
      data-aid-type={type}
    />
  );
};

// Cooldown indicator component
export const CooldownIndicator = ({ type, duration, onComplete }) => {
  const { t } = useTranslation();
  const progressRef = useRef(null);

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progressRef.current) {
        progressRef.current.style.setProperty('--progress', progress);
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else if (onComplete) {
        onComplete();
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [duration, onComplete]);

  return (
    <div className="cooldown-indicator" ref={progressRef}>
      <div className="cooldown-label">
        {t(`helpAids.${type}Cooldown`)}
      </div>
      <div className="cooldown-progress" />
    </div>
  );
};

export default HelpAidEffects;