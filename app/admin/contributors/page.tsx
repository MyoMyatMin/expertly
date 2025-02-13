"use client";
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Report } from "@/types/types";
import { api } from "@/helper/axiosInstance";
import ReportTable from "@/components/ReportTable";

const ManageContributors = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const getReportedContributors = async () => {
    try {
      const response = await api.protected.getReportsForContributors();
      setReports(response);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStats = async (reportID: string, status: string) => {
    try {
      await api.protected.updateReportStatus(reportID, status);
      setStatusMessage("Status updated successfully");
      getReportedContributors();
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to update status");
    }
  };

  useEffect(() => {
    getReportedContributors();
  }, []);

  return (
    <Container>
      <Tabs
        value={tabValue}
        onChange={(_event, newValue) => setTabValue(newValue)}
        variant={isSmallScreen ? "scrollable" : "standard"}
        scrollButtons={isSmallScreen ? "auto" : undefined}
        sx={{ mb: 3 }}
      >
        <Tab label="Reports" />
        <Tab label="Appeals" />
      </Tabs>

      {statusMessage && (
        <Alert severity="success" onClose={() => setStatusMessage(null)}>
          {statusMessage}
        </Alert>
      )}

      {tabValue === 0 && (
        <ReportTable reports={reports} updateStatus={updateStats} />
      )}
    </Container>
  );
};

export default ManageContributors;
