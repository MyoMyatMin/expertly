"use client";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, Box, Avatar, Button } from "@mui/material";
import { api } from "@/helper/axiosInstance";
import { Appeal } from "@/types/types";
import { useState } from "react";
type Props = {};

const AppealDetails = (props: Props) => {
  const { id } = useParams();
  const router = useRouter();
  const [appeal, setAppeal] = useState<Appeal | null>(null);

  const getAppeal = async () => {
    const response = await api.protected.getAppealsByID(id as string);
    setAppeal(response);
  };

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
            {appeal.AppealedByName.Valid
              ? appeal.AppealedByName.String
              : "Unknown"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>Report Details:</strong> {appeal.AppealReason}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>Reported Comments:</strong>{" "}
            {appeal.CommentContent.Valid
              ? appeal.CommentContent.String
              : "No comments found"}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>Justification:</strong> {appeal.AppealReason}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography>
            <strong>Post/Comment Link:</strong>{" "}
            {appeal.PostSlug.Valid ? appeal.PostSlug.String : "N/A"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 5, mb: 3 }}
      >
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => router.push("/admin/users")}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => router.push("/admin/users")}
        >
          Decline
        </Button>
      </Box>
    </Container>
  );
};

export default AppealDetails;
