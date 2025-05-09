'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Group,
  Menu,
  Paper,
  Stack,
  Table,
  Text
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconDotsVertical,
  IconEye,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CommentWithPost } from '../_actions/fetchComments';
import { CommentAction, bulkUpdateComments, updateCommentStatus } from '../_actions/updateCommentStatus';
import { CommentContent } from './CommentContent';

interface CommentsTableProps {
  comments: CommentWithPost[];
  emptyMessage?: string;
}

export function CommentsTable({ comments, emptyMessage = 'No comments found' }: CommentsTableProps) {
  const router = useRouter();
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSelectComment = (commentId: string) => {
    setSelectedComments((current) => {
      if (current.includes(commentId)) {
        return current.filter((id) => id !== commentId);
      } else {
        return [...current, commentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map((comment) => comment.id));
    }
  };

  const handleAction = async (commentId: string, action: CommentAction) => {
    const notificationId = `comment-${action}-${commentId}`;
    notifications.show({
      id: notificationId,
      loading: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)}ing comment`,
      message: 'Please wait...',
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const result = await updateCommentStatus(commentId, action);

      if (result.success) {
        notifications.update({
          id: notificationId,
          color: 'green',
          title: 'Success',
          message: result.message,
          icon: <IconCheck size="1rem" />,
          loading: false,
          autoClose: 3000,
        });

        // Remove from selection if deleted
        if (action === 'delete') {
          setSelectedComments(prev => prev.filter(id => id !== commentId));
        }

        // Refresh the data
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch {
      notifications.update({
        id: notificationId,
        color: 'red',
        title: 'Error',
        message: `Failed to ${action} comment`,
        icon: <IconX size="1rem" />,
        loading: false,
        autoClose: 5000,
      });
    }
  };

  const handleBulkAction = async (action: CommentAction) => {
    if (selectedComments.length === 0) return;

    setIsProcessing(true);
    const notificationId = `bulk-${action}`;

    notifications.show({
      id: notificationId,
      loading: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)}ing ${selectedComments.length} comments`,
      message: 'Please wait...',
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const result = await bulkUpdateComments(selectedComments, action);

      if (result.success) {
        notifications.update({
          id: notificationId,
          color: 'green',
          title: 'Success',
          message: result.message,
          icon: <IconCheck size="1rem" />,
          loading: false,
          autoClose: 3000,
        });

        // Clear selection if deleted
        if (action === 'delete') {
          setSelectedComments([]);
        }

        // Refresh the data
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch {
      notifications.update({
        id: notificationId,
        color: 'red',
        title: 'Error',
        message: `Failed to ${action} comments`,
        icon: <IconX size="1rem" />,
        loading: false,
        autoClose: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmBulkAction = (action: CommentAction) => {
    if (selectedComments.length === 0) return;

    const actionText = {
      approve: 'approve',
      reject: 'reject',
      delete: 'delete',
    }[action];

    modals.openConfirmModal({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Comments`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to {actionText} {selectedComments.length} selected
          {selectedComments.length === 1 ? ' comment' : ' comments'}?
          {action === 'delete' && ' This action cannot be undone.'}
        </Text>
      ),
      labels: { confirm: `${action.charAt(0).toUpperCase() + action.slice(1)}`, cancel: 'Cancel' },
      confirmProps: { color: action === 'delete' ? 'red' : action === 'approve' ? 'green' : 'orange' },
      onConfirm: () => handleBulkAction(action),
    });
  };

  const renderStatusBadge = (comment: CommentWithPost) => {
    if (comment.isApproved === true) {
      return <Badge color="green">Approved</Badge>;
    } else if (comment.isApproved === false) {
      return <Badge color="red">Rejected</Badge>;
    } else {
      return <Badge color="yellow">Pending</Badge>;
    }
  };

  if (comments.length === 0) {
    return (
      <Paper p="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
        <Text c="dimmed">{emptyMessage}</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      {/* Bulk actions bar */}
      {selectedComments.length > 0 && (
        <Paper p="xs" withBorder shadow="sm">
          <Group justify="space-between">
            <Text size="sm">{selectedComments.length} comments selected</Text>
            <Group gap="xs">
              <Button
                size="xs"
                variant="outline"
                color="green"
                leftSection={<IconThumbUp size={16} />}
                disabled={isProcessing}
                onClick={() => confirmBulkAction('approve')}
              >
                Approve
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="orange"
                leftSection={<IconThumbDown size={16} />}
                disabled={isProcessing}
                onClick={() => confirmBulkAction('reject')}
              >
                Reject
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="red"
                leftSection={<IconTrash size={16} />}
                disabled={isProcessing}
                onClick={() => confirmBulkAction('delete')}
              >
                Delete
              </Button>
            </Group>
          </Group>
        </Paper>
      )}

      {/* Comments list */}
      <Card p={0} radius="md" withBorder>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <Checkbox
                  checked={selectedComments.length === comments.length && comments.length > 0}
                  indeterminate={selectedComments.length > 0 && selectedComments.length < comments.length}
                  onChange={handleSelectAll}
                />
              </Table.Th>
              <Table.Th>Comment</Table.Th>
              <Table.Th style={{ width: 150 }}>Author</Table.Th>
              <Table.Th style={{ width: 120 }}>Date</Table.Th>
              <Table.Th style={{ width: 120 }}>Status</Table.Th>
              <Table.Th style={{ width: 80 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {comments.map((comment) => (
              <Table.Tr key={comment.id}>
                <Table.Td>
                  <Checkbox
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleSelectComment(comment.id)}
                  />
                </Table.Td>
                <Table.Td>
                  <Stack gap="xs">
                    <CommentContent content={comment.content} />

                    {comment.parent && (
                      <Paper p="xs" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                        <Text size="xs" c="dimmed" mb={5}>
                          In reply to {comment.parent.authorName}:
                        </Text>
                        <Text size="sm" lineClamp={2}>
                          {comment.parent.content}
                        </Text>
                      </Paper>
                    )}

                    <Group gap="xs" wrap="nowrap">
                      <Text size="xs" c="dimmed">
                        On post:
                      </Text>
                      {comment.post && (
                        <Text component={Link}
                          size="xs"
                          href={`/blog/posts/${comment.post.slug}`}
                          style={{ textDecoration: 'underline' }}>
                          {comment.post.title || 'Untitled Post'}
                        </Text>
                      )}
                    </Group>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Flex align="center" gap="sm">
                    <Avatar
                      size="sm"
                      src={comment.authorProfile}
                      alt={comment.authorName}
                      color="blue"
                      radius="xl"
                    >
                      {comment.authorName[0] && comment.authorName[0].toUpperCase()}
                    </Avatar>
                    <Stack gap={0}>
                      <Text size="sm" lineClamp={1}>
                        {comment.authorName}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {comment.authorEmail}
                      </Text>
                    </Stack>
                  </Flex>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {format(new Date(comment.createdAt), 'HH:mm')}
                  </Text>
                </Table.Td>
                <Table.Td>{renderStatusBadge(comment)}</Table.Td>
                <Table.Td>
                  <Menu position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {comment.post && (
                        <Menu.Item
                          leftSection={<IconEye size={14} />}
                          component={Link}
                          href={`/blog/${comment.post.slug}#comment-${comment.id}`}
                          target="_blank"
                        >
                          View on site
                        </Menu.Item>
                      )}
                      <Menu.Item
                        leftSection={<IconThumbUp size={14} />}
                        onClick={() => handleAction(comment.id, 'approve')}
                        disabled={comment.isApproved === true}
                      >
                        Approve
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconThumbDown size={14} />}
                        onClick={() => handleAction(comment.id, 'reject')}
                        disabled={comment.isApproved === false}
                      >
                        Reject
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => {
                          modals.openConfirmModal({
                            title: 'Delete Comment',
                            centered: true,
                            children: (
                              <Text size="sm">
                                Are you sure you want to delete this comment? This action cannot be undone.
                              </Text>
                            ),
                            labels: { confirm: 'Delete', cancel: 'Cancel' },
                            confirmProps: { color: 'red' },
                            onConfirm: () => handleAction(comment.id, 'delete'),
                          });
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
