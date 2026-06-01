"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 700, color: "primary.main" }}>
        404
      </Typography>
      <Typography variant="h5">Page not found</Typography>
      <Typography variant="body2" color="text.secondary">
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" component={Link} href={ROUTES.alerts}>
        Go to Alerts
      </Button>
    </Box>
  );
}
