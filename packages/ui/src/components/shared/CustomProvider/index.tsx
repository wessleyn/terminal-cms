import {
  ColorSchemeScript,
  createTheme,
  MantineColorScheme,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

const theme = createTheme({
  fontFamily: 'Azeret-Mono, monospace',
  primaryColor: 'green',
  primaryShade: {
    light: 7,
    dark: 6,
  }, // Neon Feel
  colors: {
    //Shades of Terminal Green
    green: [
      "#e9ffe4",
      "#d6fece",
      "#aefb9e",
      "#82f969",
      "#5ef73e",
      "#46f621",
      "#37f50e",
      "#27da00",
      "#1ac200",
      "#00a800"
    ],
    'oklch-blue': [
      'oklch(96.27% 0.0217 238.66)',
      'oklch(92.66% 0.0429 240.01)',
      'oklch(86.02% 0.0827 241.66)',
      'oklch(78.2% 0.13 243.83)',
      'oklch(71.8% 0.1686 246.06)',
      'oklch(66.89% 0.1986 248.32)',
      'oklch(62.59% 0.2247 250.29)',
      'oklch(58.56% 0.2209 251.26)',
      'oklch(54.26% 0.2067 251.67)',
      'oklch(49.72% 0.1888 251.59)',
    ],
  },
  // Add theme components for consistent styling
  components: {
    ActionIcon: {
      defaultProps: {
        color: 'green-1',
      }
    },
    Button: {
      defaultProps: {
        color: 'green',
      }
    }
  },
});

const defaultColorScheme = "dark"


const Provider = ({
  children,
}: {
  children: React.ReactNode;
  defaultColorScheme?: MantineColorScheme;
}) => {
  return (
    <html lang="en" data-bs-theme={defaultColorScheme} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme={defaultColorScheme} theme={theme}>
          <Notifications />
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
};

export default Provider;
