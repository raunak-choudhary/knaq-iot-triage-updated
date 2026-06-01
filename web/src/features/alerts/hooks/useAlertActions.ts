"use client";

import { useState } from "react";

interface AlertActionsState {
  isResolveOpen: boolean;
  isAssignOpen: boolean;
  openResolve: () => void;
  openAssign: () => void;
  closeAll: () => void;
}

export function useAlertActions(): AlertActionsState {
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  function openResolve() {
    setIsResolveOpen(true);
    setIsAssignOpen(false);
  }

  function openAssign() {
    setIsAssignOpen(true);
    setIsResolveOpen(false);
  }

  function closeAll() {
    setIsResolveOpen(false);
    setIsAssignOpen(false);
  }

  return { isResolveOpen, isAssignOpen, openResolve, openAssign, closeAll };
}
