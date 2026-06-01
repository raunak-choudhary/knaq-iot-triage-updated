"use client";

import { useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { SeverityChip } from "@/components/ui/SeverityChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRelativeTime } from "@/utils/formatters";
import type { AlertListItem } from "@/features/alerts/types";
import { ROUTES } from "@/constants/routes";

type SortKey = "severity" | "time" | "status";
type SortDir = "asc" | "desc";

interface AlertTableProps {
  alerts: AlertListItem[];
  sortBy: SortKey;
  sortDir: SortDir;
  onSortChange: (key: SortKey) => void;
  onAcknowledge: (id: string) => void;
  onAssign: (id: string) => void;
  // Controlled selection — lifted to parent for keyboard shortcuts + bulk API
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onBulkAcknowledge: (ids: string[]) => void;
}

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };
const STATUS_ORDER = { new: 0, acknowledged: 1, resolved: 2, dismissed: 3 };

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function AlertTable({
  alerts,
  sortBy,
  sortDir,
  onSortChange,
  onAcknowledge,
  onAssign,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onBulkAcknowledge,
}: AlertTableProps) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sorted = useMemo(() => {
    const copy = [...alerts];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "severity") {
        cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      } else if (sortBy === "time") {
        cmp = a.timestamp_utc - b.timestamp_utc;
      } else if (sortBy === "status") {
        cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [alerts, sortBy, sortDir]);

  const newSelected = [...selectedIds].filter(
    (id) => alerts.find((a) => a.id === id)?.status === "new"
  );

  function makeSortHandler(key: SortKey) {
    return () => onSortChange(key);
  }

  if (isMobile) {
    return (
      <Box>
        {selectedIds.size > 0 && (
          <BulkBar
            count={newSelected.length}
            onAcknowledge={() => onBulkAcknowledge(newSelected)}
          />
        )}
        {sorted.map((alert) => (
          <Paper key={alert.id} sx={{ mb: 1, p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <SeverityChip severity={alert.severity} />
              <StatusBadge status={alert.status} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {alert.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {alert.device_name} — {formatRelativeTime(alert.timestamp_utc)}
            </Typography>
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {alert.status === "new" && (
                <Button size="small" onClick={() => onAcknowledge(alert.id)}>
                  Acknowledge
                </Button>
              )}
              {alert.status !== "resolved" && alert.status !== "dismissed" && (
                <Button size="small" onClick={() => onAssign(alert.id)}>
                  Assign
                </Button>
              )}
              <Button size="small" component={Link} href={ROUTES.alertDetail(alert.id)}>
                View
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {selectedIds.size > 0 && (
        <BulkBar
          count={newSelected.length}
          onAcknowledge={() => onBulkAcknowledge(newSelected)}
        />
      )}
      <TableContainer component={Paper}>
        <Table size="small" aria-label="alerts table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.size > 0 && selectedIds.size < alerts.length
                  }
                  checked={alerts.length > 0 && selectedIds.size === alerts.length}
                  onChange={onToggleAll}
                  slotProps={{ input: { "aria-label": "select all" } }}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "severity"}
                  direction={sortBy === "severity" ? sortDir : "asc"}
                  onClick={makeSortHandler("severity")}
                >
                  Severity
                </TableSortLabel>
              </TableCell>
              <TableCell>Title</TableCell>
              {!isTablet && <TableCell>Device / Location</TableCell>}
              <TableCell>
                <TableSortLabel
                  active={sortBy === "time"}
                  direction={sortBy === "time" ? sortDir : "asc"}
                  onClick={makeSortHandler("time")}
                >
                  Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? sortDir : "asc"}
                  onClick={makeSortHandler("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              {!isTablet && <TableCell>Assignee</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((alert) => (
              <TableRow
                key={alert.id}
                selected={selectedIds.has(alert.id)}
                hover
                data-testid={`alert-row-${alert.id}`}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(alert.id)}
                    onChange={() => onToggleSelect(alert.id)}
                    slotProps={{ input: { "aria-label": `select ${alert.id}` } }}
                  />
                </TableCell>
                <TableCell>
                  <SeverityChip severity={alert.severity} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {alert.title}
                  </Typography>
                </TableCell>
                {!isTablet && (
                  <TableCell>
                    <Typography variant="body2">{alert.device_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {alert.device_location}
                    </Typography>
                  </TableCell>
                )}
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {formatRelativeTime(alert.timestamp_utc)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={alert.status} />
                </TableCell>
                {!isTablet && (
                  <TableCell>
                    {alert.assignee_name ? (
                      <Tooltip title={alert.assignee_name}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: "0.7rem", bgcolor: "secondary.main" }}>
                          {getInitials(alert.assignee_name)}
                        </Avatar>
                      </Tooltip>
                    ) : (
                      <Typography variant="caption" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {alert.status === "new" && (
                      <Button
                        size="small"
                        onClick={() => onAcknowledge(alert.id)}
                        data-testid={`ack-btn-${alert.id}`}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {alert.status !== "resolved" && alert.status !== "dismissed" && (
                      <Button
                        size="small"
                        onClick={() => onAssign(alert.id)}
                        data-testid={`assign-btn-${alert.id}`}
                      >
                        Assign
                      </Button>
                    )}
                    <Button
                      size="small"
                      component={Link}
                      href={ROUTES.alertDetail(alert.id)}
                    >
                      View
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function BulkBar({
  count,
  onAcknowledge,
}: {
  count: number;
  onAcknowledge: () => void;
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.5,
        mb: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Typography variant="body2" sx={{ flex: 1 }}>
        {count} new alert{count !== 1 ? "s" : ""} selected
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.75 }}>
        Press <strong>A</strong> to acknowledge
      </Typography>
      <Button
        size="small"
        variant="contained"
        color="inherit"
        onClick={onAcknowledge}
        disabled={count === 0}
      >
        Acknowledge Selected
      </Button>
    </Paper>
  );
}
