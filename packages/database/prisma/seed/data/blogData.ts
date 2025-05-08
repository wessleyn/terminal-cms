import { PostCategory } from "../../../generated/prisma";

// Sample blog author data
export const blogAuthors = [
  {
    name: "Wessley Nyakanyanga",
    email: "wessley@example.com",
    bio: "Full-stack developer with a passion for creating engaging user experiences and writing clean, maintainable code.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
  },
  {
    name: "Luna Silverstone",
    email: "luna.silverstone@example.com",
    bio: "Senior Potion Master with over 10 years of experience in brewing complex concoctions and magical solutions.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
  },
  {
    name: "Orion Blackwood",
    email: "orion.blackwood@example.com",
    bio: "Spell researcher and practitioner specializing in defensive magic and ancient incantations.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200"
  }
];

// Sample blog tag data
export const blogTags = [
  { name: "JavaScript", slug: "javascript", color: "yellow" },
  { name: "React", slug: "react", color: "blue" },
  { name: "TypeScript", slug: "typescript", color: "cyan" },
  { name: "NextJS", slug: "nextjs", color: "gray" },
  { name: "Mantine", slug: "mantine", color: "indigo" },
  { name: "Prisma", slug: "prisma", color: "green" },
  { name: "Beginner", slug: "beginner", color: "lime" },
  { name: "Advanced", slug: "advanced", color: "orange" },
  { name: "Tutorial", slug: "tutorial", color: "pink" },
  { name: "Dark Magic", slug: "dark-magic", color: "violet" }
];

