'use client';

import { useForm } from '@mantine/form';
import { Alert, Button, Group, Stack, Textarea, TextInput } from '@repo/ui/components/mantine';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { CommentFormValues, submitComment } from '../../../_actions/submitComment';
import styles from './CommentForm.module.css';

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

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
                {submissionState === 'success' && (
                    <Alert title="Success" color="green" withCloseButton onClose={() => setSubmissionState('idle')}>
                        {submissionMessage}
                    </Alert>
                )}

                {submissionState === 'error' && (
                    <Alert title="Error" color="red" icon={<IconAlertCircle size={18} />} withCloseButton onClose={() => setSubmissionState('idle')}>
                        {submissionMessage}
                    </Alert>
                )}

                <Group grow>
                    <TextInput
                        label="Name"
                        placeholder="Your name"
                        withAsterisk
                        classNames={{
                            input: styles.formInput,
                            label: styles.formLabel,
                            error: styles.formError
                        }}
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        label="Email"
                        placeholder="your.email@example.com"
                        withAsterisk
                        classNames={{
                            input: styles.formInput,
                            label: styles.formLabel,
                            error: styles.formError
                        }}
                        {...form.getInputProps('email')}
                    />
                </Group>

                <TextInput
                    label="Website"
                    placeholder="https://yourwebsite.com"
                    classNames={{
                        input: styles.formInput,
                        label: styles.formLabel,
                        error: styles.formError
                    }}
                    {...form.getInputProps('website')}
                />

                <Textarea
                    label="Comment"
                    placeholder="Write your thoughts here"
                    minRows={3}
                    withAsterisk
                    classNames={{
                        input: styles.textarea,
                        label: styles.formLabel,
                        error: styles.formError
                    }}
                    {...form.getInputProps('message')}
                />

                <Group className={styles.buttonContainer} justify="flex-end">
                    <Button
                        type="submit"
                        loading={submissionState === 'submitting'}
                        variant="subtle"
                        color="green"
                        size="sm"
                        radius="xs"
                        className={styles.submitButton}
                    >
                        {parentId ? 'Reply' : 'Post Comment'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}