"use client";

import assert from "assert";
import React, { useEffect, useMemo, useState } from "react";

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
    name: string;
    amount: number;
    date: Date;
    radius: number;
    x: number;
    y: number;
    childs: Donor[];
    childsIsFull: boolean;
  }
  const donors = useMemo<Donor[]>(() => {
    const donors: Donor[] = [
      {
        name: "Donor ",
        amount: Math.floor(250),
        date: new Date(),
        childs: [],
        x: 0,
        y: 0,
        radius: 0,
        childsIsFull: false,
      },

      {
        name: "Donor ",
        amount: Math.floor(50),
        date: new Date(),
        childs: [],
        x: 0,
        y: 0,
        radius: 0,
        childsIsFull: false,
      },
    ];

    for (let i = 0; i < 1400; i++) {
      donors.push({
        name: "Donor " + (i + 1),
        amount: Math.floor(15 * Math.random()),
        date: new Date(),
        childs: [],
        x: 0,
        y: 0,
        radius: 0,
        childsIsFull: false,
      });
    }

    return donors
      .sort((a, b) => b.amount - a.amount)
      .map(
        (donor) =>
          ({
            ...donor,
            childs: [],
            x: 0,
            y: 0,
            radius: 0,
            childsIsFull: false,
          }) satisfies Donor,
      );
  }, []);

  const totalDonated = useMemo(
    () => donors.reduce((sum, donor) => sum + donor.amount, 0),
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
      donor.radius = donationBubbleRadius(donor.amount);
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
              key={donor.name}
              className="absolute  p-1"
              style={{
                width: `${donor.radius * 2}px`,
                height: `${donor.radius * 2}px`,
                top: `-${donor.radius}px`,
                borderRadius: `100%`,
                left: `-${donor.radius}px`,
                transform: `translate(${donor.x}px, ${donor.y}px)`,
              }}
            >
              <div
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-[1.03]"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                }}
              >
                <div>{donor.name}</div>
                <div>{donor.amount}€</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
