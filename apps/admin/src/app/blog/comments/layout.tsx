import { Container } from '@mantine/core';
import { ReactNode } from 'react';

export default function CommentsLayout({ children }: { children: ReactNode }) {
  return <Container fluid>{children}</Container>;
}
