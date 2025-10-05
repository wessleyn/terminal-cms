'use client'

import { Checkbox, Flex, Menu, Space, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { IconAlertOctagon, IconArchive, IconCaretDownFilled, IconChevronLeft, IconChevronRight, IconDotsVertical, IconFolderShare, IconMailOpened, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useState } from "react";

const EmailSelector = () => {
    const [checked, setChecked] = useState(false);

    return (
        <Flex gap='lg' w={'100%'} justify={'space-between'} >
            <Flex gap='lg' >
                <Tooltip label="Select emails" withArrow position="bottom-start">
                    <Flex justify={'center'} align={'center'} gap={'xs'}>
                        <Checkbox
                            variant="outline"
                            checked={checked}
                            onChange={() => { setChecked(!checked) }}
                        />
                        <Menu >
                            <Menu.Target>
                                <Flex justify={'center'} align={'center'}>
                                    <IconCaretDownFilled color="gray" size={16} />
                                </Flex>
                            </Menu.Target>
                            <Menu.Dropdown style={{
                                marginRight: '2rem'
                            }}>
                                <Menu.Item>All</Menu.Item>
                                <Menu.Item>None</Menu.Item>
                                <Menu.Item>Read</Menu.Item>
                                <Menu.Item>Unread</Menu.Item>
                                <Menu.Item>Starred</Menu.Item>
                                <Menu.Item>UnStarred</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Flex>
                </Tooltip>
                {
                    checked ? <Flex gap='lg'>
                        <Tooltip label="Archive" withArrow position="bottom">
                            <UnstyledButton>
                                <IconArchive color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                        <Tooltip label="Spam" withArrow position="bottom">
                            <UnstyledButton>
                                <IconAlertOctagon color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                        <Tooltip label="Delete" withArrow position="bottom">
                            <UnstyledButton>
                                <IconTrash color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                        <Space w='lg' />
                        <Tooltip label="Mark as Read" withArrow position="bottom">
                            <UnstyledButton>
                                <IconMailOpened color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                        <Tooltip label="Move to" withArrow position="bottom">
                            <UnstyledButton>
                                <IconFolderShare color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                    </Flex>
                        :
                        <Tooltip label="Refresh" withArrow position="bottom">
                            <UnstyledButton>
                                <IconRefresh color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                }
                <Tooltip label="More options" withArrow position="bottom">
                    <UnstyledButton>
                        <IconDotsVertical color="gray" size={22} />
                    </UnstyledButton>
                </Tooltip>
            </Flex>
            <Flex gap='md' align={'center'}>
                <Menu trigger="hover" openDelay={100} closeDelay={400}>
                    <Menu.Target>
                        <Flex justify={'center'} align={'center'}>
                            <Text c="dimmed" size="sm">108 of 1,281</Text>
                        </Flex>
                    </Menu.Target>
                    <Menu.Dropdown style={{
                        marginRight: '2rem'
                    }}>
                        <Menu.Item>Newer</Menu.Item>
                        <Menu.Item>Older</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Tooltip label="Newer" withArrow position="bottom">
                    <IconChevronLeft color="gray" size={16} />
                </Tooltip>
                <Space w='xs' />
                <Tooltip label="Older" withArrow position="bottom">
                    <IconChevronRight color="gray" size={16} />
                </Tooltip>
            </Flex>
        </Flex>
    )
}

export default EmailSelector