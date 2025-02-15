"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Report } from "@/types/types";

type ReportTableProps = {
  reports: Report[];
  updateStatus: (reportID: string, status: string) => void;
};

type Order = "asc" | "desc";

const ReportTable: React.FC<ReportTableProps> = ({ reports, updateStatus }) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Report>("ReportedByName");

  const handleRequestSort = (property: keyof Report) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedReports = reports?.sort((a, b) => {
    if (a[orderBy] !== null && b[orderBy] !== null) {
      if (a[orderBy] < b[orderBy]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const paginatedReports = sortedReports?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ mt: 4, overflowX: "auto" }}>
        <Table
          sx={{
            minWidth: 800,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {[
                { id: "ReportedByName", label: "Reported By" },
                { id: "TargetName", label: "Target User" },
                { id: "Reason", label: "Reason" },
                { id: "Status", label: "Status" },
                { id: "TargetComment", label: "Reported Post/Comment" },
                { id: "ReviewedBy", label: "Reviewed By" },
                { id: "ReviewedAt", label: "Reviewed At" },
                { id: "CreatedAt", label: "Created At" },
                { id: "Actions", label: "Actions" },
              ].map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    padding: "12px",
                  }}
                  sortDirection={orderBy === header.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === header.id}
                    direction={orderBy === header.id ? order : "asc"}
                    onClick={() => handleRequestSort(header.id as keyof Report)}
                  >
                    {header.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReports?.map((report?) => (
              <TableRow key={report?.ReportID} hover>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() =>
                      router.push(
                        `/profile/${report?.ReportedByUsername.String}`
                      )
                    }
                  >
                    {report?.ReportedByName.Valid
                      ? report?.ReportedByName.String
                      : "N/A"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() =>
                      router.push(`/profile/${report?.TargetUsername.String}`)
                    }
                  >
                    {report?.TargetName.Valid
                      ? report?.TargetName.String
                      : "N/A"}
                  </Button>
                </TableCell>
                <TableCell sx={{ color: "#ff1744" }}>
                  {report?.Reason}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      report?.Status.String === "pending"
                        ? "#ff9800"
                        : "#4caf50",
                  }}
                >
                  {report?.Status.Valid ? report?.Status.String : "Unknown"}
                </TableCell>
                <TableCell>
                  {report?.TargetComment.Valid ? (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "#616161" }}
                      >
                        "{report?.TargetComment.String}"
                      </Typography>
                      {report?.TargetPostSlug.Valid && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() =>
                            router.push(
                              `/posts/${report?.TargetPostSlug.String}`
                            )
                          }
                        >
                          View Post
                        </Button>
                      )}
                    </Box>
                  ) : report?.TargetPostSlug.Valid ? (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "#616161" }}
                      >
                        "Reported Post"
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() =>
                          router.push(`/posts/${report?.TargetPostSlug.String}`)
                        }
                      >
                        View Post
                      </Button>
                    </Box>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {report?.ReviewerName.Valid
                    ? report?.ReviewerName.String
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {report?.ReviewedAt.Valid
                    ? new Date(report?.ReviewedAt.Time).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {report?.CreatedAt.Valid
                    ? new Date(report?.CreatedAt.Time).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {report?.Status.String === "pending" ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ borderRadius: "8px", mr: 1 }}
                        onClick={() =>
                          updateStatus(report?.ReportID, "resolved")
                        }
                      >
                        Resolve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ borderRadius: "8px" }}
                        onClick={() =>
                          updateStatus(report?.ReportID, "dismissed")
                        }
                      >
                        Dismiss
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ color: "#757575" }}>
                      {report?.Status.String === "resolved"
                        ? "Resolved"
                        : "Dismissed"}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reports?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
};

export default ReportTable;
