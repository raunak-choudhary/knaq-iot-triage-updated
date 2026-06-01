"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 5 }: LoadingSkeletonProps) {
  return (
    <Stack spacing={1} data-testid="loading-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="text" sx={{ flex: 1 }} />
          <Skeleton variant="rectangular" width={100} height={24} />
          <Skeleton variant="rectangular" width={80} height={24} />
        </Box>
      ))}
    </Stack>
  );
}
