'use client'

import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { MagicSignIn, socialSignIn } from '@repo/auth/src/utils';
import {
    Alert,
    Anchor,
    Button,
    Center,
    Checkbox,
    Divider,
    GithubIcon,
    Group,
    Paper,
    Stack,
    Text,
    TextInput
} from '@repo/ui/components/mantine';
import { IconAlertCircle } from '@tabler/icons-react';
import { useActionState } from 'react';
import { GoogleIcon } from '../../_components/GoogleButton';

export default function LoginForm({
    callbackUrl,
    error
}: {
    callbackUrl: string,
    error?: string
}) {
    const [errorMessage, formAction, isPending] = useActionState(socialSignIn, undefined);
    const [type, toggle] = useToggle(['login', 'register']);
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            terms: false,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            terms: (val) => (type === 'register' && !val ? 'You must accept terms and conditions' : null),
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate the form before submitting
        const validation = form.validate();
        if (validation.hasErrors) {
            return;
        }

        // Create FormData from the form
        const formData = new FormData(event.currentTarget);

        // Add form values to FormData
        formData.set('email', form.values.email);
        if (type === 'register') {
            formData.set('name', form.values.name);
            formData.set('terms', form.values.terms.toString());
        }

        // Call MagicSignIn with the form data
        MagicSignIn(formData);
    };

    // Check if the button should be disabled
    const isRegisterButtonDisabled = type === 'register' && !form.values.terms;

    return (
        <Center>
            <Paper radius="md" p="xl" withBorder>
                <Text size="lg" fw={500}>
                    Welcome to Wessly&apos;s Terminal, {type} with
                </Text>

                {(errorMessage || error) && (
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title="Authentication Error"
                        color="red"
                        my="md"
                    >
                        {errorMessage || error}
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
                            disabled={isPending}
                        >Google
                        </Button>
                        <Button
                            leftSection={<GithubIcon size={16} color="#FFFF" />}
                            variant="default"
                            radius={'xl'}
                            type="submit"
                            name="action"
                            value="github"
                            loading={isPending}
                            disabled={isPending}
                        >Github</Button>
                    </Group>
                </form>
                <Divider label="Or continue with email" labelPosition="center" my="lg" />
                <form onSubmit={handleSubmit}>
                    <Stack>
                        {type === 'register' && (
                            <TextInput
                                label="Name"
                                placeholder="Your name"
                                value={form.values.name}
                                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                                radius="md"
                            />
                        )}
                        <TextInput
                            required
                            label="Email"
                            placeholder="hello@mantine.dev"
                            value={form.values.email}
                            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                            error={form.errors.email && 'Invalid email'}
                            radius="md"
                        />
                        {type === 'register' && (
                            <Checkbox
                                label="I accept terms and conditions"
                                checked={form.values.terms}
                                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                                error={form.errors.terms}
                                required={type === 'register'}
                            />
                        )}
                    </Stack>
                    <Group justify="space-between" mt="xl">
                        <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                            {type === 'register'
                                ? 'Already have an account? Login'
                                : "Don't have an account? Register"}
                        </Anchor>
                        <Button
                            type="submit"
                            radius="xl"
                            disabled={isRegisterButtonDisabled}
                        >
                            {upperFirst(type)}
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Center>
    );
}