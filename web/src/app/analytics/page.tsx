"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useGetAlertStatsQuery } from "@/features/alerts/api/alertsApi";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useTheme } from "@mui/material/styles";

// Dynamic import to avoid SSR issues with ECharts
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: color ?? "text.primary" }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

export default function AnalyticsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: stats, isLoading, isError, refetch } = useGetAlertStatsQuery();

  const textColor = isDark ? "#ffffff" : "#333333";
  const gridColor = isDark ? "#333333" : "#eeeeee";

  if (isLoading) return <Box sx={{ p: 3 }}><LoadingSkeleton rows={6} /></Box>;
  if (isError || !stats) return <Box sx={{ p: 3 }}><ErrorState message="Failed to load analytics." onRetry={() => refetch()} /></Box>;

  const { total_by_status, total_by_severity, mttr_hours, resolved_this_week, resolved_last_week, dismissal_rate, volume_7d, anomaly_count } = stats;

  // Chart: Alerts by Status — donut
  const statusDonutOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { orient: "vertical", left: "left", textStyle: { color: textColor } },
    series: [{
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
      labelLine: { show: false },
      data: [
        { value: total_by_status.new, name: "New", itemStyle: { color: "#EFC01A" } },
        { value: total_by_status.acknowledged, name: "Acknowledged", itemStyle: { color: "#4B8189" } },
        { value: total_by_status.resolved, name: "Resolved", itemStyle: { color: "#66BB6A" } },
        { value: total_by_status.dismissed, name: "Dismissed", itemStyle: { color: "#9E9E9E" } },
      ],
    }],
  };

  // Chart: Alerts by Severity — bar
  const severityBarOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Critical", "Warning", "Info"],
      axisLabel: { color: textColor },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: gridColor } },
    },
    series: [{
      type: "bar",
      data: [
        { value: total_by_severity.critical, itemStyle: { color: "#F44336" } },
        { value: total_by_severity.warning, itemStyle: { color: "#FFA726" } },
        { value: total_by_severity.info, itemStyle: { color: "#29B6F6" } },
      ],
      barMaxWidth: 60,
    }],
  };

  // Chart: Alert Volume Trend — line (7 days)
  const volumeTrendOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: volume_7d.map((d) => d.date.slice(5)), // MM-DD
      axisLabel: { color: textColor },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: gridColor } },
    },
    series: [{
      type: "line",
      data: volume_7d.map((d) => d.count),
      smooth: true,
      areaStyle: { opacity: 0.3, color: "#EFC01A" },
      lineStyle: { color: "#EFC01A", width: 2 },
      symbol: "circle",
      symbolSize: 6,
      itemStyle: { color: "#EFC01A" },
    }],
  };

  // SLA target lines for resolution time bar
  const SLA_HOURS: Record<string, number> = { Critical: 4, Warning: 24, Info: 72 };

  const resolutionTimeOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: { textStyle: { color: textColor }, data: ["MTTR (hours)", "SLA Target"] },
    xAxis: {
      type: "category",
      data: ["Critical", "Warning", "Info"],
      axisLabel: { color: textColor },
    },
    yAxis: {
      type: "value",
      name: "Hours",
      nameTextStyle: { color: textColor },
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: gridColor } },
    },
    series: [
      {
        name: "MTTR (hours)",
        type: "bar",
        data: [mttr_hours ?? 0, mttr_hours ?? 0, mttr_hours ?? 0],
        itemStyle: { color: "#4B8189" },
        barMaxWidth: 60,
      },
      {
        name: "SLA Target",
        type: "line",
        data: [SLA_HOURS.Critical, SLA_HOURS.Warning, SLA_HOURS.Info],
        lineStyle: { color: "#F44336", type: "dashed", width: 2 },
        itemStyle: { color: "#F44336" },
        symbol: "none",
      },
    ],
  };

  const weekTrend = resolved_this_week - resolved_last_week;
  const weekTrendStr =
    weekTrend > 0 ? `▲ ${weekTrend} vs last week` :
    weekTrend < 0 ? `▼ ${Math.abs(weekTrend)} vs last week` :
    "same as last week";

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Analytics
      </Typography>

      {/* Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            label="MTTR"
            value={mttr_hours !== null ? `${mttr_hours.toFixed(1)}h` : "—"}
            sub="Mean time to resolve"
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            label="Open Alerts"
            value={total_by_status.new + total_by_status.acknowledged}
            sub={`${total_by_status.new} new · ${total_by_status.acknowledged} acknowledged`}
            color="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            label="Resolved This Week"
            value={resolved_this_week}
            sub={weekTrendStr}
            color="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            label="Dismissal Rate"
            value={`${dismissal_rate.toFixed(1)}%`}
            sub="of all closed alerts"
            color={dismissal_rate > 30 ? "error.main" : "text.primary"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            label="Anomalous Readings"
            value={anomaly_count}
            sub="within range but statistically unusual (|z| > 2σ)"
            color={anomaly_count > 0 ? "warning.main" : "text.primary"}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Charts row 1 */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Alerts by Status</Typography>
            <ReactECharts option={statusDonutOption} style={{ height: 280 }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Alerts by Severity</Typography>
            <ReactECharts option={severityBarOption} style={{ height: 280 }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Charts row 2 */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Alert Volume — Last 7 Days</Typography>
            <ReactECharts option={volumeTrendOption} style={{ height: 280 }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Resolution Time by Severity (vs SLA Target)
            </Typography>
            <ReactECharts option={resolutionTimeOption} style={{ height: 280 }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
