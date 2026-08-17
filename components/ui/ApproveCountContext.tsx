"use client";

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

type ApproveCountState = [number, Dispatch<SetStateAction<number>>];

const ApproveCountContext = createContext<ApproveCountState | null>(null);

export function ApproveCountProvider({ children }: { children: React.ReactNode }) {
  const state = useState(0);
  return (
    <ApproveCountContext.Provider value={state}>{children}</ApproveCountContext.Provider>
  );
}

export function useApproveCount(): ApproveCountState {
  const ctx = useContext(ApproveCountContext);
  if (!ctx) {
    throw new Error("useApproveCount must be used within ApproveCountProvider");
  }
  return ctx;
}
