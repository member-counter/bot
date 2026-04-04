import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChannelType } from "discord-api-types/v10";
import { useTranslation } from "react-i18next";

import { cn } from "@mc/ui";

import { api } from "~/lib/trpc";
import DSelector from "../../DSelector";
import { serverListColor } from "./colors";
import {
  DEPTH,
  SCREENSHOT_TILT_X,
  SCREENSHOT_TILT_Y,
  TILT_MAX_X,
  TILT_MAX_Y,
} from "./demoEffect";
import { DescriptionArea } from "./DescriptionArea";
import { ServerNavMenu } from "./ServerNavMenu";

declare global {
  interface Window {
    toggleScreenshotMode?: () => void;
  }
}

export function DiscordDemo({ heading }: { heading?: string }) {
  const { i18n } = useTranslation();

  const [mouseIsHovering, setMouseIsHovering] = useState(false);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [selectedChannelIndex, setSelectedChannelIndex] = useState(-1);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const demoServersQuery = api.demoServers.getAll.useQuery();
  const demoServers = useMemo(() => {
    const demoServers = [...(demoServersQuery.data ?? [])];
    return demoServers.sort((a, b) => {
      const aMatch = a.language === i18n.language ? 1 : 0;
      const bMatch = b.language === i18n.language ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
      return b.priority - a.priority;
    });
  }, [demoServersQuery.data, i18n.language]);

  const selectedServer = demoServers[selectedServerIndex];

  // Highlight counters on hover OR in screenshot mode
  const highlighted = mouseIsHovering || screenshotMode;

  useEffect(() => {
    window.toggleScreenshotMode = () => setScreenshotMode((s) => !s);
    return () => {
      delete window.toggleScreenshotMode;
    };
  }, [setScreenshotMode]);

  // Track mouse globally so tilt is gradual across the viewport — no jump on enter.
  const lastMouse = useRef({ x: 0, y: 0 });

  const updateTilt = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (lastMouse.current.x - centerX) / window.innerWidth;
    const y = (lastMouse.current.y - centerY) / window.innerHeight;

    setTilt({
      rotateY: x * TILT_MAX_Y,
      rotateX: y * -TILT_MAX_X,
    });
  }, []);

  useEffect(() => {
    if (screenshotMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
      updateTilt();
    };

    const handleScroll = () => updateTilt();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [screenshotMode, updateTilt]);

  useEffect(() => {
    if (!mouseIsHovering && !screenshotMode) {
      const serverSelection = setInterval(() => {
        let nextServer = selectedServerIndex + 1;
        if (nextServer === demoServers.length) nextServer = 0;
        setSelectedServerIndex(nextServer);
      }, 7 * 1000);
      return () => {
        clearInterval(serverSelection);
      };
    }
  }, [
    demoServers.length,
    mouseIsHovering,
    selectedServerIndex,
    screenshotMode,
  ]);

  useEffect(() => {
    if (!selectedServer) return;
    setSelectedChannelIndex(
      selectedServer.channels.findIndex(
        (channel) =>
          [ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(
            channel.type,
          ) && !channel.showAsSkeleton,
      ),
    );
  }, [selectedServer]);

  // Set static tilt when entering screenshot mode
  useEffect(() => {
    if (screenshotMode) {
      setTilt({ rotateY: SCREENSHOT_TILT_Y, rotateX: SCREENSHOT_TILT_X });
    } else {
      setTilt({ rotateX: 0, rotateY: 0 });
    }
  }, [screenshotMode]);

  if (!selectedServer)
    return (
      <div
        className={cn(
          "flex h-[550px] w-[1000px] animate-pulse overflow-hidden rounded-lg",
        )}
        style={{ backgroundColor: serverListColor }}
      ></div>
    );

  return (
    <div
      ref={containerRef}
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setMouseIsHovering(true)}
      onMouseLeave={() => setMouseIsHovering(false)}
      onFocus={() => setMouseIsHovering(true)}
      onBlur={() => setMouseIsHovering(false)}
    >
      {heading && (
        <h3
          className={cn(
            "mb-3 text-xl font-bold transition-all duration-300",
            screenshotMode ? "text-left" : "text-center",
          )}
          style={{
            transform: screenshotMode
              ? `rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`
              : undefined,
            transition: screenshotMode ? "transform 0.4s ease-out" : undefined,
          }}
        >
          {screenshotMode ? "Your server stats, always on display." : heading}
        </h3>
      )}
      <div
        className={cn(
          "flex h-[550px] w-[1000px] rounded-lg [clip-path:inset(0_round_0.5rem)]",
        )}
        style={{
          backgroundColor: serverListColor,
          transform: `rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`,
          transition: screenshotMode ? "transform 0.4s ease-out" : "none",
          transformStyle: "preserve-3d",
          boxShadow: highlighted
            ? `${-tilt.rotateY * DEPTH * 2.5}px ${tilt.rotateX * DEPTH * 2.5}px 60px rgba(0,0,0,0.5)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
        role="none"
        tabIndex={-1}
      >
        <DSelector
          pre={[]}
          guilds={demoServers.map((server, i) => ({
            ...server,
            isSelected: i === selectedServerIndex,
            onClick: () => setSelectedServerIndex(i),
          }))}
        />
        <ServerNavMenu
          demoServer={selectedServer}
          selectedChannelIndex={selectedChannelIndex}
          setSelectedChannelIndex={setSelectedChannelIndex}
          highlighted={highlighted}
          tilt={tilt}
        />
        <DescriptionArea
          demoServer={selectedServer}
          selectedChannelIndex={selectedChannelIndex}
          highlighted={highlighted}
          hideBody={screenshotMode}
          tilt={tilt}
        />
      </div>
    </div>
  );
}
