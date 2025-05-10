import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import CustomProvider from "@repo/ui/components/shared/CustomProvider";
import DashboardThemeToggler from "../_components/DashboardThemeToggler";
import EmailsMenu from "../_components/EmailsMenu";
import HeaderTitle from "../_components/HeaderTitle";
import NotificationsMenu from "../_components/NotificationsMenu";
import ProfileMenu from "../_components/ProfileMenu";
import SideBar from "../_components/SideBar";
import SidebarToggle from "../_components/SidebarToggle";
import "./_styles/dashboard.css";

// Make the entire admin app dynamic
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children
}: { children: React.ReactNode }) {
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
            <div className="header-right">
              <DashboardThemeToggler />
              <NotificationsMenu />
              <EmailsMenu />
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

