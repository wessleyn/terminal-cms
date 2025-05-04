'use client';

import { useClickOutside } from '@mantine/hooks';
import { Center, SegmentedControl, Stack, Text, Title, Tooltip, UnstyledButton } from '@repo/ui/components/mantine';
import {
    IconBook2,
    IconFolders
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSidebarStore } from '../../_stores/sidebarStore';
import Logo from '../Logo';
import classes from './SideBar.module.css';
import SideBarLink from './SideBarLink';
import { sideBarTabs } from './sideBarTabs';

enum Tabs {
    PORTFOLIO = 'portfolio',
    BLOG = 'blog',
}

const SideBar = () => {
    const [section, setSection] = useState<Tabs>(Tabs.PORTFOLIO);
    const [, setActive] = useState('');
    const pathname = usePathname();
    const {
        collapsed,
        isMobile: storeIsMobile,
        mobileOpen,
        setSidebar,
        setIsMobile,
        setMobileSidebar,
    } = useSidebarStore();

    const overlayRef = useClickOutside(() => {
        if (storeIsMobile && mobileOpen) {
            setMobileSidebar(false);
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
        }
    }, [pathname, section]);

    useEffect(() => {
        // Set initial state based on window width
        const checkMobile = () => {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;

            setIsMobile(isMobile);

            // Set collapsed state based on screen size
            if (isTablet) {
                setSidebar(true); // Collapsed on tablet
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
    }, [setSidebar, setIsMobile]);

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

        return (
            <SideBarLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                link={item.link}
                active={isActive}
                isCollapsed={collapsed}
                showLabel={storeIsMobile && mobileOpen}
                onClick={() => {
                    if (storeIsMobile) {
                        setMobileSidebar(false);
                    }
                }}
            />
        );
    });


    return (
        <>
            {/* Backdrop for mobile overlay - remove onClick handler as useClickOutside will handle it */}
            {storeIsMobile && mobileOpen && (
                <div className={classes.backdrop} />
            )}

            <aside ref={overlayRef} className={`
                ${classes.SideBar} 
                ${collapsed ? classes.SideBarCollapsed : ''} 
                ${storeIsMobile ? classes.SideBarMobile : ''}
                ${storeIsMobile && mobileOpen ? classes.SideBarMobileOpen : ''}
            `}>
                <div className={classes.header}>
                    {/* Logo with click handler */}
                    <Center
                        className={`${collapsed ? classes.logoCollapsed : classes.logo} ${classes.clickable}`}
                        onClick={handleLogoClick}
                    >
                        <Logo width={collapsed ? 30 : 20} height={collapsed ? 30 : 20} />
                        {(!collapsed || (storeIsMobile && mobileOpen)) &&
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
                    ) : (!storeIsMobile || (storeIsMobile && mobileOpen)) && (
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
                                active={false}            // typically you don’t “highlight” global items
                                isCollapsed={collapsed}
                                showLabel={storeIsMobile && mobileOpen}
                                onClick={() => {
                                    if (storeIsMobile) setMobileSidebar(false)
                                }}
                            />
                        ))}
                </div>
            </aside>
        </>
    );
};

export default SideBar;