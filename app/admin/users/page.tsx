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
import { Report } from "../../../types/types";
import { api } from "@/helper/axiosInstance";
import ReportTable from "@/components/ReportTable";

type Props = {};

const UsersAction = (props: Props) => {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getReportedUsers = async () => {
    const response = await api.protected.getReportsForUsers();
    setReports(response);
  };

  const updateStatus = async (reportID: string, status: string) => {
    await api.protected.updateReportStatus(reportID, status);
    getReportedUsers();
  };
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    getReportedUsers();
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
      </Container>
    </>
  );
};

export default UsersAction;
