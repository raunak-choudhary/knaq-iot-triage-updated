"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { AlertStatus, StatusCounts } from "@/features/alerts/types";
import { STATUS_COLOR, STATUS_LABEL } from "@/constants/alertStatus";

interface SummaryBarProps {
  statusCounts: StatusCounts;
  selectedStatus: string[];
  onStatusClick: (status: AlertStatus) => void;
}

const STATUSES: AlertStatus[] = ["new", "acknowledged", "resolved", "dismissed"];

export function SummaryBar({ statusCounts, selectedStatus, onStatusClick }: SummaryBarProps) {
  const counts = statusCounts;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        flexWrap: "wrap",
        alignItems: "center",
        py: 1,
      }}
      data-testid="summary-bar"
    >
      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
        Totals:
      </Typography>
      {STATUSES.map((status) => (
        <Chip
          key={status}
          label={`${STATUS_LABEL[status]}: ${counts[status]}`}
          color={STATUS_COLOR[status]}
          variant={selectedStatus.includes(status) ? "filled" : "outlined"}
          onClick={() => onStatusClick(status)}
          clickable
          size="small"
          data-testid={`summary-chip-${status}`}
        />
      ))}
    </Box>
  );
}
