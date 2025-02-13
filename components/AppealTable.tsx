"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Report } from "@/types/types";

type ReportTableProps = {
  reports: Report[];
};

const ReportTable: React.FC<ReportTableProps> = ({ reports }) => {
  const router = useRouter();

  return (
    <Box sx={{ mt: 4, overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
              Reported By
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
              Target User
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
              Reason
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
              Reported Content
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.ReportID}>
              <TableCell>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() =>
                    router.push(`/profile/${report.ReportedByUsername.String}`)
                  }
                >
                  {report.ReportedByName.Valid
                    ? report.ReportedByName.String
                    : "N/A"}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() =>
                    router.push(`/profile/${report.TargetUsername.String}`)
                  }
                >
                  {report.TargetName.Valid ? report.TargetName.String : "N/A"}
                </Button>
              </TableCell>
              <TableCell>{report.Reason}</TableCell>
              <TableCell>
                {report.Status.Valid ? report.Status.String : "Unknown"}
              </TableCell>
              <TableCell>
                {report.TargetPostSlug.Valid ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      router.push(`/posts/${report.TargetPostSlug.String}`)
                    }
                  >
                    View Post
                  </Button>
                ) : report.TargetComment.Valid ? (
                  <Box>
                    <p>{report.TargetComment.String}</p>
                  </Box>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() =>
                    router.push(`/admin/reports/${report.ReportID}`)
                  }
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ReportTable;

// {tabValue === 1 && (
//   <Box sx={{ mt: 4 }}>
//     <Box sx={{ overflowX: "auto" }}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
//               Profile
//             </TableCell>
//             <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
//               Name
//             </TableCell>
//             <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
//               Post Link
//             </TableCell>
//             <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
//               Reason
//             </TableCell>
//             <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
//               Justification
//             </TableCell>
//             <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>
//               Action
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {appeals.map((appeal) => (
//             <TableRow key={appeal.id}>
//               <TableCell>
//                 <Avatar src={appeal.profileImage} alt={appeal.name} />
//               </TableCell>
//               <TableCell>{appeal.name}</TableCell>
//               <TableCell>{appeal.postLink}</TableCell>
//               <TableCell>{appeal.reason}</TableCell>
//               <TableCell>{appeal.justification}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   size="small"
//                   onClick={() =>
//                     router.push(`/admin/users/${appeal.id}`)
//                   }
//                 >
//                   View
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </Box>
//   </Box>
// )}
