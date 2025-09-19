'use client';

import { Avatar, Box, Text, Title } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '../../../_stores/sidebarStore';
import SideBarLink from '../SideBarLink';
import { SecondaryItem, SectionItem, SidebarItemWithSecondary } from '../types';
import styles from './SecondarySidebar.module.css';

interface SecondarySidebarProps {
    activeTabWithSecondary: SidebarItemWithSecondary | null;
}

const SecondarySidebar = ({ activeTabWithSecondary }: SecondarySidebarProps) => {
    const pathname = usePathname();
    const { isMobile, secondaryOpen, setSecondarySidebar } = useSidebarStore();

    const secondaryRef = useClickOutside(() => {
        if (isMobile && secondaryOpen && activeTabWithSecondary) {
            setSecondarySidebar(false);
        }
    });

    if (!activeTabWithSecondary || !activeTabWithSecondary.secondary) return null;

    // Determine appropriate class for secondary sidebar state
    const secondarySidebarClasses = `
    ${styles.secondarySidebar} 
    ${isMobile && !secondaryOpen ? styles.secondarySidebarHidden : ''}
    ${!isMobile && !secondaryOpen ? styles.secondarySidebarCollapsed : ''}
    ${isMobile && secondaryOpen ? styles.secondarySidebarVisible : ''}
  `;

    const isCollapsed = !isMobile && !secondaryOpen;

    // Render the header with root icon
    const renderHeader = () => {
        const Icon = activeTabWithSecondary.icon;

        return (
            <div className={styles.secondarySidebarHeader}>
                {/* Root icon - aligned with primary sidebar logo */}
                <div className={styles.rootIcon}>
                    <Icon size={24} stroke={1.5} />
                </div>

                {/* Header content - hidden when collapsed */}
                <div className={styles.headerContent}>
                    {(!isMobile || secondaryOpen) && (
                        <Title order={4}>{activeTabWithSecondary.label}</Title>
                    )}
                </div>
            </div>
        );
    };

    // Render special "new" button item
    const renderNewButtonItem = (item: SecondaryItem, isCollapsed = false) => {
        // Use SideBarLink for consistency, with IconPlus as the icon
        return (
            <SideBarLink
                key={item.label}
                icon={IconPlus}
                label={item.label}
                link={item.link}
                isCollapsed={isCollapsed}
                showLabel={!isCollapsed}
                className={styles.newMessageButton}
                onClick={() => {
                    if (isMobile) {
                        setSecondarySidebar(false);
                    }
                }}
            />
        );
    };

    // Render avatar with status indicator
    const renderAvatarItem = (item: SecondaryItem, isCollapsed = false) => {
        const isActive = pathname === item.link;

        // Custom wrapper component for avatar items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AvatarIcon = (props: any) => (
            <div className={styles.avatarStatus}>
                <Avatar
                    src={item.avatar}
                    size="sm"
                    radius="xl"
                    className={props.className}
                    styles={{
                        root: {
                            width: '25px',
                            height: '25px',
                        }
                    }}
                />
                {item.status === 'online' && <div className={styles.statusIndicator} />}
            </div>
        );

        return (
            <SideBarLink
                key={item.label}
                icon={AvatarIcon}
                label={item.label}
                link={item.link}
                active={isActive}
                isCollapsed={isCollapsed}
                showLabel={!isCollapsed}
                badge={item.count}
                badgeColor={item.color || "blue"}
                onClick={() => {
                    if (isMobile) {
                        setSecondarySidebar(false);
                    }
                }}
            />
        );
    };

    // Helper to render secondary navigation items
    const renderSecondaryItem = (item: SecondaryItem, index?: number, isCollapsed = false) => {
        const isActive = pathname === item.link;

        // Handle special "new" button
        if (item.special === 'new') {
            return renderNewButtonItem(item, isCollapsed);
        }

        // Handle avatar items
        if (item.avatar) {
            return renderAvatarItem(item, isCollapsed);
        }

        // Standard link with icon
        return (
            <SideBarLink
                key={item.label || `item-${index}`}
                icon={item.icon || (() => <Box w={20} h={20} />)} // Fallback empty icon
                label={item.label}
                link={item.link}
                active={isActive}
                isCollapsed={isCollapsed}
                showLabel={!isCollapsed}
                badge={item.count}
                badgeColor={item.color || "blue"}
                onClick={() => {
                    if (isMobile) {
                        setSecondarySidebar(false);
                    }
                }}
            />
        );
    };

    // Render a section with title and items
    const renderSection = (sectionItem: SectionItem, index: number, isCollapsed = false) => {
        return (
            <div key={sectionItem.section} className={styles.secondarySidebarSection}>
                {/* In collapsed mode, this becomes just a horizontal divider */}
                {!isCollapsed && (
                    <Text className={styles.secondarySidebarSectionTitle}>
                        {sectionItem.section}
                    </Text>
                )}

                {/* Section items */}
                <div className={styles.sectionItems}>
                    {sectionItem.items.map((subItem, subIndex) =>
                        renderSecondaryItem(subItem, subIndex, isCollapsed)
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {isMobile && secondaryOpen && (
                <div className={styles.secondarySidebarBackdrop} />
            )}

            <div ref={secondaryRef} className={secondarySidebarClasses}>
                {/* Header with root icon */}
                {renderHeader()}

                {/* Group non-section items and section items separately */}
                {(() => {
                    // Split items into non-section and section items
                    const nonSectionItems: SecondaryItem[] = [];
                    const sectionItems: SectionItem[] = [];

                    activeTabWithSecondary.secondary.forEach(item => {
                        if ('section' in item) {
                            sectionItems.push(item as SectionItem);
                        } else {
                            nonSectionItems.push(item as SecondaryItem);
                        }
                    });

                    return (
                        <>
                            {/* Non-section items wrapper */}
                            {nonSectionItems.length > 0 && (
                                <div className={styles.nonSectionItems}>
                                    {nonSectionItems.map((item, index) =>
                                        renderSecondaryItem(item, index, isCollapsed)
                                    )}
                                </div>
                            )}

                            {/* Section items */}
                            {sectionItems.map((item, index) =>
                                renderSection(item, index, isCollapsed)
                            )}
                        </>
                    );
                })()}
            </div>
        </>
    );
};

export default SecondarySidebar;
