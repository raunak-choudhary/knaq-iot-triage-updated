"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      data-testid="error-state"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 2,
      }}
    >
      <ErrorOutlinedIcon sx={{ fontSize: 64, color: "error.main" }} />
      <Typography variant="h6" color="text.secondary">
        Error
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ textAlign: "center" }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
}
