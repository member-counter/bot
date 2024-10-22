"use client";

import assert from "assert";
import type { DiscordUser } from "@mc/validators/DiscordUser";
import React, { useEffect, useMemo, useState } from "react";

import { Donor } from "./Donor";

export function Donors() {
  const [screenSize, setScreenSize] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleResize = () =>
      setScreenSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  interface Donor {
    user: DiscordUser;
    donations: {
      note: string;
      amount: number;
      currency: string;
      anonymous: boolean;
      date: Date;
    }[];
    radius: number;
    x: number;
    y: number;
    childs: Donor[];
    childsIsFull: boolean;
  }

  const donors = useMemo<Donor[]>(() => {
    const donors: Donor[] = [];

    for (let i = 0; i < 25; i++) {
      donors.push({
        user: {
          id: `user-${i}`,
          username: `User ${i}`,
          discriminator: `${Math.floor(Math.random() * 10000)}`,
          avatar: `https://picsum.photos/seed/${i}/200/300`,
        },
        donations: [
          {
            amount: Math.floor(Math.random() * 15),
            currency: "USD",
            note: "Thank you!",
            anonymous: false,
            date: new Date(),
          },
          {
            amount: Math.floor(Math.random() * 15),
            currency: "USD",
            note: "Thank you!",
            anonymous: false,
            date: new Date(),
          },
        ],
        childs: [],
        x: 0,
        y: 0,
        radius: 0,
        childsIsFull: false,
      });
    }

    return donors.sort(
      (a, b) =>
        b.donations.reduce((a, c) => c.amount + a, 0) -
        a.donations.reduce((a, c) => c.amount + a, 0),
    );
  }, []);

  const totalDonated = useMemo(
    () =>
      donors.reduce(
        (sum, donor) => sum + donor.donations.reduce((a, c) => c.amount + a, 0),
        0,
      ),
    [donors],
  );
  const processedDonors = useMemo(() => {
    const processedDonors = structuredClone(donors);

    const donationBubbleRadius = (amount: number) => {
      const radius = (amount / totalDonated) * (totalDonated * 4);
      if (radius > 0.25 * screenSize[0]) {
        return screenSize[0] * 0.25;
      }
      if (radius < 0.01 * screenSize[0]) {
        return 0.01 * screenSize[0];
      } else {
        return radius;
      }
    };

    processedDonors.forEach((donor) => {
      donor.radius = donationBubbleRadius(
        donor.donations.reduce((a, c) => c.amount + a, 0),
      );
    });

    function circlesIntersect(
      x1: number,
      y1: number,
      r1: number,
      x2: number,
      y2: number,
      r2: number,
    ) {
      const d = Math.hypot(x2 - x1, y2 - y1);
      const rSum = r1 + r2;
      const rDiff = Math.abs(r1 - r2);

      return d === rSum || d === rDiff || d < rDiff || d < rSum;
    }

    const getNewPosition = (
      parent: Donor,
      child: Donor,
      angle: number,
    ): { x: number; y: number } => {
      const distance = parent.radius + child.radius + 1;
      return {
        x: parent.x + distance * Math.cos(angle),
        y: parent.y + distance * Math.sin(angle),
      };
    };

    const findSpaceForDonor = (
      newChild: Donor,
    ): { parent: Donor; x: number; y: number } | undefined => {
      const leftLimit = -screenSize[0] / 2;
      const rightLimit = screenSize[0] / 2;
      const topLimit = -screenSize[1] / 2;
      const radianQuarter = (Math.PI * 2) / 4;

      for (const donor of processedDonors) {
        if (donor.childsIsFull) continue;

        const steps = 25;

        for (let step = 0; step < steps; step++) {
          const angle = radianQuarter + ((2 * Math.PI) / steps) * step;
          const newPosition = getNewPosition(donor, newChild, angle);

          if (
            newPosition.x - newChild.radius * 2 < leftLimit ||
            newPosition.x + newChild.radius * 2 > rightLimit ||
            newPosition.y - newChild.radius * 2 < topLimit ||
            processedDonors.some((donor) =>
              circlesIntersect(
                donor.x,
                donor.y,
                donor.radius,
                newPosition.x,
                newPosition.y,
                newChild.radius,
              ),
            )
          ) {
            continue;
          }

          return { parent: donor, x: newPosition.x, y: newPosition.y };
        }

        donor.childsIsFull = true;
      }
    };

    processedDonors.forEach((donor, i) => {
      if (i === 0) return;

      const space = findSpaceForDonor(donor);

      assert(space);

      donor.x = space.x;
      donor.y = space.y;
      space.parent.childs.push(donor);
    });

    return processedDonors;
  }, [donors, screenSize, totalDonated]);

  // TODO fetch from db, modal to see donors, group donations by donor
  return (
    <div className="flex grow items-center justify-center">
      <div className="relative m-2 transition-all">
        {processedDonors.map((donor) => {
          return (
            <div
              key={donor.user.id}
              className="absolute p-1"
              style={{
                width: `${donor.radius * 2}px`,
                height: `${donor.radius * 2}px`,
                top: `-${donor.radius}px`,
                borderRadius: `100%`,
                left: `-${donor.radius}px`,
                transform: `translate(${donor.x}px, ${donor.y}px)`,
              }}
            >
              <Donor
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full bg-cover bg-center bg-no-repeat transition-transform hover:scale-[1.03]"
                user={donor.user}
                donations={donor.donations}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
