"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface AddNoteFormProps {
  onSubmit: (note: string) => Promise<void>;
  disabled?: boolean;
}

export function AddNoteForm({ onSubmit, disabled = false }: AddNoteFormProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    try {
      await onSubmit(note.trim());
      setNote("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 1, alignItems: "flex-start", mt: 2 }}
    >
      <TextField
        id="add-note-input"
        label="note"
        multiline
        minRows={2}
        fullWidth
        size="small"
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={disabled || loading}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!note.trim() || disabled || loading}
        sx={{ mt: 0.5, minWidth: 80 }}
        aria-label="submit note"
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : "Add"}
      </Button>
    </Box>
  );
}
