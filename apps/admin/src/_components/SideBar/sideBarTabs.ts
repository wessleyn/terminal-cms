import {
  IconBrandTabler,
  IconCalendarTime,
  IconCategory,
  IconFileCode2,
  IconFileCv,
  IconLicense,
  IconLogout,
  IconMailCode,
  IconMessage2,
  IconPhoto,
  IconSettings,
  IconShoppingCart,
  IconSpyOff,
  IconTags,
  IconUsers,
  IconUserScan
} from '@tabler/icons-react'

export const sideBarTabs = {
  portfolio: [
    { link: '/', label: 'Dashboard', icon: IconBrandTabler },
    { link: '/projects', label: 'Projects', icon: IconFileCode2 },
    { link: '/resume', label: 'Resume', icon: IconFileCv },
    { link: '/meetings', label: 'Meetings', icon: IconCalendarTime },
    { link: '/emails', label: 'Emails', icon: IconMailCode },
    { link: '/privacy', label: 'Privacy', icon: IconSpyOff },
    { link: '/profile', label: 'Profile', icon: IconUserScan },
  ],

  blog: [
    { link: '/blog', label: 'Dashboard', icon: IconShoppingCart },
    { link: '/blog/posts', label: 'Posts', icon: IconLicense },
    { link: '/blog/categories', label: 'Categories', icon: IconCategory },
    { link: '/blog/tags', label: 'Tags', icon: IconTags },
    { link: '/blog/media', label: 'Media', icon: IconPhoto },
    { link: '/blog/comments', label: 'Comments', icon: IconMessage2 },
    { link: '/blog/users', label: 'Users', icon: IconUsers },
  ],

  global: {
    portfolio: [
      { link: '/settings', label: 'Settings', icon: IconSettings },
      { link: '/logout', label: 'Logout', icon: IconLogout },
    ],
    blog: [
      { link: '/blog/settings', label: 'Settings', icon: IconSettings },
      { link: '/logout', label: 'Logout', icon: IconLogout },
    ]
  }
}
