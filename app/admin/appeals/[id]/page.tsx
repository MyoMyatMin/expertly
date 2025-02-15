"use client";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, Box, Avatar, Button } from "@mui/material";
import { api } from "@/helper/axiosInstance";
import { Appeal } from "@/types/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { styled } from "@mui/system";
import { WithModerator } from "@/app/hocs/withAuth";

type Props = {};

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "#1976d2",
  "&:hover": {
    textDecoration: "underline",
  },
});

const AppealDetails = (props: Props) => {
  const { id } = useParams();
  const router = useRouter();
  const [appeal, setAppeal] = useState<Appeal | null>(null);

  const getAppeal = async () => {
    const response = await api.protected.getAppealsByID(id as string);
    setAppeal(response);
  };

  const updateAppeal = async (status: string) => {
    await api.protected.updateAppealStatus(id as string, status);
    getAppeal();
    alert(`Appeal has been ${status}`);
  };

  const handleClick = (status: string) => {
    updateAppeal(status);
  };

  useEffect(() => {
    getAppeal();
  }, []);

  if (!appeal) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4, textAlign: "center" }}>
          Appeal not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5, maxWidth: "700px" }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
        Appeal Details
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar
          src="https://unsplash.com/photos/1vZMjYzZp0Y"
          sx={{ width: 100, height: 100, mr: 3 }}
        />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {appeal.AppealedByName.Valid ? (
              <StyledLink href={`/profile/${appeal.TargetUserUsername.String}`}>
                {appeal.AppealedByName.String}
              </StyledLink>
            ) : (
              "Unknown"
            )}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>Report Details:</strong>{" "}
            {appeal.TargetReportReason.Valid
              ? appeal.TargetReportReason.String
              : "N/A"}
          </Typography>
        </Box>

        {appeal.CommentContent.Valid && (
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
            <Typography>
              <strong>Reported Comments:</strong> {appeal.CommentContent.String}
            </Typography>
          </Box>
        )}

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>Justification:</strong> {appeal.AppealReason}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>Appeal Status:</strong> {appeal.AppealStatus.String}
          </Typography>
        </Box>
        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>Post/Comment Link:</strong>
            {appeal.PostSlug.Valid ? (
              <StyledLink href={`/posts/${appeal.PostSlug.String}`}>
                {appeal.PostSlug.String}
              </StyledLink>
            ) : (
              "N/A"
            )}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>User Suspended until:</strong>
            {appeal.TargetUserSuspendedUntil.Valid
              ? new Date(appeal.TargetUserSuspendedUntil.Time).toLocaleString()
              : "N/A"}
          </Typography>
        </Box>
      </Box>

      {/* Conditionally render Resolve and Dismiss buttons */}
      {appeal.AppealStatus.String === "pending" ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mt: 5,
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => handleClick("resolved")}
          >
            Resolve
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => handleClick("dismissed")}
          >
            Dismiss
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 5, mb: 3 }}>
          <Typography>
            <strong>Reviewed By:</strong> {appeal.ReviewerName.String}
          </Typography>
          <Typography>
            <strong>Reviewed At:</strong>{" "}
            {new Date(appeal.ReviewedAt.Time).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default WithModerator(AppealDetails);
