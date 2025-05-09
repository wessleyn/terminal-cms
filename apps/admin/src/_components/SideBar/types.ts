import { ComponentType } from 'react';

// This type is compatible with Tabler icons including color prop
export type IconComponent = ComponentType<{
    size?: number | string;
    stroke?: number;
    className?: string;
    color?: string; // Added color prop support
}>;

// Base type for sidebar items
export interface SidebarItem {
    link: string;
    label: string;
    icon: IconComponent;
}

// Type for secondary navigation items - make icon optional
export interface SecondaryItem {
    link: string;
    label: string;
    icon?: IconComponent;
    count?: number;
    color?: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
    special?: string;
}

// Type for grouped section in secondary navigation
export interface SectionItem {
    section: string;
    items: SecondaryItem[];
}

// Type for sidebar items that can have secondary navigation
export interface SidebarItemWithSecondary extends SidebarItem {
    secondary?: (SecondaryItem | SectionItem)[];
}

// Type for tabs in the sidebar
export type SidebarTab = SidebarItemWithSecondary;

// Global navigation items
export interface GlobalNavigation {
    portfolio: SidebarItem[];
    blog: SidebarItem[];
}

// Overall sidebar structure
export interface SidebarTabs {
    portfolio: SidebarTab[];
    blog: SidebarTab[];
    global: GlobalNavigation;
}
