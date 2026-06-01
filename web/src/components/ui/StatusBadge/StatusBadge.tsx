"use client";

import Chip from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";
import { STATUS_COLOR, STATUS_LABEL } from "@/constants/alertStatus";
import type { AlertStatus } from "@/features/alerts/types";

interface StatusBadgeProps {
  status: AlertStatus;
  sx?: SxProps<Theme>;
}

export function StatusBadge({ status, sx }: StatusBadgeProps) {
  return (
    <Chip
      label={STATUS_LABEL[status]}
      color={STATUS_COLOR[status]}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 600, ...sx }}
    />
  );
}
