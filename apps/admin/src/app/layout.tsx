import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { prisma } from "@repo/db";
import CustomProvider from "@repo/ui/components/shared/CustomProvider";
import DashboardThemeToggler from "../_components/DashboardThemeToggler";
import EmailsMenu from "../_components/EmailsMenu";
import GlobalSearch from "../_components/GlobalSearch";
import HeaderTitle from "../_components/HeaderTitle";
import NotificationsMenu from "../_components/NotificationsMenu";
import ProfileMenu from "../_components/ProfileMenu";
import SideBar from "../_components/SideBar";
import SidebarToggle from "../_components/SidebarToggle";
import "./_styles/dashboard.css";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children
}: { children: React.ReactNode }) {

  const newMails = await prisma.email.findMany({
    where: {
      isRead: false,
      isArchived: false,
      isSpam: false,
      receivedAt: {
        not: null
      }
    },
    include: {
      from: true,
    },
    orderBy: {
      receivedAt: 'desc'
    }
  })

  return (
    <CustomProvider>
      <div className="dashboard-layout">
        <div className="sidebar-container">
          <SideBar />
        </div>
        <div className="main-container">
          <header className="dashboard-header">
            <div className="header-left">
              <div className="header-toggle-container">
                <SidebarToggle />
              </div>
              <HeaderTitle />
            </div>
            <div className="d-flex gap-2">
              <GlobalSearch />
            </div>
            <div className="header-right">
              <DashboardThemeToggler />
              <NotificationsMenu />
              <EmailsMenu mails={newMails} />
              <ProfileMenu />
            </div>
          </header>
          <main className="dashboard-content">
            {children}
          </main>
        </div>
      </div>
    </CustomProvider>
  );
}

