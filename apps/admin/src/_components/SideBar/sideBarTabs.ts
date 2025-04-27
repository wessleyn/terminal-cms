import {
  IconBrandTabler,
  IconCalendarTime,
  IconFileAnalytics,
  IconFileCode2,
  IconLicense,
  IconMailCode,
  IconMessage2,
  IconMessages,
  IconSettings,
  IconShoppingCart,
  IconSpyOff,
  IconUserScan
} from '@tabler/icons-react'

export const sideBarTabs = {
  portfolio: [
    { link: '/', label: 'Dashboard', icon: IconBrandTabler },
    { link: '/projects', label: 'Projects', icon: IconFileCode2 },
    { link: '/meetings', label: 'Meetings', icon: IconCalendarTime },
    { link: '/emails', label: 'Emails', icon: IconMailCode },
    { link: '/privacy', label: 'Privacy', icon: IconSpyOff },
    { link: '/profile', label: 'Profile', icon: IconUserScan },
    { link: '/settings', label: 'Settings', icon: IconSettings },
  ],
  blog: [
    { link: '/blog', label: 'Dashboard', icon: IconShoppingCart },
    { link: '/blog/posts', label: 'Posts', icon: IconLicense },
    { link: '/blog/comments', label: 'Comments', icon: IconMessage2 },
    { link: '/blog/subscribers', label: 'Subscribers', icon: IconMessages },
    { link: '/blog/settings', label: 'Settings', icon: IconFileAnalytics },
  ],
}
