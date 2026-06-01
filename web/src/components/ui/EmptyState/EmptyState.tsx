"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InboxIcon from "@mui/icons-material/Inbox";

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({
  message = "No alerts found",
  description = "Try adjusting your filters or check back later.",
}: EmptyStateProps) {
  return (
    <Box
      data-testid="empty-state"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 2,
      }}
    >
      <InboxIcon sx={{ fontSize: 64, color: "text.disabled" }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ textAlign: "center" }}>
        {description}
      </Typography>
    </Box>
  );
}
