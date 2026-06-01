"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { SeverityChip } from "@/components/ui/SeverityChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { AlertTimeline } from "@/features/alerts/components/AlertTimeline";
import { AddNoteForm } from "@/features/alerts/components/AddNoteForm";
import { ResolveDialog } from "@/features/alerts/components/ResolveDialog";
import { AssignDialog } from "@/features/alerts/components/AssignDialog";
import {
  useGetAlertByIdQuery,
  useGetUsersQuery,
  useAcknowledgeMutation,
  useResolveMutation,
  useAssignMutation,
  useAddNoteMutation,
  useDismissMutation,
  useReopenMutation,
  type ResolveBody,
} from "@/features/alerts/api/alertsApi";
import { useAlertActions } from "@/features/alerts/hooks/useAlertActions";
import { useToast } from "@/components/ui/AppToast";
import { extractApiError } from "@/utils/errorHelpers";
import { RESOLUTION_TYPE_LABELS } from "@/constants/resolution";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface AlertDetailProps {
  id: string;
}

export function AlertDetail({ id }: AlertDetailProps) {
  const { showToast } = useToast();
  const { isResolveOpen, isAssignOpen, openResolve, openAssign, closeAll } =
    useAlertActions();

  const {
    data: alert,
    isLoading,
    isError,
    error,
  } = useGetAlertByIdQuery(id);
  const { data: users = [] } = useGetUsersQuery();
  const [acknowledge] = useAcknowledgeMutation();
  const [resolve] = useResolveMutation();
  const [assign] = useAssignMutation();
  const [addNote] = useAddNoteMutation();
  const [dismiss] = useDismissMutation();
  const [reopen] = useReopenMutation();

  async function handleAcknowledge() {
    try {
      await acknowledge(id).unwrap();
      showToast("Alert acknowledged", "success");
    } catch (err) {
      showToast(extractApiError(err), "error");
    }
  }

  async function handleResolve(body: ResolveBody) {
    await resolve({ id, body }).unwrap();
    showToast("Alert resolved", "success");
  }

  async function handleAssign(body: { assignee_id: string; note?: string }) {
    await assign({ id, body }).unwrap();
    showToast("Alert assigned", "success");
    closeAll();
  }

  async function handleAddNote(note: string) {
    await addNote({ id, body: { note } }).unwrap();
    showToast("Note added", "success");
  }

  async function handleDismiss() {
    try {
      await dismiss({ id, body: {} }).unwrap();
      showToast("Alert dismissed", "success");
    } catch (err) {
      showToast(extractApiError(err), "error");
    }
  }

  async function handleReopen() {
    try {
      await reopen(id).unwrap();
      showToast("Alert reopened", "success");
    } catch (err) {
      showToast(extractApiError(err), "error");
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LoadingSkeleton rows={10} />
      </Box>
    );
  }

  const apiError = error as { status?: number } | undefined;
  if (isError || !alert) {
    const is404 = apiError?.status === 404;
    return (
      <Box sx={{ p: 3 }}>
        <ErrorState
          message={is404 ? "Alert not found." : "Failed to load alert."}
        />
      </Box>
    );
  }

  const hasMetric =
    alert.reading_value !== null && alert.threshold !== null;
  const isBreached =
    hasMetric && alert.reading_value !== null && alert.threshold !== null &&
    alert.reading_value > alert.threshold;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
            {alert.title}
          </Typography>
          <SeverityChip severity={alert.severity} />
          <StatusBadge status={alert.status} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {alert.device_name} | {alert.device_location}
        </Typography>
      </Paper>

      {/* Metric card */}
      {hasMetric && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid",
            borderColor: isBreached ? "error.main" : "divider",
          }}
          data-testid="metric-card"
        >
          <Typography variant="body2" color="text.secondary">
            {alert.reading_name}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: isBreached ? "error.main" : "text.primary" }}
          >
            {alert.reading_value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Threshold: {alert.threshold}
          </Typography>
        </Paper>
      )}

      {/* Action buttons by status */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Actions
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {alert.status === "new" && (
            <>
              <Button
                variant="contained"
                onClick={handleAcknowledge}
                data-testid="acknowledge-btn"
              >
                Acknowledge
              </Button>
              <Button variant="outlined" onClick={openAssign} data-testid="assign-btn">
                Assign
              </Button>
              <Button variant="outlined" color="warning" onClick={handleDismiss} data-testid="dismiss-btn">
                Dismiss
              </Button>
            </>
          )}
          {alert.status === "acknowledged" && (
            <>
              <Button variant="contained" color="success" onClick={openResolve} data-testid="resolve-btn">
                Resolve
              </Button>
              <Button variant="outlined" onClick={openAssign} data-testid="assign-btn">
                Assign
              </Button>
              <Button variant="outlined" color="warning" onClick={handleDismiss} data-testid="dismiss-btn">
                Dismiss
              </Button>
            </>
          )}
          {(alert.status === "resolved" || alert.status === "dismissed") && (
            <Button variant="outlined" color="info" onClick={handleReopen} data-testid="reopen-btn">
              Reopen
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Resolution summary */}
      {alert.status === "resolved" && alert.resolution_type && (
        <Paper sx={{ p: 2, mb: 2 }} data-testid="resolution-summary">
          <Typography variant="subtitle2" gutterBottom>
            Resolution
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Type:{" "}
            <strong>
              {RESOLUTION_TYPE_LABELS[alert.resolution_type] ?? alert.resolution_type}
            </strong>
          </Typography>
          {alert.resolution_root_cause && (
            <Typography variant="body2" color="text.secondary">
              Root cause: {alert.resolution_root_cause}
            </Typography>
          )}
          {alert.resolution_action_taken && (
            <Typography variant="body2" color="text.secondary">
              Action taken: {alert.resolution_action_taken}
            </Typography>
          )}
          {alert.resolution_time_spent_minutes && (
            <Typography variant="body2" color="text.secondary">
              Time spent: {alert.resolution_time_spent_minutes} min
            </Typography>
          )}
        </Paper>
      )}

      {/* Assignment section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Assignment
        </Typography>
        {alert.assignee_name ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32, fontSize: "0.75rem" }}>
              {getInitials(alert.assignee_name)}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {alert.assignee_name}
              </Typography>
              {users.find((u) => u.id === alert.assigned_to)?.role && (
                <Typography variant="caption" color="text.secondary">
                  {users.find((u) => u.id === alert.assigned_to)?.role}
                </Typography>
              )}
            </Box>
            {(alert.status === "new" || alert.status === "acknowledged") && (
              <Button size="small" sx={{ ml: "auto" }} onClick={openAssign}>
                Change
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.disabled">
              Unassigned
            </Typography>
            {(alert.status === "new" || alert.status === "acknowledged") && (
              <Button size="small" onClick={openAssign}>
                Assign
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Timeline */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Timeline
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <AlertTimeline entries={alert.timeline} />
      </Paper>

      {/* Add note */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Add Note
        </Typography>
        <AddNoteForm onSubmit={handleAddNote} />
      </Paper>

      {/* Dialogs */}
      <ResolveDialog
        open={isResolveOpen}
        onClose={closeAll}
        onSubmit={handleResolve}
      />
      <AssignDialog
        open={isAssignOpen}
        onClose={closeAll}
        onSubmit={handleAssign}
        users={users}
        currentAssigneeId={alert.assigned_to}
      />
    </Box>
  );
}
