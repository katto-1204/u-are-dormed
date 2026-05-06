import { ReactNode } from "react";

export const PhoneFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-[390px]">
      <div className="relative overflow-hidden rounded-[2.75rem] border-[10px] border-foreground bg-background shadow-elevated">
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-foreground" />
        <div className="h-[820px] overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
};