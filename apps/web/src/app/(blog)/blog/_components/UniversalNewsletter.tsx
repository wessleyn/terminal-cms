'use client';

import { Button, Container, Group, Paper, Text, TextInput, Title } from '@mantine/core';
import { resetTurnstile, Turnstile } from '@repo/ui/components/shared/Turnstile';
import { IconMail } from '@tabler/icons-react';
import { useState } from 'react';
import { subscribeNewsletter } from '../_actions/subscribeNewsletter';
import { SubscriptionType } from '../_actions/types';

interface UniversalNewsletterProps {
    type: SubscriptionType;
    postId?: string;
    category?: string;
    title?: string;
    subtitle?: string;
}

export default function UniversalNewsletter({
    type,
    postId,
    category,
    title = 'Subscribe to our newsletter',
    subtitle = 'Stay updated with our latest articles, tutorials, and insights.'
}: UniversalNewsletterProps) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    // Get type-specific context for messages
    const getContextName = () => {
        switch (type) {
            case 'category':
                return category ? `the ${category.toLowerCase()} category` : 'this category';
            case 'post':
                return 'this post';
            case 'blog':
            default:
                return 'our blog';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Check if Turnstile token exists (skip in development mode)
            if (process.env.NODE_ENV === 'production' && !turnstileToken) {
                setMessage({
                    type: 'error',
                    text: 'Please complete the captcha before subscribing.'
                });
                setIsSubmitting(false);
                return;
            }

            const formData = new FormData();
            formData.append('email', email);
            formData.append('type', type);

            if (type === 'post' && postId) {
                formData.append('postId', postId);
            }

            if (type === 'category' && category) {
                formData.append('category', category);
            }

            // Add Turnstile token if available
            if (turnstileToken) {
                formData.append('cf-turnstile-response', turnstileToken);
            }

            const result = await subscribeNewsletter(formData);

            if (result.success) {
                setMessage({ type: 'success', text: result.message || `Successfully subscribed to ${getContextName()}!` });
                setEmail('');
                // Reset Turnstile after successful submission
                resetTurnstile();
                setTurnstileToken(null);
            } else {
                setMessage({
                    type: 'error',
                    text: result.errors  ? result.errors[0]!.message : 'Something went wrong. Please try again.'
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            setMessage({
                type: 'error',
                text: 'An unexpected error occurred. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Turnstile verification
    const handleTurnstileVerify = (token: string) => {
        setTurnstileToken(token);
        // Clear any previous error message related to captcha
        if (message?.text?.includes('captcha')) {
            setMessage(null);
        }
    };

    return (
        <Container size="sm" py="xl" style={{ marginBottom: '3rem' }}>
            <Paper
                withBorder
                shadow="md"
                p={30}
                mt={30}
                radius="md"
            >
                <Title ta="center" order={2}>{title}</Title>
                <Text ta="center" c="dimmed" mt="md" mb="xl">
                    {subtitle}{' '}
                    We promise not to spam your inbox!
                </Text>

                <form onSubmit={handleSubmit}>
                    <Group justify="center" mb="md">
                        <TextInput
                            placeholder="Your email address"
                            style={{ flexGrow: 1, maxWidth: '300px' }}
                            leftSection={<IconMail size={16} />}
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            disabled={isSubmitting}
                            required
                        />
                        <Button type="submit" loading={isSubmitting}>Subscribe</Button>
                    </Group>

                    {/* Cloudflare Turnstile captcha */}
                    <Group justify="center" mb="md">
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABMxM4cbQf-x_3Cs'}
                            theme="dark"
                            action="newsletter"
                            onVerify={handleTurnstileVerify}
                        />
                    </Group>
                </form>

                {message && (
                    <Text
                        ta="center"
                        mt="lg"
                        c={message.type === 'success' ? 'green' : 'red'}
                    >
                        {message.text}
                    </Text>
                )}
            </Paper>
        </Container>
    );
}