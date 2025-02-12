"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { api } from "@/helper/axiosInstance";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { ContributorApplication } from "@/types/types";

const ContributorDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [contributor, setContributor] = useState<ContributorApplication | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContributor = async () => {
    try {
      const res = await api.protected.getContributorApplication(id as string);
      setContributor(res);
    } catch (err) {
      console.error("Error fetching contributor application:", err);
      setError("Failed to load contributor details.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await api.protected.updateApplicationStatus(id as string, status);
      router.push("/admin/applications");
    } catch (error) {
      console.error("Failed to update contributor application status:", error);
    }
  };

  useEffect(() => {
    fetchContributor();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !contributor) {
    return (
      <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }}>
        {error || "Contributor not found"}
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 5,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ mr: 4, mb: 3, textAlign: "center" }}>
          <img
            src={contributor.IdentityProof}
            alt="Identity Proof"
            style={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
          />
        </Box>

        <Box sx={{ textAlign: "left", width: "100%", maxWidth: "400px" }}>
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
            <Typography>
              <strong>Name:</strong> {contributor.Name}
            </Typography>
          </Box>
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
            <Typography>
              <strong>ProfileUrl:</strong>{" "}
              <Link
                href={`/profile/${contributor.Username}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#1976d2",
                  textDecoration: "none",
                }}
              >
                {`/profile/${contributor.Username}`}
                <OpenInNewIcon sx={{ ml: 1, fontSize: 16 }} />
              </Link>
            </Typography>
          </Box>
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
            <Typography>
              <strong>Status:</strong> {contributor.Status.String}
            </Typography>
          </Box>
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
            <Typography>
              <strong>Initial Submission:</strong>{" "}
              {contributor.InitialSubmission}
            </Typography>
          </Box>
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
            <Typography sx={{ mb: 2 }}>
              <strong>Expertise Proofs:</strong>
            </Typography>
            {contributor.ExpertiseProofs.map((proof, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mb: 1,
                  maxWidth: "100%",
                  borderRadius: "8px",
                  boxShadow: 1,
                  padding: 1,
                }}
              >
                <CardContent
                  sx={{ flex: 1, display: "flex", alignItems: "center" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ overflowWrap: "break-word", fontSize: "0.875rem" }}
                  >
                    <Link
                      href={proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#1976d2",
                        textDecoration: "none",
                      }}
                    >
                      {proof}
                      <OpenInNewIcon sx={{ ml: 1, fontSize: 16 }} />
                    </Link>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {contributor.ReviewerName?.String && (
            <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
              <Typography>
                <strong>Reviewer:</strong> {contributor.ReviewerName.String}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {contributor.Status.String === "approved" && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" color="success.main">
            This application has been approved.
          </Typography>
        </Box>
      )}

      {contributor.Status.String === "rejected" && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error.main">
            This application has been rejected.
          </Typography>
        </Box>
      )}

      {/* Render buttons only if the status is neither approved nor rejected */}
      {contributor.Status.String !== "approved" &&
        contributor.Status.String !== "rejected" && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 3 }}
              onClick={() => updateStatus("approved")}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => updateStatus("rejected")}
            >
              Reject
            </Button>
          </Box>
        )}
    </>
  );
};

export default ContributorDetail;
