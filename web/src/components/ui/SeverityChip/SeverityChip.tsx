"use client";

import Chip from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";
import { SEVERITY_COLOR, SEVERITY_LABEL } from "@/constants/severity";
import type { Severity } from "@/features/alerts/types";

interface SeverityChipProps {
  severity: Severity;
  sx?: SxProps<Theme>;
}

export function SeverityChip({ severity, sx }: SeverityChipProps) {
  return (
    <Chip
      label={SEVERITY_LABEL[severity]}
      color={SEVERITY_COLOR[severity]}
      size="small"
      sx={{ fontWeight: 700, ...sx }}
    />
  );
}
