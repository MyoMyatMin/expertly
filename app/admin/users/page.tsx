"use client";
import React, { useState } from "react";
import { Tabs, Tab, Box, Container, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Button, useMediaQuery, useTheme, } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {};

const UsersAction = (props: Props) => {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const reports = [
    {
      id: 1,
      profileImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREOme6vZXapI-HTNJXRwstlO_vjjF59Wt6cQ&s",
      name: "John Doe",
      postLink: "https://www.expertly.com/7670&set=pcb.169272",
      reportedComment: "Nice tits nigga suck my dick",
      reason: "Harassment",
    },
    {
      id: 2,
      profileImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTNjkaQHLXfokbl1GiKnXl6v7GNgnG8rb3JA&s",
      name: "Jane Smith",
      postLink: "https://www.expertly.com/?fbid=169272510490",
      reportedComment: "The earth is flat and u r shit",
      reason: "Misinformation",
    },
  ];

  const appeals = [
    {
      id: 1,
      profileImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDpWYsLSeY1sLvwgFNwBeJGjszUfEofDpwJw&s",
      name: "Jackie Chan",
      postLink: "https://www.expertly.com/?fbid=169272510490",
      reason: "Policy Violation",
      justification:
        "The content complies with the guidelines and was misinterpreted.",
    },
    {
      id: 2,
      profileImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmeeozQjDpmCuL5mB17UZq9s0Z_pxEQwjKDw&s",
      name: "Lana Del Ray",
      postLink: "https://www.expertly.com/7670&set=pcb.1692728351574012",
      reason: "Copyright Infringement",
      justification: "This is my original work, not copied from any source.",
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
          <Box sx={{ mt: 4 }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Profile</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Post Link</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Reported Comments</TableCell>
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
                      <TableCell>{report.reportedComment}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          Suspend
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}

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
                      <TableCell >{appeal.name}</TableCell>
                      <TableCell >{appeal.postLink}</TableCell>
                      <TableCell >{appeal.reason}</TableCell>
                      <TableCell >{appeal.justification}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() =>
                            router.push(`/admin/users/${appeal.id}`)
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

export default UsersAction;
