"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProgressBar
        height="3px"
        color="#d5510d"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  );
};

export default ProgressBarProvider;
