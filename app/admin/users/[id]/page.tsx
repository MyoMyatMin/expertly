"use client";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, Box, Avatar, Button } from "@mui/material";

type Props = {};

const AppealDetails = (props: Props) => {
  const appeals = [
    {
      id: 1,
      profileImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDpWYsLSeY1sLvwgFNwBeJGjszUfEofDpwJw&s",
      name: "Jackie Chan",
      email: "jackie.chan@example.com",
      postLink: "https://www.expertly.com/?fbid=169272510490",
      reason: "Policy Violation",
      justification:
        "The content complies with the guidelines and was misinterpreted.",
      reportedComment: "This is an unfair violation notice.",
    },
    {
      id: 2,
      profileImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmeeozQjDpmCuL5mB17UZq9s0Z_pxEQwjKDw&s",
      name: "Lana Del Ray",
      email: "lana.delray@example.com",
      postLink: "https://www.expertly.com/7670&set=pcb.1692728351574012",
      reason: "Copyright Infringement",
      justification: "This is my original work, not copied from any source.",
      reportedComment: "Content flagged without evidence.",
    },
  ];

  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const appeal = appeals.find((a) => a.id === parseInt(id || "", 10));

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
          src={appeal.profileImage}
          sx={{ width: 100, height: 100, mr: 3 }}
        />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {appeal.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "gray" }}>
            {appeal.email}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography variant="h6">Report Details: {appeal.reason}</Typography>
        </Box>

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography variant="h6">
            Reported Comments: {appeal.reportedComment}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography variant="h6">
            Justification: {appeal.justification}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "2px solid #ccc", pb: 2 }}>
          <Typography variant="h6">
            Post/Comment Link: {appeal.postLink}
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
