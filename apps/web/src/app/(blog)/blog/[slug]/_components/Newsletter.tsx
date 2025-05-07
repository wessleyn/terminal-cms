'use client';

import { Box, Button, Container, Group, Text, TextInput, Title } from '@repo/ui/components/mantine';
import { useState } from 'react';
// import { addToNewsletter } from '../../[...slug]/_actions/addToNewsLetter';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append('email', email);
            
            // const result = await addToNewsletter(formData);
            
            // if (result.success) {
            //     setMessage({ type: 'success', text: result.message });
            //     setEmail('');
            // } else {
            //     setMessage({ type: 'error', text: result.message });
            // }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: 'An unexpected error occurred. Please try again.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Box py={40} >
            <Container size="sm" ta="center">
                <Title order={2} mb="sm">Subscribe to our newsletter</Title>
                <Text c="dimmed" mb="lg">
                    Get the latest posts and updates delivered to your inbox.
                </Text>
                
                <form onSubmit={handleSubmit}>
                    <Group justify="center">
                        <TextInput
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            style={{ width: '300px' }}
                            disabled={isSubmitting}
                            required
                        />
                        <Button type="submit" loading={isSubmitting}>
                            Subscribe
                        </Button>
                    </Group>
                </form>
                
                {message && (
                    <Text 
                        mt="lg" 
                        c={message.type === 'success' ? 'green' : 'red'}
                    >
                        {message.text}
                    </Text>
                )}
            </Container>
        </Box>
    );
}
