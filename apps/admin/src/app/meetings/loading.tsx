import { Container, Group, Paper, Skeleton, Title } from "@mantine/core";

export default function MeetingsLoading() {
    return (
        <Container size="xl" p="md">
            <Group justify="space-between" mb="lg">
                <Title order={2}>Project Meetings</Title>
                <Skeleton height={28} width={80} radius="xl" />
            </Group>

            <Skeleton height={20} width="70%" mb="xl" />

            {/* Timeline skeleton */}
            <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: 'var(--mantine-color-gray-3)',
                        transform: 'translateX(-50%)',
                        zIndex: 0
                    }}
                />

                {/* Timeline elements */}
                {[1, 2, 3].map((_, index) => (
                    <div key={index} style={{ position: 'relative', marginBottom: '60px' }}>
                        <div style={{
                            width: '45%',
                            marginLeft: index % 2 === 0 ? '0' : '55%'
                        }}>
                            <Paper p="md" withBorder radius="md" style={{ position: 'relative' }}>
                                {/* Meeting header */}
                                <Group mb="md">
                                    <Skeleton height={24} width="60%" radius="sm" />
                                    <Skeleton height={22} width={80} radius="xl" ml="auto" />
                                </Group>

                                {/* Meeting content */}
                                <Skeleton height={20} width="80%" mb="sm" />
                                <Skeleton height={20} width="90%" mb="sm" />

                                {/* Meeting footer */}
                                <Group mt="md">
                                    <Skeleton height={18} width="30%" radius="sm" />
                                    <Skeleton height={18} width={100} radius="sm" ml="auto" />
                                </Group>
                            </Paper>
                        </div>

                        {/* Timeline dot */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '20px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--mantine-color-blue-6)',
                            transform: 'translateX(-50%)',
                            zIndex: 1
                        }} />
                    </div>
                ))}
            </div>
        </Container>
    );
}