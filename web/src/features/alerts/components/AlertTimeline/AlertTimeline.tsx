"use client";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import PersonIcon from "@mui/icons-material/Person";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NoteIcon from "@mui/icons-material/Note";
import BlockIcon from "@mui/icons-material/Block";
import ReplayIcon from "@mui/icons-material/Replay";
import type { SvgIconComponent } from "@mui/icons-material";
import type { TimelineEntry } from "@/features/alerts/types";
import { formatRelativeTime } from "@/utils/formatters";
import { RESOLUTION_TYPE_LABELS } from "@/constants/resolution";

interface AlertTimelineProps {
  entries: TimelineEntry[];
}

interface ActionConfig {
  Icon: SvgIconComponent;
  color: "grey" | "success" | "primary" | "warning" | "info" | "error";
}

const ACTION_CONFIG: Record<string, ActionConfig> = {
  created: { Icon: AddCircleOutlineIcon, color: "grey" },
  acknowledged: { Icon: CheckCircleOutlineIcon, color: "success" },
  assigned: { Icon: PersonIcon, color: "primary" },
  resolved: { Icon: DoneAllIcon, color: "success" },
  note: { Icon: NoteIcon, color: "info" },
  dismissed: { Icon: BlockIcon, color: "error" },
  reopened: { Icon: ReplayIcon, color: "warning" },
};

const DEFAULT_CONFIG: ActionConfig = { Icon: NoteIcon, color: "grey" };

const RESOLVED_PATTERN = /^Resolved: (.+)$/;

function humanizeDetails(details: string): string {
  const match = RESOLVED_PATTERN.exec(details);
  if (match) {
    const token = match[1];
    return `Resolved: ${RESOLUTION_TYPE_LABELS[token] ?? token}`;
  }
  return details;
}

export function AlertTimeline({ entries }: AlertTimelineProps) {
  if (entries.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No timeline entries yet.
        </Typography>
      </Box>
    );
  }

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <Timeline position="right" data-testid="alert-timeline">
      {sorted.map((entry, idx) => {
        const config = ACTION_CONFIG[entry.action] ?? DEFAULT_CONFIG;
        const { Icon, color } = config;
        const isLast = idx === sorted.length - 1;

        return (
          <TimelineItem key={entry.id}>
            <TimelineOppositeContent
              sx={{ display: "none" }}
              variant="body2"
              color="text.secondary"
            />
            <TimelineSeparator>
              <TimelineDot color={color}>
                <Icon fontSize="small" />
              </TimelineDot>
              {!isLast && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                </Typography>
                {entry.user_name && (
                  <Typography variant="caption" color="text.secondary">
                    by {entry.user_name}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ ml: "auto" }}
                  data-testid="timeline-relative-time"
                >
                  {formatRelativeTime(entry.timestamp)}
                </Typography>
              </Box>
              {entry.details && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {humanizeDetails(entry.details)}
                </Typography>
              )}
              {entry.note && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontStyle: "italic",
                    color: "text.secondary",
                    borderLeft: "2px solid",
                    borderColor: "primary.main",
                    pl: 1,
                  }}
                >
                  {entry.note}
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
