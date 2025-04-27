'use client';

import { Card, Center, Group, Text, useMantineTheme } from '@mantine/core';
import { IconEye, IconMessageCircle } from '@tabler/icons-react';
import classes from './ArticleCard.module.css';

const ArticleCard = () => {
    const theme = useMantineTheme();

    return (
        <Card
            p="lg"
            shadow="lg"
            className={classes.card}
            radius="md"
            component="a"
            href="https://mantine.dev/" // Current Url + article link , for dev!!
            target="_blank"
        >
            <div
                className={classes.image}
                style={{
                    backgroundImage:
                        'url(https://media.istockphoto.com/id/2176122055/photo/software-development-concept-hands-typing-on-laptop-with-programming-code-on-screen.jpg?s=612x612&w=is&k=20&c=9jVJ1ORAgY_oGw-d70KmyKES5MQc0JutBTXHZUMqMeQ=)',
                }}
            />
            <div className={classes.overlay} />

            <div className={classes.content}>
                <div>
                    <Text size="lg" className={classes.title} fw={500}>
                        Journey to Swiss Alps
                    </Text>

                    <Group justify="space-between" gap="xs">
                        <Text size="sm" className={classes.author}>
                            Robert Gluesticker
                        </Text>

                        <Group gap="lg">
                            <Center>
                                <IconEye size={16} stroke={1.5} color={theme.colors.dark[2]} />
                                <Text size="sm" className={classes.bodyText}>
                                    7847
                                </Text>
                            </Center>
                            <Center>
                                <IconMessageCircle size={16} stroke={1.5} color={theme.colors.dark[2]} />
                                <Text size="sm" className={classes.bodyText}>
                                    5
                                </Text>
                            </Center>
                        </Group>
                    </Group>
                </div>
            </div>
        </Card>
    );
}

export default ArticleCard;