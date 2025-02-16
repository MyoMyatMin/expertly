"use client";
import React from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

type ReportModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  reportReason: string;
  setReportReason: (value: string) => void;
};

const ReportModal = ({
  open,
  onClose,
  onSubmit,
  reportReason,
  setReportReason,
}: ReportModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{ bgcolor: "background.paper", p: 4, borderRadius: 2, width: 400 }}
      >
        <Typography variant="h6" gutterBottom>
          Report Post
        </Typography>

        <TextField
          select
          fullWidth
          label="Choose Reason"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ mb: 2 }}
        >
          <option value="" disabled></option>
          <option value="Misinformation">Misinformation</option>
          <option value="Policy Violation">Policy Violation</option>
          <option value="Privacy Concern">Privacy Concern</option>
          <option value="Copyright Issue">Copyright Issue</option>
          <option value="Harassment">Harassment</option>
        </TextField>

        <Button
          variant="contained"
          color="error"
          onClick={() => onSubmit(reportReason)}
          sx={{ mr: 2 }}
        >
          Submit
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default ReportModal;
