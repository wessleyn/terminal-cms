import { Box, Container, Paper } from "@mantine/core";
import { Metadata } from "next";
import EmailList from "./_components/EmailList";
import EmailSelector from "./_components/EmailSelector";
import FilterHeader from "./_components/FilterHeader";

export const metadata: Metadata = {
    title: "All Mails",
    description: "Manage your email communications.",
};

export default async function AllMailsPage() {
    return (
        <Container p={0} fluid>
            <Paper
                withBorder={false}
                p="md"
                px="lg"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
                radius="md">
                <FilterHeader />
                <EmailSelector />
                <Box mt="md">
                    <EmailList />
                </Box>
            </Paper>
        </Container>
    )
}