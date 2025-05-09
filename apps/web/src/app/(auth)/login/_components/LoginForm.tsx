'use client'

import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { MagicSignIn, registerWithMagicLink, socialSignIn } from '@repo/auth/src/utils';
import {
    Alert,
    Anchor,
    Button,
    Center,
    Checkbox,
    Divider,
    Group,
    Paper,
    Skeleton,
    Stack,
    Text,
    TextInput
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useActionState, useEffect, useState } from 'react';
import { GoogleIcon } from '../../_components/GoogleButton';
import styles from './LoginForm.module.css';
import { GithubIcon } from "@mantinex/dev-icons"

// Create a wrapper function for socialSignIn that accepts string | undefined as its parameter
// This makes it compatible with useActionState's expected signature
const socialSignInWrapper = (state: string | undefined, formData?: FormData) => {
    if (!formData) return Promise.resolve(undefined);
    
    // The socialSignIn function will cause a redirect and won't actually return anything
    // We don't need to catch errors here - the redirect is intentional
    return socialSignIn(formData);
};

export default function LoginForm({
    callbackUrl,
    error,
    clearUrlParams = false
}: {
    callbackUrl: string,
    error?: string,
    clearUrlParams?: boolean
}) {
    // Use the wrapper function that's compatible with useActionState
    const [errorMessage, formAction, isPending] = useActionState(socialSignInWrapper, undefined);
    const [type, toggle] = useToggle(['login', 'register']);
    const [magicLinkLoading, setMagicLinkLoading] = useState(false);
    const [formError, setFormError] = useState<string | undefined>(error);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    // Error message auto-dismiss timer
    const ERROR_TIMEOUT = 5000; // 5 seconds

    // Clean URL parameters after page load if requested
    useEffect(() => {
        if (clearUrlParams) {
            // Remove URL parameters without page reload
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [clearUrlParams]);

    // Auto-dismiss error messages after timeout
    useEffect(() => {
        if (formError || errorMessage) {
            const timer = setTimeout(() => {
                if (formError) setFormError(undefined);
                // We can't directly clear errorMessage since it comes from useActionState
            }, ERROR_TIMEOUT);

            // Clean up timeout if component unmounts
            return () => clearTimeout(timer);
        }
    }, [formError, errorMessage]);

    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            terms: false,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            name: (val) => (type === 'register' && !val ? 'Name is required' : null),
            terms: (val) => (type === 'register' && !val ? 'You must accept terms and conditions' : null),
        },
    });

    // Clear errors when user interacts with form fields
    const clearErrors = () => {
        if (formError) setFormError(undefined);
        if (success) setSuccess(undefined);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(undefined);
        setSuccess(undefined);

        // Validate the form before submitting
        const validation = form.validate();
        if (validation.hasErrors) {
            return;
        }

        try {
            setMagicLinkLoading(true);

            // Create FormData from the form
            const formData = new FormData(event.currentTarget);

            // Add form values to FormData
            formData.set('email', form.values.email);
            formData.set('callbackUrl', callbackUrl);

            let result;

            // Choose the appropriate action based on login or register
            if (type === 'register') {
                formData.set('name', form.values.name);
                formData.set('terms', form.values.terms.toString());
                result = await registerWithMagicLink(formData);

                if (!result) {
                    setSuccess("Registration link sent! Please check your email inbox to complete your registration.");
                    form.reset();
                }
            } else {
                result = await MagicSignIn(formData);

                if (!result) {
                    setSuccess("Login link sent! Please check your email inbox to sign in.");
                    form.reset();
                }
            }

            if (result) {
                setFormError(result);
            }
        } catch (error) {
            console.error(`Magic link ${type} error:`, error);
            setFormError(`An error occurred during ${type}. Please try again.`);
        } finally {
            setMagicLinkLoading(false);
        }
    };

    // Check if the button should be disabled
    const isRegisterButtonDisabled = type === 'register' && !form.values.terms;

    // Loading state for the main action button
    const isLoginButtonLoading = magicLinkLoading;

    // When type changes, clear messages and reset validation
    const handleTypeChange = () => {
        setFormError(undefined);
        setSuccess(undefined);
        form.clearErrors();
        toggle();
    };

    return (
        <Center style={{ height: '100vh' }}>
            <Paper
                radius="md"
                p="xl"
                className={styles.loginPaper}
            >
                <Text size="lg" fw={500}>
                    Welcome to Wessly&apos;s Terminal, {type} with
                </Text>

                {(errorMessage || formError) && (
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title={type === 'register' ? "Registration Error" : "Authentication Error"}
                        color="red"
                        my="md"
                        withCloseButton
                        onClose={() => setFormError(undefined)}
                    >
                        {errorMessage || formError}
                    </Alert>
                )}

                {success && (
                    <Alert
                        icon={<IconCheck size="1rem" />}
                        title="Success"
                        color="green"
                        my="md"
                        withCloseButton
                        onClose={() => setSuccess(undefined)}
                    >
                        {success}
                    </Alert>
                )}

                <form action={formAction}>
                    <input type="hidden" name="callbackUrl" value={callbackUrl} />
                    <Group grow mb="md" mt="md">
                        <Button
                            leftSection={<GoogleIcon />}
                            variant="default"
                            radius={'xl'}
                            type="submit"
                            name="action"
                            value="google"
                            loading={isPending}
                            disabled={isPending || magicLinkLoading}
                        >
                            {isPending ? <Skeleton height={14} width={60} radius="xl" /> : 'Google'}
                        </Button>
                        <Button
                            leftSection={<GithubIcon size={16} color="#FFFF" />}
                            variant="default"
                            radius={'xl'}
                            type="submit"
                            name="action"
                            value="github"
                            loading={isPending}
                            disabled={isPending || magicLinkLoading}
                        >
                            {isPending ? <Skeleton height={14} width={60} radius="xl" /> : 'Github'}
                        </Button>
                    </Group>
                </form>
                <Divider label="Or continue with email" labelPosition="center" my="lg" />
                <form onSubmit={handleSubmit}>
                    <Stack>
                        {type === 'register' && (
                            <TextInput
                                required
                                label="Name"
                                placeholder="Your name"
                                value={form.values.name}
                                onChange={(event) => {
                                    clearErrors();
                                    form.setFieldValue('name', event.currentTarget.value);
                                }}
                                error={form.errors.name}
                                radius="md"
                                disabled={isLoginButtonLoading}
                            />
                        )}
                        <TextInput
                            required
                            label="Email"
                            placeholder="your.email@example.com"
                            value={form.values.email}
                            onChange={(event) => {
                                clearErrors();
                                form.setFieldValue('email', event.currentTarget.value);
                            }}
                            error={form.errors.email}
                            radius="md"
                            disabled={isLoginButtonLoading}
                        />
                        {type === 'register' && (
                            <Checkbox
                                label="I accept terms and conditions"
                                checked={form.values.terms}
                                onChange={(event) => {
                                    clearErrors();
                                    form.setFieldValue('terms', event.currentTarget.checked);
                                }}
                                error={form.errors.terms}
                                required={type === 'register'}
                                disabled={isLoginButtonLoading}
                            />
                        )}
                    </Stack>
                    <Group justify="space-between" mt="xl">
                        <Anchor
                            component="button"
                            type="button"
                            c="dimmed"
                            onClick={handleTypeChange}
                            size="xs"
                            disabled={isLoginButtonLoading}
                        >
                            {type === 'register'
                                ? 'Already have an account? Login'
                                : "Don't have an account? Register"}
                        </Anchor>
                        <Button
                            type="submit"
                            radius="xl"
                            disabled={isRegisterButtonDisabled || isLoginButtonLoading}
                            loading={isLoginButtonLoading}
                        >
                            {isLoginButtonLoading ?
                                <Skeleton height={14} width={60} radius="xl" /> :
                                upperFirst(type)
                            }
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Center>
    );
}