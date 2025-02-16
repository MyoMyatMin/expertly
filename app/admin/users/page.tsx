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
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Report, Appeals } from "../../../types/types";
import { api } from "@/helper/axiosInstance";
import ReportTable from "@/components/ReportTable";
import AppealTable from "@/components/AppealTable";
import { WithModerator } from "@/app/hocs/withAuth";

type Props = {};

const UsersAction = (props: Props) => {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [appeals, setAppeals] = useState<Appeals[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getReportedUsers = async () => {
    const response = await api.protected.getReportsForUsers();
    setReports(response);
  };

  const updateStatus = async (
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
      getReportedUsers();
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to update status");
    }
  };

  const getAppealedUsers = async () => {
    console.log("Getting appealed users");
    try {
      const response = await api.protected.getAppealsForUsers();
      setAppeals(response);
    } catch (error) {
      console.error(error);
    }
  };
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    getReportedUsers();
    getAppealedUsers();
  }, []);

  return (
    <>
      <Container>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isSmallScreen ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab label="Reports" />
          <Tab label="Appeals" />
        </Tabs>

        {tabValue === 0 && (
          <ReportTable reports={reports} updateStatus={updateStatus} />
        )}
        {tabValue === 1 && <AppealTable appeals={appeals} />}
      </Container>
    </>
  );
};

export default WithModerator(UsersAction);
