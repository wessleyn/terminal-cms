'use client';

import { Stack } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { useResponsiveSidebar } from '../../_hooks/useResponsiveSidebar';
import { useSidebarNavigation } from '../../_hooks/useSidebarNavigation';
import { SidebarSection, useSidebarSection } from '../../_hooks/useSidebarSection';
import { useSidebarStore } from '../../_stores/sidebarStore';
import SecondarySidebar from './SecondarySidebar';
import styles from './SideBar.module.css';
import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';
import SideBarLink from './SideBarLink';
import { sideBarTabs } from './sideBarTabs';

// FIXME: Remove the flashing of the sidebar when moving towards a tab with a secondary tab
// TODO: Add a primary sidebar trigger on the secondary nav, header when on mobile, to switch back between navs

const SideBar = () => {
  const pathname = usePathname();
  const { section, setSection, toggleSection } = useSidebarSection();
  const { activeTabWithSecondary } = useSidebarNavigation(section);
  
  const {
    collapsed,
    isMobile,
    mobileOpen,
    setMobileSidebar,
  } = useSidebarStore();

  // Initialize responsive sidebar
  useResponsiveSidebar(activeTabWithSecondary);

  const overlayRef = useClickOutside(() => {
    if (isMobile && mobileOpen) {
      setMobileSidebar(false);
    }
  });

  // Handle logo click to collapse the overlay when it's open
  const handleLogoClick = () => {
    if (isMobile && mobileOpen) {
      setMobileSidebar(false);
    }
  };

  return (
    <aside className='d-flex flex-row gap-0'>
      {/* Backdrop for mobile overlay */}
      {isMobile && mobileOpen && (
        <div className={styles.backdrop} />
      )}

      <div ref={overlayRef} className={`
        ${styles.SideBar} 
        ${collapsed || (activeTabWithSecondary && !isMobile) ? styles.SideBarCollapsed : ''} 
        ${isMobile ? styles.SideBarMobile : ''}
        ${isMobile && mobileOpen ? styles.SideBarMobileOpen : ''}
      `}>
        <SidebarHeader 
          section={section}
          setSection={setSection}
          toggleSection={toggleSection}
          activeTabWithSecondary={activeTabWithSecondary}
          handleLogoClick={handleLogoClick}
        />

        <div className={`${styles.SideBarMain} ${(isMobile && mobileOpen) ? styles.SideBarMobileMain : ''}`}>
          <Stack justify="center" gap={collapsed && !mobileOpen ? 0 : 'xs'}>
            {sideBarTabs[section].map((item) => {
              // Check if this link is active - matches exactly or is a parent path
              const isActive =
                pathname === item.link ||
                (item.link !== '/' &&
                  item.label !== 'Dashboard' &&
                  pathname.startsWith(item.link + '/'));

              // Check if this item has secondary navigation
              const hasSecondary = item.secondary !== undefined;
              
              return (
                <SideBarLink
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  link={item.link}
                  active={isActive}
                  isCollapsed={Boolean(collapsed || (isActive && hasSecondary))}
                  showLabel={Boolean(isMobile && mobileOpen)}
                  onClick={() => {
                    if (isMobile) {
                      setMobileSidebar(false);
                    }
                  }}
                />
              );
            })}
          </Stack>
        </div>

        <SidebarFooter 
          section={section as SidebarSection}
          activeTabWithSecondary={activeTabWithSecondary}
        />
      </div>

      <SecondarySidebar activeTabWithSecondary={activeTabWithSecondary} />
    </aside>
  );
};

export default SideBar;