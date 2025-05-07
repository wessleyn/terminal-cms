'use client';

import { useForm } from '@mantine/form';
import { Alert, Button, Group, Stack, Textarea, TextInput } from '@repo/ui/components/mantine';
import { IconAlertCircle, IconMessageCircle2, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { CommentFormValues, submitComment } from '../../../_actions/submitComment';

interface CommentFormProps {
    postId: string;
    slug: string; // Add slug prop for route revalidation
    parentId?: string | null;
    onSuccess?: () => void;
}

export default function CommentForm({ postId, slug, parentId = null, onSuccess }: CommentFormProps) {
    const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [submissionMessage, setSubmissionMessage] = useState<string>('');

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            website: '',
            message: '',
            postId,
            parentId,
            slug, // Add slug to form values
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            website: (value) => {
                if (!value) return null;
                try {
                    new URL(value);
                    return null;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    return 'Invalid URL';
                }
            },
            message: (value) => (value.length < 5 ? 'Comment must be at least 5 characters' : null),
        },
    });

    const handleSubmit = async (values: CommentFormValues) => {
        setSubmissionState('submitting');
        try {
            const result = await submitComment(values);

            if (result.success) {
                setSubmissionState('success');
                setSubmissionMessage(result.message);
                form.reset();
                if (onSuccess) onSuccess();
            } else {
                setSubmissionState('error');
                setSubmissionMessage(result.message);

                // Set form errors from the server response if available
                if (result.errors) {
                    const formErrors: Record<string, string> = {};
                    result.errors.forEach(err => {
                        formErrors[err.path] = err.message;
                    });
                    form.setErrors(formErrors);
                }
            }
        } catch (error) {
            setSubmissionState('error');
            setSubmissionMessage('An unexpected error occurred. Please try again.');
            console.error('Comment submission error:', error);
        }
    };

    // Custom styles for borderless inputs
    const inputStyles = {
        input: {
            border: 'none',
            borderBottom: '1px solid var(--mantine-color-gray-4)',
            borderRadius: 0,
            padding: '8px 0',
            '&:focus': {
                borderColor: 'var(--mantine-color-green-6)',
                boxShadow: 'none',
            },
        },
        label: {
            marginBottom: '4px',
        },
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
                {submissionState === 'success' && (
                    <Alert title="Success" color="green" withCloseButton onClose={() => setSubmissionState('idle')}>
                        {submissionMessage}
                    </Alert>
                )}

                {submissionState === 'error' && (
                    <Alert title="Error" color="red" icon={<IconAlertCircle />} withCloseButton onClose={() => setSubmissionState('idle')}>
                        {submissionMessage}
                    </Alert>
                )}

                <Group grow>
                    <TextInput
                        leftSection={<IconUser size={16} />}
                        label="Name"
                        placeholder="Your name"
                        withAsterisk
                        styles={inputStyles}
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        label="Email"
                        placeholder="your.email@example.com"
                        withAsterisk
                        styles={inputStyles}
                        {...form.getInputProps('email')}
                    />
                </Group>

                <TextInput
                    label="Website"
                    placeholder="https://yourwebsite.com"
                    styles={inputStyles}
                    {...form.getInputProps('website')}
                />

                <Textarea
                    leftSection={<IconMessageCircle2 size={16} />}
                    label="Comment"
                    placeholder="Write your thoughts here"
                    minRows={4}
                    withAsterisk
                    styles={{
                        ...inputStyles,
                        input: {
                            ...inputStyles.input,
                            minHeight: '100px',
                        },
                    }}
                    {...form.getInputProps('message')}
                />

                <Group justify="flex-end">
                    <Button
                        type="submit"
                        loading={submissionState === 'submitting'}
                        variant="outline"
                        color="green"
                    >
                        {parentId ? 'Reply' : 'Post Comment'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}