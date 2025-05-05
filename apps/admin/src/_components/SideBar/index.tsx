'use client';

import { useClickOutside } from '@mantine/hooks';
import { Avatar, Badge, Center, SegmentedControl, Stack, Text, Title, Tooltip, UnstyledButton } from '@repo/ui/components/mantine';
import {
    IconBook2,
    IconFolders,
    IconPlus
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSidebarStore } from '../../_stores/sidebarStore';
import Logo from '../Logo';
import classes from './SideBar.module.css';
import SideBarLink from './SideBarLink';
import { sideBarTabs } from './sideBarTabs';
import { SecondaryItem, SidebarItemWithSecondary } from './types';

enum Tabs {
    PORTFOLIO = 'portfolio',
    BLOG = 'blog',
}

// FIXME: Remove the flashing of the sidebar when moving towards a tab with a secondary tab
// TODO: Add a primary sidebar trigger on the secondary nav , header wehn on mobile, to shwitch back between navs

const SideBar = () => {
    const [section, setSection] = useState<Tabs>(Tabs.PORTFOLIO);
    const [, setActive] = useState('');
    const pathname = usePathname();
    const [activeTabWithSecondary, setActiveTabWithSecondary] = useState<SidebarItemWithSecondary | null>(null);
    const {
        collapsed,
        isMobile: storeIsMobile,
        mobileOpen,
        secondaryOpen,
        setSidebar,
        setIsMobile,
        setMobileSidebar,
        setSecondarySidebar,
    } = useSidebarStore();

    const overlayRef = useClickOutside(() => {
        if (storeIsMobile && mobileOpen) {
            setMobileSidebar(false);
        }
    });

    const secondaryRef = useClickOutside(() => {
        if (storeIsMobile && secondaryOpen && activeTabWithSecondary) {
            setSecondarySidebar(false);
        }
    });

    // First determine which section we're in based on the URL
    useEffect(() => {
        if (pathname.includes('/blog')) {
            setSection(Tabs.BLOG);
        } else {
            setSection(Tabs.PORTFOLIO);
        }
    }, [pathname]);

    // Then update active state based on current pathname and section
    useEffect(() => {
        // Get the current tabs based on our section
        const tabs = sideBarTabs[section];

        // Find the active tab by checking if its link is part of the current path
        const foundActiveTab = tabs.find(tab => {
            // Special case for dashboard/blog root
            if ((tab.label === 'Dashboard' && tab.link === '/dashboard' && pathname === '/dashboard') ||
                (tab.label === 'Dashboard' && tab.link === '/blog' && pathname === '/blog')) {
                return true;
            }

            // Check if the current path matches or is a sub-path of this link (except Dashboard)
            // This will highlight parent links when in subpages (like projects/[id])
            if (tab.link !== '/' &&
                tab.label !== 'Dashboard' &&
                pathname.startsWith(tab.link)) {
                return true;
            }

            // Exact match as fallback
            return pathname === tab.link;
        });

        if (foundActiveTab) {
            setActive(foundActiveTab.label);

            // Check if active tab has secondary navigation
            if (foundActiveTab.secondary && foundActiveTab.secondary.length > 0) {
                setActiveTabWithSecondary(foundActiveTab);
                setSidebar(true); // Force collapse main sidebar
            } else {
                setActiveTabWithSecondary(null);
            }
        }
    }, [pathname, section, setSidebar]);

    useEffect(() => {
        // Set initial state based on window width
        const checkMobile = () => {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;

            setIsMobile(isMobile);

            // Set collapsed state based on screen size
            if (isTablet || activeTabWithSecondary) {
                setSidebar(true); // Collapsed on tablet or when there's secondary nav
            } else if (!isMobile) {
                setSidebar(false); // Expanded on desktop
            }
        };

        // Run once on component mount
        checkMobile();

        // Set up event listener
        window.addEventListener('resize', checkMobile);

        // Clean up
        return () => window.removeEventListener('resize', checkMobile);
    }, [setSidebar, setIsMobile, activeTabWithSecondary]);

    // Handle logo click to collapse the overlay when it's open
    const handleLogoClick = () => {
        if (storeIsMobile && mobileOpen) {
            setMobileSidebar(false);
        }
    };

    // Toggle section function
    const toggleSection = () => {
        setSection(section === Tabs.PORTFOLIO ? Tabs.BLOG : Tabs.PORTFOLIO);
    };

    // Get current section icon
    const SectionIcon = section === Tabs.PORTFOLIO ? IconFolders : IconBook2;

    const links = sideBarTabs[section].map((item) => {
        // Check if this link is active - matches exactly or is a parent path
        // Exclude Dashboard from parent-child highlighting
        const isActive =
            pathname === item.link ||
            (item.link !== '/' &&
                item.label !== 'Dashboard' &&
                pathname.startsWith(item.link + '/'));

        // Check if this item has secondary navigation
        const hasSecondary = item.secondary && item.secondary.length > 0;

        return (
            <SideBarLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                link={item.link}
                active={isActive}
                isCollapsed={Boolean(collapsed || (isActive && hasSecondary))}
                showLabel={Boolean(storeIsMobile && mobileOpen)}
                onClick={() => {
                    if (storeIsMobile) {
                        setMobileSidebar(false);
                    }
                }}
            />
        );
    });

    // Render secondary sidebar if active tab has secondary navigation
    const renderSecondarySidebar = () => {
        if (!activeTabWithSecondary || !activeTabWithSecondary.secondary) return null;

        // Determine appropriate class for secondary sidebar state:
        // On desktop: apply collapsed class when not open
        // On mobile: hide completely when not open
        const secondarySidebarClasses = `
            ${classes.secondarySidebar} 
            ${storeIsMobile && !secondaryOpen ? classes.secondarySidebarHidden : ''}
            ${!storeIsMobile && !secondaryOpen ? classes.secondarySidebarCollapsed : ''}
            ${storeIsMobile && secondaryOpen ? classes.secondarySidebarVisible : ''}
        `;

        return (
            <>
                {storeIsMobile && secondaryOpen && (
                    <div className={classes.secondarySidebarBackdrop} />
                )}

                <div
                    ref={secondaryRef}
                    className={secondarySidebarClasses}
                >
                    <div className={classes.secondarySidebarHeader}>
                        {(!storeIsMobile || secondaryOpen) && (
                            <Title order={4}>{activeTabWithSecondary.label}</Title>
                        )}
                    </div>

                    {activeTabWithSecondary.secondary.map((item, index) => {
                        if ('section' in item) {
                            return (
                                <div key={item.section} className={classes.secondarySidebarSection}>
                                    {(!storeIsMobile || secondaryOpen) && (
                                        <Text className={classes.secondarySidebarSectionTitle}>{item.section}</Text>
                                    )}
                                    {item.items.map((subItem) => renderSecondaryItem(subItem, index, !storeIsMobile && !secondaryOpen))}
                                </div>
                            );
                        } else {
                            return renderSecondaryItem(item as SecondaryItem, index, !storeIsMobile && !secondaryOpen);
                        }
                    })}
                </div>
            </>
        );
    };

    // Helper to render secondary navigation items
    const renderSecondaryItem = (item: SecondaryItem, index?: number, isCollapsed = false) => {
        const isActive = pathname === item.link;

        if (item.special === 'new') {
            return (
                <UnstyledButton
                    key={item.label}
                    className={classes.newMessageButton}
                    onClick={() => {/* handle new message */ }}
                >
                    {!isCollapsed ? (
                        <>
                            <IconPlus size={16} style={{ marginRight: 8 }} />
                            {item.label}
                        </>
                    ) : (
                        <Tooltip label={item.label} position="right">
                            <IconPlus size={20} />
                        </Tooltip>
                    )}
                </UnstyledButton>
            );
        }

        return (
            <Tooltip
                key={item.label || index}
                label={isCollapsed ? item.label : undefined}
                position="right"
                disabled={!isCollapsed}
            >
                <UnstyledButton
                    className={`${classes.secondaryLink} ${isCollapsed ? classes.secondaryLinkCollapsed : ''}`}
                    data-active={isActive || undefined}
                    onClick={() => {
                        if (storeIsMobile) {
                            setSecondarySidebar(false);
                        }
                        // Handle navigation
                    }}
                >
                    <div className={classes.secondaryLinkMain}>
                        {item.avatar ? (
                            <div className={classes.avatarStatus}>
                                <Avatar src={item.avatar} size="sm" radius="xl" mr={isCollapsed ? 0 : "xs"} />
                                {item.status === 'online' && <div className={classes.statusIndicator} />}
                            </div>
                        ) : (
                            item.icon && <item.icon className={classes.secondaryLinkIcon} size={20} color={item.color && `var(--mantine-color-${item.color}-6)`} />
                        )}
                        {!isCollapsed && <Text>{item.label}</Text>}
                    </div>

                    {!isCollapsed && item.count && (
                        <Badge
                            className={classes.secondaryLinkBadge}
                            size="sm"
                            variant="filled"
                            color={item.color || "blue"}
                        >
                            {item.count}
                        </Badge>
                    )}
                </UnstyledButton>
            </Tooltip>
        );
    };

    return (
        <>
            {/* Backdrop for mobile overlay - remove onClick handler as useClickOutside will handle it */}
            {storeIsMobile && mobileOpen && (
                <div className={classes.backdrop} />
            )}

            <aside ref={overlayRef} className={`
                ${classes.SideBar} 
                ${collapsed || (activeTabWithSecondary && !storeIsMobile) ? classes.SideBarCollapsed : ''} 
                ${storeIsMobile ? classes.SideBarMobile : ''}
                ${storeIsMobile && mobileOpen ? classes.SideBarMobileOpen : ''}
            `}>
                <div className={classes.header}>
                    {/* Logo with click handler */}
                    <Center
                        className={`${collapsed || (activeTabWithSecondary && !storeIsMobile) ? classes.logoCollapsed : classes.logo} ${classes.clickable}`}
                        onClick={handleLogoClick}
                    >
                        <Logo width={collapsed || (activeTabWithSecondary && !storeIsMobile) ? 30 : 20} height={collapsed || (activeTabWithSecondary && !storeIsMobile) ? 30 : 20} />
                        {(!collapsed || (storeIsMobile && mobileOpen)) && !activeTabWithSecondary &&
                            <Title order={3} className={classes.title}>Control Terminal</Title>
                        }
                    </Center>

                    {/* Current section indicator for mobile */}
                    {storeIsMobile && mobileOpen && (
                        <div className={classes.sectionIndicator}>
                            <SectionIcon size={20} />
                            <Text fw={500} ml="xs">{section === Tabs.PORTFOLIO ? 'Portfolio' : 'Blog'}</Text>
                        </div>
                    )}

                    {/* Section toggle button for collapsed view */}
                    {(collapsed && !storeIsMobile) || (storeIsMobile && !mobileOpen) ? (
                        <Tooltip
                            label={section === Tabs.PORTFOLIO ? "Switch to Blog" : "Switch to Portfolio"}
                            position="right"
                            transitionProps={{ duration: 0 }}
                        >
                            <UnstyledButton
                                onClick={toggleSection}
                                className={classes.sectionToggleButton}
                            >
                                <SectionIcon className={classes.linkIcon} stroke={1.5} />
                            </UnstyledButton>
                        </Tooltip>
                    ) : (!storeIsMobile || (storeIsMobile && mobileOpen)) && !activeTabWithSecondary && (
                        <SegmentedControl
                            value={section}
                            onChange={(value) => setSection(value as Tabs)}
                            transitionTimingFunction="ease"
                            fullWidth
                            styles={{
                                indicator: {
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--mantine-color-green-5)',
                                    boxShadow: '0 0 5px var(--mantine-color-green-5)'
                                },
                                control: {
                                    border: 'none',
                                    '&[dataActive]': {
                                        color: 'var(--mantine-color-green-5)'
                                    }
                                },
                                label: {
                                    fontWeight: 600
                                }
                            }}
                            data={[
                                {
                                    label: (
                                        <Center>
                                            <IconFolders size={16} />
                                            <Text ml={8}>Portfolio</Text>
                                        </Center>
                                    ),
                                    value: 'portfolio'
                                },
                                {
                                    label: (
                                        <Center>
                                            <IconBook2 size={16} />
                                            <Text ml={8}>Blog</Text>
                                        </Center>
                                    ),
                                    value: 'blog'
                                },
                            ]}
                        />
                    )}
                </div>

                <div className={`${classes.SideBarMain} ${(storeIsMobile && mobileOpen) ? classes.SideBarMobileMain : ''}`}>
                    <Stack justify="center" gap={collapsed && !mobileOpen ? 0 : 'xs'}>
                        {links}
                    </Stack>
                </div>

                <div className={classes.footer}>
                    {
                        sideBarTabs.global[section].map(item => (
                            <SideBarLink
                                key={item.label}
                                icon={item.icon}
                                label={item.label}
                                link={item.link}
                                active={false}          
                                isCollapsed={Boolean(collapsed || (activeTabWithSecondary && !storeIsMobile))}
                                showLabel={Boolean(storeIsMobile && mobileOpen)}
                                onClick={() => {
                                    if (storeIsMobile) setMobileSidebar(false)
                                }}
                            />
                        ))}
                </div>
            </aside>

            {/* Render secondary sidebar if needed */}
            {renderSecondarySidebar()}
        </>
    );
};

export default SideBar;