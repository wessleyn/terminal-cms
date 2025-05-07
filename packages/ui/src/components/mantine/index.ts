// Import all required CSS
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';

// Export all Mantine components and hooks
export * from "@mantine/carousel";
export * from '@mantine/code-highlight';
export * from "@mantine/core";
export * from "@mantine/dates";
export * from "@mantine/form";
export * from "@mantine/hooks";
export * from "@mantine/notifications";
export * from "@mantine/spotlight";
export * from "@mantine/modals";
// Export icons from Mantinex
export * from "@mantinex/dev-icons";

// Export Tabler icons that are commonly used
export * from '@tabler/icons-react';

// Export Cloudinary components
export * from '../cloudinary';

export * from './MaintenancePage';

// export const Provider = ({ children }: { children: React.ReactNode }) => {
//     return (
//         <MantineProvider defaultColorScheme= { defaultColorScheme } theme = { theme } >
//             <Notifications />
//             <ModalsProvider>
//                      { children }
//             </ModalsProvider>
//         </MantineProvider>
//     )
// }