"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

type Contributor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  citizenCard: string;
  expertise: string;
};

const Applications: React.FC = () => {
  const router = useRouter();

  const contributors: Contributor[] = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe11@gmail.com",
      phone: "082-456-7890",
      citizenCard: "https://example.com/citizen-john.jpg",
      expertise: "https://github.com/johndoe",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      phone: "061-654-3210",
      citizenCard: "https://example.com/citizen-jane.jpg",
      expertise: "https://github.com/janesmith",
    },
  ];

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contributors.map((contributor) => (
              <TableRow key={contributor.id}>
                <TableCell align="center">{contributor.name}</TableCell>
                <TableCell align="center">{contributor.email}</TableCell>
                <TableCell align="center">{contributor.phone}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      router.push(`/admin/applications/${contributor.id}`)
                    }
                  >
                    See Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Applications;
