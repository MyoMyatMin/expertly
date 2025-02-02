"use client";
import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button,MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Paper, } from "@mui/material";

type Admin = {
  name: string;
  email: string;
  role: string;
};

const AdminPanel = () => {
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      role: "moderator",
    });
  const [admins, setAdmins] = useState<Admin[]>([
    { name: "Jackie Chan", email: "jackie.chan@example.com", role: "Admin" },
    { name: "Lana Del Ray", email: "lana.delray@example.com", role: "Moderator" },
  ]);

  const [newAdmin, setNewAdmin] = useState<Admin>({
    name: "",
    email: "",
    role: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleCreateAdmin = () => {
    if (newAdmin.name && newAdmin.email && newAdmin.role) {
      setAdmins([...admins, newAdmin]);
      setNewAdmin({ name: "", email: "", role: "" });
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create New Admin
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
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="Admin">Admin</MenuItem>
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
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin, index) => (
              <TableRow key={index}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