// Sample blog post data
export const blogPosts = [
  {
    title: "The Magic of React Hooks: A Beginner's Guide",
    slug: "magic-of-react-hooks",
    excerpt: "Discover how React Hooks can transform your functional components and make your code more reusable and easier to understand.",
    content: `
# The Magic of React Hooks: A Beginner's Guide

React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class. They've quickly become the preferred way to write React components due to their simplicity and composability.

## What are Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes — they let you use React without classes.

## The Most Common Hooks

### useState

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Rules of Hooks

1. Only call Hooks at the top level. Don't call Hooks inside loops, conditions, or nested functions.
2. Only call Hooks from React function components or custom Hooks.

## Creating Your Own Hooks

One of the best things about Hooks is that you can create your own to extract component logic into reusable functions.

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return width;
}

function MyComponent() {
  const width = useWindowWidth();
  return <div>Window width: {width}</div>;
}
\`\`\`

## Conclusion

React Hooks make it easier to reuse stateful logic between components and make components easier to understand. By using Hooks, you can extract stateful logic from a component so it can be tested independently and reused.

As you become more familiar with Hooks, you'll find they offer a more direct way to use React features and can help organize the logic inside your components.
    `,
    category: PostCategory.SPELLS,
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
    publishedAt: new Date(2023, 5, 15),
    featured: true,
    tags: ["React", "JavaScript", "Beginner", "Tutorial"]
  },
  {
    title: "Brewing Perfect TypeScript Interfaces",
    slug: "brewing-perfect-typescript-interfaces",
    excerpt: "Learn the art of crafting well-designed TypeScript interfaces that will make your code more maintainable and robust.",
    content: `
# Brewing Perfect TypeScript Interfaces

TypeScript interfaces are a powerful way to define contracts within your code as well as contracts with code outside of your project. In this post, we'll explore how to create effective TypeScript interfaces that enhance your development experience.

## What are Interfaces?

Interfaces define the shape of an object, providing a strong type-checking experience at development time.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Can only be set when the object is first created
}
\`\`\`

## Interface vs. Type Alias

While interfaces and type aliases can be used interchangeably in many cases, there are some key differences:

- Interfaces can be extended or implemented
- Types can create union or intersection types
- Interfaces can be merged through declaration merging

\`\`\`typescript
// Interface extending another interface
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Type aliases with union types
type Status = 'pending' | 'approved' | 'rejected';

// Declaration merging with interfaces
interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}

// Both declarations are merged
const window: Window = {
  title: "My Window",
  ts: { version: "4.5.4" }
};
\`\`\`

## Best Practices

1. **Use descriptive names** - Choose names that clearly convey the purpose of the interface.
2. **Keep interfaces focused** - Each interface should represent a single concept.
3. **Use readonly** - For properties that shouldn't be modified after creation.
4. **Consider using interfaces for public APIs** - They're more extensible for future changes.
5. **Use optional properties when appropriate** - Don't require what isn't always necessary.

## Advanced Interface Techniques

### Index Signatures

\`\`\`typescript
interface Dictionary<T> {
  [key: string]: T;
}

const stringDict: Dictionary<string> = {
  key1: "value1",
  key2: "value2"
};
\`\`\`

### Function Types

\`\`\`typescript
interface SearchFunction {
  (source: string, subString: string): boolean;
}

const mySearch: SearchFunction = function(src, sub) {
  return src.search(sub) > -1;
};
\`\`\`

### Hybrid Types

\`\`\`typescript
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  const counter = function(start: number) {
    return \`Count from \${start}\`;
  } as Counter;
  
  counter.interval = 123;
  counter.reset = function() { console.log('reset called'); };
  
  return counter;
}
\`\`\`

## Conclusion

Well-designed TypeScript interfaces can significantly improve the quality and maintainability of your code. By following the best practices outlined in this article, you'll create more robust and developer-friendly interfaces.

Remember that good interfaces should be:

- Focused on a single concept
- Clear and descriptive
- Appropriately detailed without being overly restrictive

As you become more comfortable with interfaces, you'll find they're an invaluable tool in your TypeScript development workflow.
    `,
    category: PostCategory.POTIONS,
    imageUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1000",
    publishedAt: new Date(2023, 6, 22),
    featured: true,
    tags: ["TypeScript", "Advanced"]
  },
  {
    title: "Ancient Scrolls of Next.js API Routes",
    slug: "ancient-scrolls-nextjs-api-routes",
    excerpt: "Uncover the secrets of Next.js API routes and learn how to create powerful backend functionality directly within your Next.js application.",
    content: `
# Ancient Scrolls of Next.js API Routes

Next.js API routes provide a straightforward solution for building API endpoints within a Next.js application. Let's explore how to use them effectively.

## What are Next.js API Routes?

API routes allow you to create API endpoints inside a Next.js application. They're defined in the \`pages/api\` directory and are server-side only bundles.

## Basic API Route

\`\`\`typescript
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
\`\`\`

## Request Handling

API routes can handle different HTTP methods:

\`\`\`typescript
// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Handle GET request
      return res.status(200).json({ users: ['John', 'Jane'] })
    case 'POST':
      // Handle POST request
      const { name } = req.body
      return res.status(201).json({ message: \`User \${name} created\` })
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(\`Method \${req.method} Not Allowed\`)
  }
}
\`\`\`

## Dynamic API Routes

Just like pages, API routes can be dynamic:

\`\`\`typescript
// pages/api/user/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  
  switch (req.method) {
    case 'GET':
      // Get user data
      return res.status(200).json({ id, name: \`User \${id}\` })
    case 'PUT':
      // Update user data
      return res.status(200).json({ id, name: req.body.name })
    case 'DELETE':
      // Delete user
      return res.status(200).json({ id, deleted: true })
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).end(\`Method \${req.method} Not Allowed\`)
  }
}
\`\`\`

## API Middleware

You can use middleware for authentication, logging, or other shared functionality:

\`\`\`typescript
// middleware/withAuth.ts
import { NextApiRequest, NextApiResponse } from 'next'

export function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Check for auth token
    const token = req.headers.authorization
    
    if (!token || token !== 'valid-token') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    // Call the original handler
    return handler(req, res)
  }
}

// pages/api/protected.ts
import { withAuth } from '../../middleware/withAuth'

function protectedHandler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ data: 'This is protected data' })
}

export default withAuth(protectedHandler)
\`\`\`

## Connecting to a Database

API routes are perfect for database operations:

\`\`\`typescript
// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const posts = await prisma.post.findMany({
        include: { author: true }
      })
      return res.status(200).json(posts)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch posts' })
    }
  }
  
  res.setHeader('Allow', ['GET'])
  return res.status(405).end(\`Method \${req.method} Not Allowed\`)
}
\`\`\`

## Best Practices

1. **Keep endpoints focused** - Each API route should handle a specific resource or action.
2. **Validate inputs** - Always validate and sanitize inputs to prevent security vulnerabilities.
3. **Handle errors gracefully** - Provide meaningful error responses.
4. **Use appropriate HTTP status codes** - Communicate the result of API calls clearly.
5. **Consider rate limiting for public APIs** - Protect against abuse.

## Conclusion

Next.js API routes provide a convenient way to build backend functionality directly within your Next.js application. They're particularly useful for:

- Building a simple backend for your Next.js app
- Creating API endpoints for serverless functions
- Hiding environment variables and secure operations from the client
- Building webhooks or internal APIs

By mastering API routes, you can create full-stack applications with Next.js alone, simplifying your development workflow and deployment process.
    `,
    category: PostCategory.SCROLLS,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
    publishedAt: new Date(2023, 7, 10),
    featured: true,
    tags: ["NextJS", "JavaScript", "Tutorial"]
  },
  {
    title: "Magical Artifacts: Building UI Components with Mantine",
    slug: "magical-artifacts-mantine-ui",
    excerpt: "Learn how to create enchanting UI components with the Mantine library that will captivate your users.",
    content: `
# Magical Artifacts: Building UI Components with Mantine

Mantine is a modern React UI library with a focus on usability, accessibility, and developer experience. In this guide, we'll explore how to create stunning UI components with Mantine.

## Getting Started with Mantine

First, install the required packages:

\`\`\`bash
npm install @mantine/core @mantine/hooks @emotion/react
\`\`\`

Next, set up the MantineProvider in your application:

\`\`\`tsx
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <YourApp />
    </MantineProvider>
  );
}
\`\`\`

## Basic Components

Mantine provides a rich set of components. Let's start with some basic ones:

### Button

\`\`\`tsx
import { Button } from '@mantine/core';

function ButtonDemo() {
  return (
    <>
      <Button>Default button</Button>
      <Button color="red" radius="xl" size="md">
        Custom button
      </Button>
      <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
        Gradient button
      </Button>
    </>
  );
}
\`\`\`

### Text Inputs

\`\`\`tsx
import { TextInput, Textarea, Select } from '@mantine/core';

function FormDemo() {
  return (
    <>
      <TextInput
        label="Email"
        placeholder="your@email.com"
        required
      />
      
      <Textarea
        label="Your message"
        placeholder="Type your message here"
        mt="md"
      />
      
      <Select
        label="Select your favorite framework"
        placeholder="Pick one"
        data={[
          { value: 'react', label: 'React' },
          { value: 'angular', label: 'Angular' },
          { value: 'vue', label: 'Vue' },
          { value: 'svelte', label: 'Svelte' },
        ]}
        mt="md"
      />
    </>
  );
}
\`\`\`

## Building a Custom Card Component

Let's build a more complex component - an article card:

\`\`\`tsx
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

interface ArticleCardProps {
  image: string;
  title: string;
  category: string;
  description: string;
  badges: string[];
}

export function ArticleCard({ image, title, category, description, badges }: ArticleCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={image}
          height={160}
          alt={title}
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        <Badge color="pink" variant="light">
          {category}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>

      <Group mt="lg">
        {badges.map((badge) => (
          <Badge key={badge} variant="outline">
            {badge}
          </Badge>
        ))}
      </Group>

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Read article
      </Button>
    </Card>
  );
}
\`\`\`

## Using Mantine Hooks

Mantine provides useful hooks to enhance your components:

\`\`\`tsx
import { useState } from 'react';
import { Button, Group, Text } from '@mantine/core';
import { useHotkeys, useToggle, useMediaQuery } from '@mantine/hooks';

function HooksDemo() {
  // Color toggle
  const [colorScheme, toggle] = useToggle(['light', 'dark']);
  
  // Media query hook
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Hotkey hook
  useHotkeys([
    ['mod+J', () => toggle()],
  ]);

  return (
    <div>
      <Text>Current scheme: {colorScheme}</Text>
      <Text>Is mobile: {isMobile ? 'Yes' : 'No'}</Text>
      <Button onClick={() => toggle()}>Toggle color scheme</Button>
      <Text size="sm">Press Ctrl+J (or ⌘+J on macOS) to toggle</Text>
    </div>
  );
}
\`\`\`

## Theming

One of Mantine's strengths is its theming capabilities:

\`\`\`tsx
import { MantineProvider, Button, Text } from '@mantine/core';

function ThemedApp() {
  return (
    <MantineProvider
      theme={{
        colorScheme: 'dark',
        fontFamily: 'Open Sans, sans-serif',
        primaryColor: 'teal',
        defaultRadius: 'md',
        components: {
          Button: {
            defaultProps: {
              size: 'md',
              variant: 'filled',
            },
            styles: (theme) => ({
              root: {
                fontWeight: 600,
              },
            }),
          },
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Button>Themed button</Button>
      <Text>Themed text</Text>
    </MantineProvider>
  );
}
\`\`\`

## Form Handling with Mantine

Mantine offers a form library that makes form handling easier:

\`\`\`tsx
import { useForm } from '@mantine/form';
import { TextInput, Button, Box, Group, PasswordInput } from '@mantine/core';

function LoginForm() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\\S+@\\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Password"
          required
          mt="sm"
          {...form.getInputProps('password')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </Box>
  );
}
\`\`\`

## Conclusion

Mantine provides a powerful set of tools for building beautiful, accessible, and customizable UI components in React applications. Its comprehensive set of components, hooks, and utilities can significantly speed up your development process.

By mastering Mantine, you'll add a valuable tool to your frontend development arsenal. Whether you're building a simple form or a complex dashboard, Mantine can help you create polished interfaces with minimal effort.
    `,
    category: PostCategory.ARTIFACTS,
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000",
    publishedAt: new Date(2023, 8, 5),
    featured: false,
    tags: ["React", "Mantine", "UI", "Tutorial"]
  },
  {
    title: "Deep Dive into Dark Magic: Understanding the useContext Hook",
    slug: "deep-dive-dark-magic-usecontext",
    excerpt: "Master the advanced patterns and techniques for effective state management with React's useContext hook.",
    content: `
# Deep Dive into Dark Magic: Understanding the useContext Hook

React's useContext hook provides a way to share values like themes, user data, or other configuration between components without explicitly passing props through every level of the tree. Let's explore this powerful feature in depth.

## The Problem useContext Solves

Before context, you might have encountered "prop drilling" - passing props through intermediate elements that don't need the data but only pass it along:

\`\`\`tsx
// Before context
function App() {
  const [user, setUser] = useState({ name: 'John' });
  
  return (
    <div>
      <Header user={user} />
      <Main user={user} />
      <Footer />
    </div>
  );
}

function Header({ user }) {
  return <Navbar user={user} />;
}

function Navbar({ user }) {
  return <div>Hello, {user.name}</div>;
}

function Main({ user }) {
  return (
    <div>
      <Profile user={user} />
      <Content />
    </div>
  );
}

function Profile({ user }) {
  return <div>Profile of {user.name}</div>;
}
\`\`\`

## Creating and Using Context

Here's how to solve the above problem with Context:

\`\`\`tsx
import { createContext, useContext, useState } from 'react';

// Create a context with a default value
const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState({ name: 'John' });
  
  return (
    <UserContext.Provider value={user}>
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

function Header() {
  return <Navbar />;
}

function Navbar() {
  const user = useContext(UserContext);
  return <div>Hello, {user.name}</div>;
}

function Main() {
  return (
    <div>
      <Profile />
      <Content />
    </div>
  );
}

function Profile() {
  const user = useContext(UserContext);
  return <div>Profile of {user.name}</div>;
}
\`\`\`

## TypeScript and Context

With TypeScript, you can create typed contexts:

\`\`\`tsx
interface User {
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const value = { user, setUser };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
\`\`\`

## Advanced Patterns with useContext

### Context with Reducer

For more complex state management, combine Context with useReducer:

\`\`\`tsx
import { createContext, useContext, useReducer } from 'react';

// Define action types
type Action =
  | { type: 'login', payload: User }
  | { type: 'logout' };

type State = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: State = {
  user: null,
  isAuthenticated: false
};

function authReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'login':
      return {
        user: action.payload,
        isAuthenticated: true
      };
    case 'logout':
      return {
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Usage
function LoginButton() {
  const { dispatch } = useAuth();
  
  const handleLogin = () => {
    dispatch({
      type: 'login',
      payload: { name: 'John', email: 'john@example.com' }
    });
  };
  
  return <button onClick={handleLogin}>Login</button>;
}

function UserInfo() {
  const { state } = useAuth();
  
  if (!state.isAuthenticated) {
    return <div>Not logged in</div>;
  }
  
  return <div>Hello, {state.user.name}</div>;
}
\`\`\`

### Context Composition

When dealing with multiple contexts, composition can help organize your code:

\`\`\`tsx
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Usage
function App() {
  return (
    <AppProviders>
      <YourApp />
    </AppProviders>
  );
}
\`\`\`

## Performance Considerations

Context causes all components that use it to re-render when the context value changes. To optimize:

1. **Split your contexts** - Separate unrelated state into different contexts

\`\`\`tsx
// Instead of
const AppContext = createContext({ user, theme, notifications });

// Do this
const UserContext = createContext(user);
const ThemeContext = createContext(theme);
const NotificationContext = createContext(notifications);
\`\`\`

2. **Memoize context values** - Use useMemo to prevent unnecessary re-renders

\`\`\`tsx
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Memoize the value object to prevent unnecessary re-renders
  const value = useMemo(() => ({ user, setUser }), [user]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
\`\`\`

## Conclusion

The useContext hook, when used properly, can significantly simplify your React application by eliminating prop drilling and creating a more maintainable state management system. 

Key takeaways:

1. Use context for global state that many components need
2. Create custom hooks to consume context values
3. Split unrelated state into separate contexts
4. Combine with useReducer for complex state logic
5. Memoize context values for better performance

By mastering these patterns, you'll be able to create more organized, maintainable React applications with clean and efficient state management.
    `,
    category: PostCategory.SPELLS,
    imageUrl: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1000",
    publishedAt: new Date(2023, 9, 18),
    featured: false,
    tags: ["React", "Advanced", "Dark Magic"]
  }
];

