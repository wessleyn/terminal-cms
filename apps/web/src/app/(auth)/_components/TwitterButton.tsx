import { Button, ButtonProps } from '@mantine/core';
import { TwitterIcon } from '@repo/ui/components/mantine';

export function TwitterButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
    return (
        <Button leftSection={<TwitterIcon size={16} color="#00ACEE" />} variant="default" {...props} />
    );
}