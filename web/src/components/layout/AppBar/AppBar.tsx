"use client";

import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ROUTES } from "@/constants/routes";

export function AppBar() {
  return (
    <MuiAppBar position="sticky" elevation={1} color="default">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 800, color: "primary.main", mr: 3 }}
        >
          KNAQ
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
          <Button
            component={Link}
            href={ROUTES.alerts}
            color="inherit"
            size="small"
          >
            Alerts
          </Button>
          <Button
            component={Link}
            href={ROUTES.analytics}
            color="inherit"
            size="small"
          >
            Analytics
          </Button>
        </Box>
        <ThemeToggle />
      </Toolbar>
    </MuiAppBar>
  );
}
