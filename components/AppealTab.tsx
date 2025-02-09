"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const AppealsTab: React.FC = () => {
  const [appealName, setAppealName] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [justification, setJustification] = useState("");

  const handleSubmitAppeal = () => {
    // Implement your submission logic here
    alert("Appeal Submitted!");
    // Optionally, reset the form fields if needed:
    // setAppealName("");
    // setReportDetail("");
    // setJustification("");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Appeal Form
      </Typography>
      <TextField
        fullWidth
        label="Name"
        value={appealName}
        onChange={(e) => setAppealName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Report Detail"
        value={reportDetail}
        onChange={(e) => setReportDetail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Justification"
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmitAppeal}>
        Submit Appeal
      </Button>
    </Box>
  );
};

export default AppealsTab;
