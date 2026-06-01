"use client";

import { useState, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { User } from "@/features/alerts/types";
import type { AssignBody } from "@/features/alerts/api/alertsApi";
import { extractApiError } from "@/utils/errorHelpers";

interface AssignDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (body: AssignBody) => Promise<void>;
  users: User[];
  currentAssigneeId?: string | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AssignDialog({
  open,
  onClose,
  onSubmit,
  users,
  currentAssigneeId,
}: AssignDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  async function handleAssign() {
    if (!selectedUserId) return;
    setLoading(true);
    setApiError(null);
    try {
      await onSubmit({ assignee_id: selectedUserId, ...(note ? { note } : {}) });
      handleClose();
    } catch (err) {
      setApiError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSearch("");
    setSelectedUserId(null);
    setNote("");
    setApiError(null);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
      aria-labelledby="assign-dialog-title"
    >
      <DialogTitle id="assign-dialog-title">Assign Alert</DialogTitle>
      <DialogContent>
        {apiError && (
          <MuiAlert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </MuiAlert>
        )}
        <TextField
          fullWidth
          size="small"
          label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 1 }}
        />
        <List dense sx={{ maxHeight: 240, overflow: "auto" }}>
          {filteredUsers.map((user) => {
            const isCurrentAssignee = user.id === currentAssigneeId;
            const isSelected = user.id === selectedUserId;
            return (
              <ListItem key={user.id} disablePadding>
                <ListItemButton
                  selected={isSelected || isCurrentAssignee}
                  onClick={() => setSelectedUserId(user.id)}
                  aria-label={`assign to ${user.name}`}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: isCurrentAssignee
                          ? "primary.main"
                          : "secondary.main",
                        width: 32,
                        height: 32,
                        fontSize: "0.75rem",
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={user.role}
                  />
                  {isCurrentAssignee && (
                    <Typography variant="caption" color="text.disabled">
                      Current
                    </Typography>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Note (optional)"
            multiline
            minRows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            slotProps={{ htmlInput: { "aria-label": "assignment note" } }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={!selectedUserId || loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          aria-label="assign button"
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
