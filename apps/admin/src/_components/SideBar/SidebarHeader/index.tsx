'use client';

import { Center, SegmentedControl, Text, Title, Tooltip, UnstyledButton } from '@mantine/core';
import { IconBook2, IconFolders } from '@tabler/icons-react';
import { SidebarSection } from '../../../_hooks/useSidebarSection';
import { useSidebarStore } from '../../../_stores/sidebarStore';
import Logo from '../../Logo';
import { SidebarItemWithSecondary } from '../types';
import styles from './SidebarHeader.module.css';

interface SidebarHeaderProps {
  section: SidebarSection;
  setSection: (section: SidebarSection) => void;
  toggleSection: () => void;
  activeTabWithSecondary: SidebarItemWithSecondary | null;
  handleLogoClick: () => void;
}

const SidebarHeader = ({ 
  section, 
  setSection, 
  toggleSection, 
  activeTabWithSecondary,
  handleLogoClick
}: SidebarHeaderProps) => {
  const { collapsed, isMobile, mobileOpen } = useSidebarStore();
  
  // Get current section icon
  const SectionIcon = section === SidebarSection.PORTFOLIO ? IconFolders : IconBook2;

  return (
    <div className={styles.header}>
      {/* Logo with click handler */}
      <Center
        className={`${collapsed || (activeTabWithSecondary && !isMobile) ? styles.logoCollapsed : styles.logo} ${styles.clickable}`}
        onClick={handleLogoClick}
      >
        <Logo width={collapsed || (activeTabWithSecondary && !isMobile) ? 30 : 20} height={collapsed || (activeTabWithSecondary && !isMobile) ? 30 : 20} />
        {(!collapsed || (isMobile && mobileOpen)) && !activeTabWithSecondary &&
          <Title order={3} className={styles.title}>Control Terminal</Title>
        }
      </Center>

      {/* Current section indicator for mobile */}
      {isMobile && mobileOpen && (
        <div className={styles.sectionIndicator}>
          <SectionIcon size={20} />
          <Text fw={500} ml="xs">{section === SidebarSection.PORTFOLIO ? 'Portfolio' : 'Blog'}</Text>
        </div>
      )}

      {/* Section toggle button for collapsed view */}
      {(collapsed && !isMobile) || (isMobile && !mobileOpen) ? (
        <Tooltip
          label={section === SidebarSection.PORTFOLIO ? "Switch to Blog" : "Switch to Portfolio"}
          position="right"
          transitionProps={{ duration: 0 }}
        >
          <UnstyledButton
            onClick={toggleSection}
            className={styles.sectionToggleButton}
          >
            <SectionIcon className={styles.linkIcon} stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      ) : (!isMobile || (isMobile && mobileOpen)) && !activeTabWithSecondary && (
        <SegmentedControl
          value={section}
          onChange={(value) => setSection(value as SidebarSection)}
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
  );
};

export default SidebarHeader;
