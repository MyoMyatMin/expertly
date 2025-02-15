"use client";
import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Typography,
  Paper,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { ContributorApplications } from "@/types/types";
import { api } from "@/helper/axiosInstance";
import { WithModerator } from "@/app/hocs/withAuth";

const Applications: React.FC = () => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [applicationsData, setApplicationsData] = useState<
    ContributorApplications[]
  >([]);
  const rowsPerPage = 7; // Show 5 per page

  const getApplications = async () => {
    try {
      const res = await api.protected.getContributorApplications();

      // Transform data to match the expected structure
      const formattedData = res??[].map((app : any) => ({
        ...app,

        Status: app.Status.Valid ? app.Status.String : "unknown",
        CreatedAt: app.CreatedAt.Valid ? app.CreatedAt.Time : null,
        ReviewedAt: app.ReviewedAt.Valid ? app.ReviewedAt.Time : null,
        ReviewedBy: app.ReviewedBy ?? "Not reviewed yet",
        ReviewerName: app.ReviewerName.Valid
          ? app.ReviewerName.String
          : "Not reviewed yet",
      }));

      setApplicationsData(formattedData);
    } catch (error) {
      console.error("Error fetching applications: ", error);
    }
  };

  const [orderBy, setOrderBy] =
    useState<keyof ContributorApplications>("CreatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (property: keyof ContributorApplications) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...applicationsData].sort((a, b) => {
    if (orderBy === "CreatedAt") {
      return order === "asc"
        ? new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
        : new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
    }
    return order === "asc"
      ? (a[orderBy] ?? "").localeCompare(b[orderBy] ?? "")
      : (b[orderBy] ?? "").localeCompare(a[orderBy] ?? "");
  });

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Contributor Applications
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "Name"}
                  direction={orderBy === "Name" ? order : "asc"}
                  onClick={() => handleSort("Name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "Status"}
                  direction={orderBy === "Status" ? order : "asc"}
                  onClick={() => handleSort("Status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "CreatedAt"}
                  direction={orderBy === "CreatedAt" ? order : "asc"}
                  onClick={() => handleSort("CreatedAt")}
                >
                  Submitted At
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Reviewed By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((app) => (
                <TableRow key={app.ContriAppID}>
                  <TableCell align="center">{app.Name}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={app.Status}
                      color={
                        app.Status === "approved"
                          ? "success"
                          : app.Status === "rejected"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    {new Date(app.CreatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {app.ReviewerName ? app.ReviewerName : "Not reviewed yet"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        router.push(`/admin/applications/${app.ContriAppID}`)
                      }
                    >
                      See Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={applicationsData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </TableContainer>
    </div>
  );
};

export default WithModerator(Applications);
