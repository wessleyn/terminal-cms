import {
  IconBrandBlogger,
  IconBrandTabler,
  IconBriefcase,
  IconCalendarTime,
  IconCategory,
  IconFileBroken as IconDraft,
  IconFileCode2,
  IconFileCv,
  IconInbox,
  IconLicense,
  IconLogout,
  IconMailCode,
  IconMessage2,
  IconPhoto,
  IconSend,
  IconSettings,
  IconShoppingCart,
  IconShieldQuestion as IconSpam,
  IconSpyOff,
  IconStar,
  IconTags,
  IconTrash,
  IconUsers,
  IconUserScan
} from "@tabler/icons-react";
import { SidebarTabs } from "./types";

export const sideBarTabs: SidebarTabs = {
  portfolio: [
    { link: "/", label: "Dashboard", icon: IconBrandTabler },
    { link: "/projects", label: "Projects", icon: IconFileCode2 },
    { link: "/resume", label: "Resume", icon: IconFileCv },
    { link: "/meetings", label: "Meetings", icon: IconCalendarTime },
    {
      link: "/emails",
      label: "Emails",
      icon: IconMailCode,
      secondary: [
        { link: "/emails/inbox", label: "Inbox", icon: IconInbox, count: 16 },
        { link: "/emails/draft", label: "Draft", icon: IconDraft },
        { link: "/emails/starred", label: "Starred", icon: IconStar },
        { link: "/emails/sent", label: "Sent", icon: IconSend },
        { link: "/emails/trash", label: "Trash", icon: IconTrash },
        { link: "/emails/spam", label: "Spam", icon: IconSpam },
        {
          section: "", // FIXME:not very visual friendly in uncollapsed steps
          items: [
            { link: "/emails/blog", label: "Blog", icon: IconBrandBlogger, color: "blue", count: 45 },
            { link: "/emails/works", label: "Work Mails", icon: IconBriefcase, color: "yellow" },
            { link: "/emails/jobs", label: "Applications", icon: IconFileCv, color: "red", count: 87 },
          ]
        },
      ]
    },
    { link: "/privacy", label: "Privacy", icon: IconSpyOff },
    { link: "/profile", label: "Profile", icon: IconUserScan },
  ],

  blog: [
    { link: "/blog", label: "Dashboard", icon: IconShoppingCart },
    { link: "/blog/posts", label: "Posts", icon: IconLicense },
    { link: "/blog/categories", label: "Categories", icon: IconCategory },
    { link: "/blog/tags", label: "Tags", icon: IconTags },
    {
      link: "/blog/media", label: "Media", icon: IconPhoto, secondary: []},
    { link: "/blog/comments", label: "Comments", icon: IconMessage2 },
    { link: "/blog/users", label: "Users", icon: IconUsers },
  ],

  global: {
    portfolio: [
      { link: "/settings", label: "Settings", icon: IconSettings },
      { link: "/logout", label: "Logout", icon: IconLogout },
    ],
    blog: [
      { link: "/blog/settings", label: "Settings", icon: IconSettings },
      { link: "/logout", label: "Logout", icon: IconLogout },
    ],
  },
};
