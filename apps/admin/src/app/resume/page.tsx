import { Container } from '@mantine/core';

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume ",
    description: "Manage your certification.",
};

export default async function ResumePage() {
    return <Container>
        <p>
            Resume
        </p>
    </Container>
}
