"use client";
import React, { useState, useContext } from "react";
import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/AuthProvider";

const Signup: React.FC = () => {
  const router = useRouter();
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    await signup(formData.email, formData.password, formData.name);

    //router.push("/profile");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{ p: 4, width: "100%", maxWidth: 600, textAlign: "center" }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "primary.main", mb: 2 }}
        >
          Welcome to Expertly!
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onAbort={handleSubmit}
            sx={{ mt: 2, py: 1, fontSize: "1rem", fontWeight: 600 }}
          >
            Sign Up
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link
            component="button"
            onClick={() => router.push("/signin")}
            sx={{ fontWeight: 600, cursor: "pointer", color: "primary.main" }}
          >
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
