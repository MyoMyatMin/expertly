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
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Appeals } from "@/types/types";

type AppealTableProps = {
  appeals: Appeals[];
};

type Order = "asc" | "desc";

const AppealTable: React.FC<AppealTableProps> = ({ appeals }) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Appeals>("AppealedByUsername");

  const handleRequestSort = (property: keyof Appeals) => {
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

  const sortedAppeals = appeals.sort((a, b) => {
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

  const paginatedAppeals = sortedAppeals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const tableHeaders = [
    { id: "AppealedByUsername", label: "Appealed By" },
    { id: "Reason", label: "Justification" },
    { id: "TargetReportReason", label: "Reported Reason" },
    { id: "Status", label: "Status" },
    { id: "CreatedAt", label: "Appealed At" },
    { id: "ReviewerName", label: "Reviewed By" },
    { id: "Actions", label: "Actions" },
  ];

  return (
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
            {tableHeaders.map((header) => (
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
                  onClick={() => handleRequestSort(header.id as keyof Appeals)}
                >
                  {header.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedAppeals.map((appeal) => (
            <TableRow key={appeal.AppealID} hover>
              <TableCell>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() =>
                    router.push(`/profile/${appeal.AppealedByUsername.String}`)
                  }
                >
                  {appeal.AppealedByUsername.Valid
                    ? appeal.AppealedByUsername.String
                    : "N/A"}
                </Button>
              </TableCell>
              <TableCell>{appeal.Reason}</TableCell>
              <TableCell>
                {appeal.TargetReportReason.Valid
                  ? appeal.TargetReportReason.String
                  : "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color:
                    appeal.Status.String === "pending" ? "#ff9800" : "#4caf50",
                }}
              >
                {appeal.Status.Valid ? appeal.Status.String : "Unknown"}
              </TableCell>
              <TableCell>
                {appeal.CreatedAt.Valid
                  ? new Date(appeal.CreatedAt.Time).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                {appeal.ReviewerName?.Valid
                  ? appeal.ReviewerName.String
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ borderRadius: "8px" }}
                  onClick={() =>
                    router.push(`/admin/appeals/${appeal.AppealID}`)
                  }
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={appeals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AppealTable;
