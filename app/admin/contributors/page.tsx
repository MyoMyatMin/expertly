"use client";
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Container,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { Appeals, Report } from "@/types/types";
import { api } from "@/helper/axiosInstance";
import ReportTable from "@/components/ReportTable";
import AppealTable from "@/components/AppealTable";
import { WithModerator } from "@/app/hocs/withAuth";

const ManageContributors = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [appeals, setAppeals] = useState<Appeals[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getReportedContributors = async () => {
    try {
      const response = await api.protected.getReportsForContributors();
      setReports(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getAppealedContributors = async () => {
    try {
      const response = await api.protected.getAppealsForContributors();
      setAppeals(response);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStats = async (
    reportID: string,
    status: string,
    suspendedDays: number,
    targetUserID: string
  ) => {
    try {
      await api.protected.updateReportStatus(
        reportID,
        status,
        suspendedDays,
        targetUserID
      );
      setStatusMessage("Status updated successfully");
      getReportedContributors();
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to update status");
    }
  };

  useEffect(() => {
    getReportedContributors();
    getAppealedContributors();
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
      {tabValue === 1 && <AppealTable appeals={appeals} />}
    </Container>
  );
};

export default WithModerator(ManageContributors);
