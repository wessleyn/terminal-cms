'use client';

import { Avatar, Button, Center, Flex, Loader, Paper, Text } from "@mantine/core";
import { getCurrentUser, SignOut } from "@repo/auth/src/utils";
import { UserRole } from "@repo/db";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define a type for the user session
type UserSession = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole | string;
}

export default function Page() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const userData = await getCurrentUser();
        // Ensure all required fields are present before setting the session
        if (userData && userData.id) {
          setSession({
            id: userData.id,
            name: userData.name || null,
            email: userData.email || null,
            // Handle the case where image might not exist
            image: 'image' in userData ? userData.image || null : null,
            role: userData.role,
          });
        } else {
          setError("Invalid user data returned");
        }
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await SignOut();
  };

  if (loading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !session) {
    return (
      <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
        <Text c="red" ta="center">
          {error || "User session not available"}
        </Text>
      </Paper>
    );
  }

  return (
    <>
      <Flex justify="space-between" align="center" mb="md">
        <Button onClick={handleSignOut} variant="outline" color="red">
          Sign Out
        </Button>
        <Button component={Link} href="/" variant="outline" color="green">
          Return to Portfolio
        </Button>
      </Flex>

      <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
        <Avatar
          src={session.image}
          size={120}
          radius={120}
          mx="auto"
        />
        <Text ta="center" fz="lg" fw={500} mt="md">
          {session.name}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {session.email}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {session.role}
        </Text>
      </Paper>
    </>
  );
}