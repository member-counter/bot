"use client";

import assert from "assert";
import { useEffect, useMemo, useState } from "react";

import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import { Donor } from "./Donor";

interface DonorBubble {
  donor: RouterOutputs["donor"]["geAllDonors"][number];
  radius: number;
  x: number;
  y: number;
  childs: DonorBubble[];
}

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
  const donorsQuery = api.donor.geAllDonors.useQuery();

  const donors = useMemo<DonorBubble[]>(() => {
    const donors: DonorBubble[] = (donorsQuery.data ?? []).map((donor) => ({
      donor,
      radius: 10,
      x: 0,
      y: 0,
      childs: [],
    }));

    return donors.sort(
      (a, b) =>
        b.donor.donations.reduce((a, c) => Number(c.value) + a, 0) -
        a.donor.donations.reduce((a, c) => Number(c.value) + a, 0),
    );
  }, [donorsQuery.data]);

  const totalDonated = useMemo(
    () =>
      donors.reduce(
        (sum, { donor }) =>
          sum + donor.donations.reduce((a, c) => Number(c.value) + a, 0),
        0,
      ),
    [donors],
  );
  const processedDonors = useMemo(() => {
    const processedDonors = structuredClone(donors);

    const donationBubbleRadius = (value: bigint) => {
      const radius = (Number(value) / totalDonated) * (totalDonated * 4);
      if (radius > 0.15 * screenSize[0]) {
        return screenSize[0] * 0.15;
      }
      if (radius < 0.01 * screenSize[0]) {
        return 0.01 * screenSize[0];
      } else {
        return radius;
      }
    };

    processedDonors.forEach((bubble) => {
      bubble.radius = donationBubbleRadius(
        bubble.donor.donations.reduce((a, c) => c.value + a, 0n),
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

      return d < rDiff || d < rSum || d === rSum || d === rDiff;
    }

    const getNewPosition = (
      parent: DonorBubble,
      child: DonorBubble,
      angle: number,
    ): { x: number; y: number } => {
      const distance = parent.radius + child.radius + 1;
      return {
        x: parent.x + distance * Math.cos(angle),
        y: parent.y + distance * Math.sin(angle),
      };
    };

    const leftLimit = -screenSize[0] / 2;
    const rightLimit = screenSize[0] / 2;
    const topLimit = -screenSize[1] / 2;
    const steps = 18;
    const stepSize = (2 * Math.PI) / steps;
    let clockwise = true;

    const findSpaceForDonor = (
      newChild: DonorBubble,
    ): { parent: DonorBubble; x: number; y: number } | undefined => {
      for (const donor of processedDonors) {
        for (let step = 0; step < steps; step++) {
          clockwise = !clockwise;

          let angle = step * stepSize;

          if (clockwise) {
            angle += Math.PI;
          }

          const newPosition = getNewPosition(donor, newChild, angle);

          if (
            newPosition.x - newChild.radius < leftLimit ||
            newPosition.x + newChild.radius > rightLimit ||
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

  return (
    <div className="flex grow items-center justify-center">
      <div className="relative m-2 transition-all">
        {processedDonors.map(({ donor, radius, x, y }) => {
          return (
            <div
              tabIndex={0}
              key={donor.user.id}
              className="absolute p-1"
              style={{
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                top: `-${radius}px`,
                borderRadius: `100%`,
                left: `-${radius}px`,
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <Donor
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full bg-cover bg-center bg-no-repeat transition-transform hover:scale-[1.03]"
                donor={donor}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
