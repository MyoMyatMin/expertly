"use client";
import { useParams } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";

type Contributor = {
  id: number;
  name: string;
  email: string;
  expertise: string;
  citizenCard: string;
};

const contributors: Contributor[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    expertise: "https://github.com/johndoe",
    citizenCard:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF1R1FHmp2htb-LKOPqERYAfA_1Du9n855Ww&s",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@gmail.com",
    expertise: "https://github.com/janesmith",
    citizenCard:
      "https://www.citizencard.com/images/sample-cards/UK-ID-card-for-over-18s-2018-design-old.jpg",
  },
];

const ContributorDetail = () => {
  const { id } = useParams();

  // Find the contributor by ID
  const contributor = contributors.find(
    (contributor) => contributor.id === Number(id)
  );

  if (!contributor) {
    return (
      <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }}>
        Contributor not found
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
            src={contributor.citizenCard}
            alt="Citizen Card"
            style={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
          />
        </Box>

        <Box sx={{ textAlign: "left", width: "100%", maxWidth: "400px" }}>
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
            <Typography><strong>Name:</strong> {contributor.name}</Typography>
          </Box>
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
            <Typography><strong>Email:</strong> {contributor.email}</Typography>
          </Box>
          <Box sx={{ borderBottom: "2px solid #ccc", pb: 2, mb: 2 }}>
            <Typography><strong>Expertise:</strong> {contributor.expertise}</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mr: 3 }}
        >
          Approve
        </Button>
        <Button variant="outlined" color="secondary" size="large">
          Reject
        </Button>
      </Box>
    </>
  );
};

export default ContributorDetail;
