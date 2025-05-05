import {
  IconBrandTabler,
  IconBriefcase,
  IconBuildingSkyscraper,
  IconCalculator,
  IconCalendarTime,
  IconCategory,
  IconFileBroken as IconDraft,
  IconFileCode2,
  IconFileCv,
  IconInbox,
  IconLicense,
  IconLogout,
  IconMailCode,
  IconPhoneRinging as IconMegaphone,
  IconMessage2,
  IconMessagePlus,
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
  IconUserScan,
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
          section: "MESSAGE CATEGORIES",
          items: [
            { link: "/emails/my-works", label: "My works", icon: IconBriefcase, color: "yellow" },
            { link: "/emails/accountant", label: "Accountant", icon: IconCalculator, color: "blue", count: 45 },
            { link: "/emails/works", label: "Works", icon: IconBuildingSkyscraper, color: "red", count: 87 },
            { link: "/emails/marketing", label: "Marketing", icon: IconMegaphone, color: "teal", count: 197 },
          ]
        },
        {
          section: "RECENT CHATS",
          items: [
            { link: "/emails/new-chat", label: "Start New Chat", icon: IconMessagePlus, special: "new" },
            { link: "/emails/chat/david", label: "David Jankowski", avatar: "/images/avatars/david.jpg", status: "online" },
            { link: "/emails/chat/anna", label: "Anna Zorko", avatar: "/images/avatars/anna.jpg", count: 1 },
          ]
        }
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
    { link: "/blog/media", label: "Media", icon: IconPhoto },
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
