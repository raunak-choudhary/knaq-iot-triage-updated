"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { ResolveBody } from "@/features/alerts/api/alertsApi";
import { extractApiError } from "@/utils/errorHelpers";
import { RESOLUTION_TYPE_LABELS } from "@/constants/resolution";

const RESOLUTION_TYPES = Object.entries(RESOLUTION_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

const validationSchema = Yup.object({
  resolutionType: Yup.string().required("Resolution type is required"),
  rootCause: Yup.string().required("Root cause is required"),
  actionTaken: Yup.string().required("Action taken is required"),
  preventiveMeasures: Yup.string(),
  timeSpentMinutes: Yup.number()
    .positive("Must be a positive number")
    .integer("Must be a whole number")
    .nullable()
    .transform((v) => (v === "" ? null : v)),
});

interface ResolveDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (body: ResolveBody) => Promise<void>;
}

interface FormValues {
  resolutionType: string;
  rootCause: string;
  actionTaken: string;
  preventiveMeasures: string;
  timeSpentMinutes: string;
}

export function ResolveDialog({ open, onClose, onSubmit }: ResolveDialogProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const formik = useFormik<FormValues>({
    initialValues: {
      resolutionType: "",
      rootCause: "",
      actionTaken: "",
      preventiveMeasures: "",
      timeSpentMinutes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setApiError(null);
      try {
        const body: ResolveBody = {
          resolution_type: values.resolutionType,
          root_cause: values.rootCause,
          action_taken: values.actionTaken,
          ...(values.preventiveMeasures
            ? { preventive_measures: values.preventiveMeasures }
            : {}),
          ...(values.timeSpentMinutes
            ? { time_spent_minutes: parseInt(values.timeSpentMinutes, 10) }
            : {}),
        };
        await onSubmit(body);
        formik.resetForm();
        onClose();
      } catch (err) {
        setApiError(extractApiError(err));
      }
    },
  });

  function handleClose() {
    formik.resetForm();
    setApiError(null);
    onClose();
  }

  function handleSelectChange(e: SelectChangeEvent) {
    formik.setFieldValue("resolutionType", e.target.value);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      aria-labelledby="resolve-dialog-title"
    >
      <DialogTitle id="resolve-dialog-title">Resolve Alert</DialogTitle>
      <DialogContent>
        {apiError && (
          <MuiAlert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </MuiAlert>
        )}
        <FormControl
          fullWidth
          margin="normal"
          error={
            formik.touched.resolutionType &&
            Boolean(formik.errors.resolutionType)
          }
        >
          <InputLabel id="resolution-type-label">Resolution Type *</InputLabel>
          <Select
            labelId="resolution-type-label"
            id="resolutionType"
            name="resolutionType"
            value={formik.values.resolutionType}
            label="Resolution Type *"
            onChange={handleSelectChange}
            onBlur={formik.handleBlur}
          >
            {RESOLUTION_TYPES.map((rt) => (
              <MenuItem key={rt.value} value={rt.value}>
                {rt.label}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.resolutionType && formik.errors.resolutionType && (
            <FormHelperText>{formik.errors.resolutionType}</FormHelperText>
          )}
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          id="rootCause"
          name="rootCause"
          label="Root Cause *"
          multiline
          minRows={2}
          value={formik.values.rootCause}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.rootCause && Boolean(formik.errors.rootCause)}
          helperText={formik.touched.rootCause && formik.errors.rootCause}
        />

        <TextField
          fullWidth
          margin="normal"
          id="actionTaken"
          name="actionTaken"
          label="Action Taken *"
          multiline
          minRows={2}
          value={formik.values.actionTaken}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.actionTaken && Boolean(formik.errors.actionTaken)
          }
          helperText={formik.touched.actionTaken && formik.errors.actionTaken}
        />

        <TextField
          fullWidth
          margin="normal"
          id="preventiveMeasures"
          name="preventiveMeasures"
          label="Preventive Measures"
          multiline
          minRows={2}
          value={formik.values.preventiveMeasures}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.preventiveMeasures &&
            Boolean(formik.errors.preventiveMeasures)
          }
          helperText={
            formik.touched.preventiveMeasures &&
            formik.errors.preventiveMeasures
          }
        />

        <TextField
          fullWidth
          margin="normal"
          id="timeSpentMinutes"
          name="timeSpentMinutes"
          label="Time Spent (minutes)"
          type="number"
          value={formik.values.timeSpentMinutes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.timeSpentMinutes &&
            Boolean(formik.errors.timeSpentMinutes)
          }
          helperText={
            formik.touched.timeSpentMinutes && formik.errors.timeSpentMinutes
          }
          slotProps={{ htmlInput: { min: 1 } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={formik.isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => formik.submitForm()}
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          startIcon={
            formik.isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
        >
          Resolve
        </Button>
      </DialogActions>
    </Dialog>
  );
}
