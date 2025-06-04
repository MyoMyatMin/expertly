"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { SuspendedReport } from "@/types/types";
import { api } from "@/helper/axiosInstance";

const AppealsTab: React.FC = () => {
  const [justification, setJustification] = useState("");
  const [suspendedReports, setSuspendedReports] = useState<SuspendedReport[]>(
    []
  );
  const [selectedReport, setSelectedReport] = useState<SuspendedReport | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchSuspendedReports = async () => {
    try {
      const response = await api.protected.getSuspendedReportsByUserID();
      setSuspendedReports(response);
      console.log("Suspended reports:", response);
    } catch (error) {
      console.error("Error fetching suspended reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAppeal = async () => {
    if (!selectedReport) {
      alert("Please select a report to appeal");
      return;
    }

    try {
      await api.protected.createAppeal(justification, selectedReport.ReportID);
      alert("Appeal Submitted!");

      // Refresh the list after submitting the appeal
      setLoading(true);
      await fetchSuspendedReports();

      setJustification("");
      setSelectedReport(null);
    } catch (error) {
      console.error("Error submitting appeal:", error);
      alert("Failed to submit appeal. Please try again.");
    }
  };

  const handleReportChange = (event: SelectChangeEvent<string>) => {
    const reportId = event.target.value as string;
    const report =
      suspendedReports.find((r) => r.ReportID === reportId) || null;
    setSelectedReport(report);
  };

  useEffect(() => {
    fetchSuspendedReports();
  }, []);

  const getReportDisplayName = (report: SuspendedReport) => {
    let name = `Report ID: ${report.ReportID.substring(0, 8)}...`;

    if (report.TargetPostSlug?.Valid) {
      name += ` | Post: ${report.TargetPostSlug.String}`;
    } else if (report.TargetComment?.Valid) {
      name += ` | Comment: ${report.TargetComment.String.substring(0, 20)}${
        report.TargetComment.String.length > 20 ? "..." : ""
      }`;
    }

    return name;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Appeal Form
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : suspendedReports === null ? (
        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "#f9f9f9",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" paragraph>
            No reports available to appeal at this time.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            If you believe there should be reports here, please wait for the
            admin&#39;s review.
          </Typography>
        </Paper>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="report-select-label">
              Select Report to Appeal
            </InputLabel>
            <Select
              labelId="report-select-label"
              id="report-select"
              value={selectedReport?.ReportID || ""}
              label="Select Report to Appeal"
              onChange={handleReportChange}
            >
              {suspendedReports?.map((report) => (
                <MenuItem key={report.ReportID} value={report.ReportID}>
                  {getReportDisplayName(report)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedReport && (
            <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: "#f8f9fa" }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Report Details
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>Report ID:</strong> {selectedReport.ReportID}
              </Typography>

              {selectedReport.Reason && (
                <Typography variant="body2" paragraph>
                  <strong>Reason:</strong> {selectedReport.Reason}
                </Typography>
              )}

              {selectedReport.TargetPostSlug?.Valid && (
                <Typography variant="body2" paragraph>
                  <strong>Post:</strong> {selectedReport.TargetPostSlug.String}
                </Typography>
              )}

              {selectedReport.TargetComment?.Valid && (
                <Typography variant="body2" paragraph>
                  <strong>Comment:</strong>{" "}
                  {selectedReport.TargetComment.String}
                </Typography>
              )}

              {selectedReport.CreatedAt?.Valid && (
                <Typography variant="body2" paragraph>
                  <strong>Reported on:</strong>{" "}
                  {formatDate(selectedReport.CreatedAt.Time)}
                </Typography>
              )}

              {selectedReport.SuspendDays?.Valid && (
                <Typography variant="body2" paragraph>
                  <strong>Suspension Length:</strong>{" "}
                  {selectedReport.SuspendDays.Int32} days
                </Typography>
              )}
            </Paper>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Justification for Appeal"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Please explain why you believe this report should be reconsidered..."
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAppeal}
            disabled={!selectedReport}
            fullWidth
          >
            Submit Appeal
          </Button>
        </>
      )}
    </Box>
  );
};

export default AppealsTab;