// Sample blog comments data
export const blogComments = [
  // Comments for "The Magic of React Hooks: A Beginner's Guide"
  {
    id: "comment1",
    content: "This tutorial was exactly what I needed! I've been struggling with understanding hooks, but your explanation made it click. The examples are really clear and practical.",
    authorName: "Sarah Johnson",
    authorEmail: "sarah.j@example.com",
    authorWebsite: "https://sarahcodes.dev",
    isApproved: true,
    postId: "magic-of-react-hooks",
    createdAt: new Date(2023, 5, 16, 14, 35),
    replies: [
      {
        id: "comment1-reply1",
        content: "I'm glad you found it helpful, Sarah! Let me know if you have any questions about the implementation details.",
        authorName: "Wessley Nyakanyanga",
        authorEmail: "wessley@example.com",
        isApproved: true,
        createdAt: new Date(2023, 5, 16, 15, 12)
      },
      {
        id: "comment1-reply2",
        content: "I had the same experience! The diagrams really helped me visualize how the state flows.",
        authorName: "Miguel Rodriguez",
        authorEmail: "miguel@example.com",
        isApproved: true,
        createdAt: new Date(2023, 5, 17, 9, 24)
      }
    ]
  },
  {
    id: "comment2",
    content: "Great article, but I think you missed an important edge case with useEffect cleanup functions when dealing with async operations. Would love to see a follow-up post addressing that!",
    authorName: "Dev Thompson",
    authorEmail: "dev.thompson@example.com",
    authorWebsite: "https://devthoughts.tech",
    isApproved: true,
    postId: "magic-of-react-hooks",
    createdAt: new Date(2023, 5, 18, 11, 45)
  },
  {
    id: "comment3",
    content: "I've been using classes for years and was skeptical about hooks. This post convinced me to give them a try on my next project. Thanks for the clear explanations!",
    authorName: "Chris Lee",
    authorEmail: "chris@example.com",
    isApproved: true,
    postId: "magic-of-react-hooks",
    createdAt: new Date(2023, 5, 20, 16, 30)
  },

  // Comments for "Brewing Perfect TypeScript Interfaces"
  {
    id: "comment4",
    content: "The comparison between interfaces and type aliases was super helpful. I've been using them interchangeably without understanding the differences.",
    authorName: "Emma Wilson",
    authorEmail: "emma@example.com",
    isApproved: true,
    postId: "brewing-perfect-typescript-interfaces",
    createdAt: new Date(2023, 6, 23, 10, 15),
    replies: [
      {
        id: "comment4-reply1",
        content: "Same here! I didn't realize declaration merging was an interface-only feature. That's going to change how I structure my code.",
        authorName: "Alex Chen",
        authorEmail: "alex@example.com",
        isApproved: true,
        createdAt: new Date(2023, 6, 23, 11, 42)
      }
    ]
  },
  {
    id: "comment5",
    content: "I disagree with your recommendation to use interfaces for public APIs. Types provide better constraints for exact shapes. Here's an example: [code example showing union types]",
    authorName: "Tyler Black",
    authorEmail: "tyler@example.com",
    authorWebsite: "https://typescript-expert.com",
    isApproved: true,
    postId: "brewing-perfect-typescript-interfaces",
    createdAt: new Date(2023, 6, 25, 9, 18),
    replies: [
      {
        id: "comment5-reply1",
        content: "That's a fair point, Tyler. It depends on the specific use case. For extensible APIs where consumers might need to augment your definitions, interfaces work better. For strict shapes, types can be preferable.",
        authorName: "Luna Silverstone",
        authorEmail: "luna.silverstone@example.com",
        isApproved: true,
        createdAt: new Date(2023, 6, 25, 10, 30)
      },
      {
        id: "comment5-reply2",
        content: "I've found a middle ground by using types for complex shapes and interfaces for anything that might be extended. Best of both worlds!",
        authorName: "Jamie Rodriguez",
        authorEmail: "jamie@example.com",
        isApproved: true,
        createdAt: new Date(2023, 6, 25, 14, 25)
      }
    ]
  },

  // Comments for "Ancient Scrolls of Next.js API Routes"
  {
    id: "comment6",
    content: "Your middleware example saved me hours of debugging! I was struggling with authentication in API routes.",
    authorName: "Raj Patel",
    authorEmail: "raj@example.com",
    authorWebsite: "https://rajdev.io",
    isApproved: true,
    postId: "ancient-scrolls-nextjs-api-routes",
    createdAt: new Date(2023, 7, 12, 8, 45)
  },
  {
    id: "comment7",
    content: "How would you handle file uploads through API routes? I tried using formidable but ran into issues with the serverless environment.",
    authorName: "Lisa Wang",
    authorEmail: "lisa@example.com",
    isApproved: true,
    postId: "ancient-scrolls-nextjs-api-routes",
    createdAt: new Date(2023, 7, 15, 19, 22),
    replies: [
      {
        id: "comment7-reply1",
        content: "For file uploads in serverless, I recommend using a direct-to-S3 approach with presigned URLs. I wrote a guide about it here: [link]",
        authorName: "Wessley Nyakanyanga",
        authorEmail: "wessley@example.com",
        authorWebsite: "https://wessleyn.me",
        isApproved: true,
        createdAt: new Date(2023, 7, 16, 9, 10)
      }
    ]
  },

  // Comments for "Magical Artifacts: Building UI Components with Mantine"
  {
    id: "comment8",
    content: "Mantine has been a game-changer for our team's productivity. The form handling alone saved us weeks of development time.",
    authorName: "Jordan Casey",
    authorEmail: "jordan@example.com",
    isApproved: true,
    postId: "magical-artifacts-mantine-ui",
    createdAt: new Date(2023, 8, 7, 14, 50)
  },
  {
    id: "comment9",
    content: "How does Mantine compare with Material UI in terms of customization? I've been using MUI but finding it somewhat limiting for advanced theming.",
    authorName: "Nina Zhao",
    authorEmail: "nina@example.com",
    authorWebsite: "https://ninadesigns.co",
    isApproved: true,
    postId: "magical-artifacts-mantine-ui",
    createdAt: new Date(2023, 8, 10, 11, 15),
    replies: [
      {
        id: "comment9-reply1",
        content: "I've used both extensively, and I find Mantine much more flexible for theming. The component styles API is more intuitive, and the theme object structure makes more sense to me.",
        authorName: "Olivia Martinez",
        authorEmail: "olivia@example.com",
        isApproved: true,
        createdAt: new Date(2023, 8, 10, 13, 40)
      },
      {
        id: "comment9-reply2",
        content: "In my experience, Material UI has better enterprise support, but Mantine is catching up quickly and offers more freedom for customization outside the Material Design guidelines.",
        authorName: "Orion Blackwood",
        authorEmail: "orion.blackwood@example.com",
        isApproved: true,
        createdAt: new Date(2023, 8, 10, 16, 22)
      }
    ]
  },

  // Comments for "Deep Dive into Dark Magic: Understanding the useContext Hook"
  {
    id: "comment10",
    content: "The performance considerations section was eye-opening. I was creating a single giant context for my app and wondering why it was slow. Splitting it up made a huge difference!",
    authorName: "Kathy Nelson",
    authorEmail: "kathy@example.com",
    isApproved: true,
    postId: "deep-dive-dark-magic-usecontext",
    createdAt: new Date(2023, 9, 19, 10, 33)
  },
  {
    id: "comment11",
    content: "Great article! One question: how do you handle context in server components with React Server Components?",
    authorName: "David Kim",
    authorEmail: "david@example.com",
    authorWebsite: "https://davidkim.dev",
    isApproved: true,
    postId: "deep-dive-dark-magic-usecontext",
    createdAt: new Date(2023, 9, 20, 15, 27),
    replies: [
      {
        id: "comment11-reply1",
        content: "That's a great question! With RSC, context works differently since server components can't use hooks. You'll need to keep context usage in client components. I'm planning a follow-up article specifically on this topic.",
        authorName: "Wessley Nyakanyanga",
        authorEmail: "wessley@example.com",
        isApproved: true,
        createdAt: new Date(2023, 9, 20, 16, 45)
      }
    ]
  },
  {
    id: "comment12",
    content: "I love the dark magic theme of this article! The examples with TypeScript were particularly useful for my team's project.",
    authorName: "Sam Roberts",
    authorEmail: "sam@example.com",
    isApproved: true,
    postId: "deep-dive-dark-magic-usecontext",
    createdAt: new Date(2023, 9, 22, 9, 12)
  }
];
