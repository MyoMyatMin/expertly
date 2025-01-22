"use client";
import React, { useState } from "react";
import { Container, Box, TextField, Button, Paper } from "@mui/material";

type FormData = {
  name: string;
  email: string;
  role: string;
  password: string;
};

const AdminForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form Submitted Successfully!");
    setFormData({ name: "", email: "", role: "", password: "" }); // Reset form
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Name Field */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          {/* Role Field */}
          <TextField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          {/* Password Field */}
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          {/* Submit Button */}
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminForm;
