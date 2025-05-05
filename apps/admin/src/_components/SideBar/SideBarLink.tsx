import { Tooltip, UnstyledButton } from '@repo/ui/components/mantine';
import Link from 'next/link';
import React from 'react';
import classes from './SideBar.module.css';
import { IconComponent } from './types';

interface SideBarLinkProps {
    icon: IconComponent;
    label: string;
    link: string;
    active?: boolean;
    onClick: (event: React.MouseEvent) => void;
    isCollapsed: boolean;
    showLabel?: boolean;
}

function SideBarLink({ icon: Icon, label, link, active, onClick, isCollapsed, showLabel = false }: SideBarLinkProps) {
    console.log(`Rendering SideBarLink: ${label}, isCollapsed: ${isCollapsed}, showLabel: ${showLabel}`);
    console.log(`is Linka ctive: ${active} `);
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }} disabled={!isCollapsed || showLabel}>
            <Link href={link} passHref>
                <UnstyledButton
                    onClick={onClick}
                    className={classes.link}
                    styles={{
                        root: {
                            padding: isCollapsed && !showLabel ? '12px' : '8px 16px',
                            width: isCollapsed && !showLabel ? '50px' : 'auto',
                            height: isCollapsed && !showLabel ? '50px' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed && !showLabel ? 'center' : 'flex-start',
                        }
                    }}
                    data-active={active || undefined}
                >
                    <Icon className={classes.linkIcon} stroke={1.5} />
                    {(!isCollapsed || showLabel) && <span className={classes.linkLabel}>{label}</span>}
                </UnstyledButton>
            </Link>
        </Tooltip>
    );
}

export default SideBarLink;
