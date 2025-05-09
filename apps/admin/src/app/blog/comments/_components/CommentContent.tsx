'use client';

import { Badge, Group, Text, Tooltip } from '@mantine/core';
import { useState } from 'react';

interface CommentContentProps {
  content: string;
  maxLength?: number;
}

export function CommentContent({ content, maxLength = 200 }: CommentContentProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > maxLength;

  if (!isLong) {
    return <Text size="sm">{content}</Text>;
  }

  return (
    <>
      <Text size="sm">
        {expanded ? content : `${content.substring(0, maxLength)}...`}
      </Text>
      {isLong && (
        <Group justify="flex-end">
          <Tooltip
            label={expanded ? "Show less" : "Show more"}
            position="bottom"
            withArrow
          >
            <Badge
              onClick={() => setExpanded(!expanded)}
              variant="light"
              color="gray"
              style={{ cursor: 'pointer' }}
            >
              {expanded ? 'Show less' : 'Show more'}
            </Badge>
          </Tooltip>
        </Group>
      )}
    </>
  );
}
