// Import all required CSS
import '@mantine/core/styles.css';

// Export all Mantine components and hooks
export * from "@mantine/carousel";
export * from '@mantine/code-highlight';
export * from "@mantine/core";
export * from "@mantine/modals";
export * from "@mantine/notifications";
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