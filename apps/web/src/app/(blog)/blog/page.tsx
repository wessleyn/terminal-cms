import { Button, Container, Group, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import mantainSvg from './_assets/website-maintenance.svg';
import classes from './MaintenancePage.module.css';

export default function BlogMaintenancePage() {
    return (
        <Container className={classes.root}>
            <div className={classes.inner}>
                <div className={classes.image}>
                    <Image
                        src={mantainSvg}
                        alt="Website under maintenance"
                        style={{ width: '100%', maxWidth: '560px', margin: '0 auto', display: 'block' }}
                    />
                </div>
                <div className={classes.content}>
                    <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                        We&apos;re currently updating our blog to serve you better. The blog section is temporarily
                        unavailable. Please check back soon as we&apos;re working hard to improve your experience.
                    </Text>
                    <Group justify="center">
                        <Button component={Link} href="/" size="md" className={classes.button}>
                            Return to Home Page
                        </Button>
                    </Group>
                </div>
            </div>
        </Container>
    );
}