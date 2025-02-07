"use client";
import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/AuthProvider";

const SignIn: React.FC = () => {
  const router = useRouter();
  const { signin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isModerator, setIsModerator] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsModerator(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signin form submitted:", formData, "Moderator:", isModerator);
    try {
      await signin(formData.email, formData.password, isModerator);
    } catch (err) {
      console.error("Error during signin:", err);
    }
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
          <FormControlLabel
            control={
              <Switch checked={isModerator} onChange={handleSwitchChange} />
            }
            label="Sign in as Moderator"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1, fontSize: "1rem", fontWeight: 600 }}
          >
            Sign In
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link
            component="button"
            onClick={() => router.push("/auth/signup")}
            sx={{ fontWeight: 600, cursor: "pointer", color: "primary.main" }}
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignIn;
