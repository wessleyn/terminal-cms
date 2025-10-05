import { Container, Paper } from "@mantine/core";
import { Metadata } from "next";
import fetchAllMails from "./_actions/fetchAllMails";
import EmailPage from "./_components/EmailPage";

export const metadata: Metadata = {
    title: "All Mails",
    description: "Manage your email communications.",
};

export default async function AllMailsPage() {
    const emails = await fetchAllMails()
    return (
        <Container p={0} fluid>
            <Paper
                withBorder={false}
                p="md"
                px="lg"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
                radius="md">
               <EmailPage emails={emails} />
            </Paper>
        </Container>
    )
}