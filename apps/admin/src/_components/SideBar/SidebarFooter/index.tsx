'use client';

import { SidebarSection } from '../../../_hooks/useSidebarSection';
import { useSidebarStore } from '../../../_stores/sidebarStore';
import SideBarLink from '../SideBarLink';
import { sideBarTabs } from '../sideBarTabs';
import { SidebarItemWithSecondary } from '../types';
import styles from './SidebarFooter.module.css';

interface SidebarFooterProps {
  section: SidebarSection;
  activeTabWithSecondary: SidebarItemWithSecondary | null;
}

const SidebarFooter = ({ section, activeTabWithSecondary }: SidebarFooterProps) => {
  const { collapsed, isMobile, setMobileSidebar } = useSidebarStore();

  return (
    <div className={styles.footer}>
      {sideBarTabs.global[section].map(item => (
        <SideBarLink
          key={item.label}
          icon={item.icon}
          label={item.label}
          link={item.link}
          active={false}
          isCollapsed={Boolean(collapsed || (activeTabWithSecondary && !isMobile))}
          showLabel={Boolean(isMobile && isMobile)}
          onClick={() => {
            if (isMobile) setMobileSidebar(false)
          }}
        />
      ))}
    </div>
  );
};

export default SidebarFooter;
