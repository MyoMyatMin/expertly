"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { WithAdmin } from "@/app/hocs/withAuth";
import { Moderators } from "../../../types/types";
import { api } from "@/helper/axiosInstance";

const AdminCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "moderator",
  });

  const [moderators, setModerators] = useState<Moderators[]>([]);
  const fetchModerators = async () => {
    try {
      const response = await api.protected.getAllModerators();
      setModerators(response);
    } catch (err) {
      console.error("Failed to fetch moderators", err);
    }
  };
  useEffect(() => {
    fetchModerators();
  }, []);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "moderator",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAdmin = () => {
    const response = api.protected.createModerator(
      newAdmin.name,
      newAdmin.email,
      newAdmin.password,
      newAdmin.role
    );
    fetchModerators();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create New Admin or Moderators
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Name"
            name="name"
            value={newAdmin.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={newAdmin.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            value={newAdmin.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          ></TextField>
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="moderator">Moderator</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAdmin}
            sx={{ height: "56px" }}
          >
            Create
          </Button>
        </Box>
      </Paper>

      {/* Admin Table */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Admins List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moderators.map((moderator, index) => (
              <TableRow key={index}>
                <TableCell>{moderator.Name}</TableCell>
                <TableCell>{moderator.Email}</TableCell>
                <TableCell>{moderator.Role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default WithAdmin(AdminCreate);
