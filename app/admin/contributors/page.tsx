"use client";
import React, { useState } from "react";
import { Tabs, Tab, Box, Container, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Button, useMediaQuery, useTheme, } from "@mui/material";
import { useRouter } from "next/navigation";

type Report = {
  id: number;
  profileImage: string;
  name: string;
  postLink: string;
  reason: string;
};

type Appeal = {
  id: number;
  profileImage: string;
  name: string;
  postLink: string;
  reason: string;
  justification: string;
};

type Props = {};

const reports: Report[] = [
  {
    id: 1,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRij6dtiHizH96qpCOe8WeXXP3yLyQJkPdGVg&s",
    name: "John Doe",
    postLink: "https://www.expertly.com/?fbid=169272510490",
    reason: "Harassment",
  },
  {
    id: 2,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSezGMv73fTeInDK5vBdSIlQqxDYjG3Wn9lLw&s",
    name: "Jane Smith",
    postLink: "https://www.expertly.com/7670&set=pcb.1692728351574012",
    reason: "Misinformation",
  },
];

const appeals: Appeal[] = [
  {
    id: 1,
    profileImage:
      "https://cdn.prod.website-files.com/6600e1eab90de089c2d9c9cd/662c092880a6d18c31995e13_66236537d4f46682e079b6ce_Casual%2520Portrait.webp",
    name: "Michael Lee",
    postLink: "https://www.expertly.com/?fbid=169272510490",
    reason: "Policy Violation",
    justification:
      "The post was misunderstood, and it followed the policy guidelines.",
  },
  {
    id: 2,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRinxUlZyH5cwOafVdjDcAxHgoFIxolEy_gkw&s",
    name: "Emily Clark",
    postLink: "https://www.expertly.com/7670&set=pcb.1692728351574012",
    reason: "Copyright Infringement",
    justification: "The content is original and not a copyright violation.",
  },
];

const ManageContributors = (props: Props) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Container>
        {/* Tabs for switching between Reports and Appeals */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered={!isSmallScreen}
          variant={isSmallScreen ? "scrollable" : "standard"}
          scrollButtons={isSmallScreen ? "auto" : undefined}
        >
          <Tab label="Reports" />
          <Tab label="Appeals" />
        </Tabs>

        {/* Report Table */}
        {tabValue === 0 && (
          <Box sx={{ mt: 4 }}>
            <Table
              sx={{
                display: { xs: "block", sm: "table" },
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Post Link</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Avatar src={report.profileImage} alt={report.name} />
                    </TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.postLink}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mr: 1 }}
                      >
                        Suspend
                      </Button>
                      <Button variant="outlined" color="secondary">
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Appeal Table */}
        {tabValue === 1 && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Profile</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Post Link</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Reason</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Justification</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appeals.map((appeal) => (
                    <TableRow key={appeal.id}>
                      <TableCell>
                        <Avatar src={appeal.profileImage} alt={appeal.name} />
                      </TableCell>
                      <TableCell>{appeal.name}</TableCell>
                      <TableCell>{appeal.postLink}</TableCell>
                      <TableCell>{appeal.reason}</TableCell>
                      <TableCell>{appeal.justification}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() =>
                            router.push(`/admin/contributors/${appeal.id}`)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
};

export default ManageContributors;
