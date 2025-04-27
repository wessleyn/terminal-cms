'use client';

import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';

const HeaderTitle = () => {
    // TODO: fetch the header title for dyanmic routes from the server
    const pathname = usePathname();
    // Get route parameters directly from Next.js router
    const params = useParams();

    const title = useMemo(() => {
        // Extract the path parts
        const parts = pathname.split('/').filter(Boolean);
        
        // Handle empty path or just dashboard root
        if (parts.length === 0 || (parts.length === 1 && parts[0] === 'dashboard')) {
            return 'Dashboard';
        }
        
        // Map of known routes to their display titles
        const routeMappings: Record<string, string> = {
            'projects': 'Projects',
            'blog': 'Blog',
            'users': 'Users',
            'settings': 'Settings',
            'profile': 'Profile',
            'hireMe': 'Hire Me',
        };
        
        // Check if we're on a specific entity page with a dynamic segment
        // Next.js params object contains all dynamic route parameters
        if (params) {
            // For routes like /projects/[id] or /blog/[slug]
            if (parts.includes('projects') && params.id) {
                return 'Project Details';
            }
            if (parts.includes('blog') && (params.id || params.slug)) {
                return 'Blog Post';
            }
            // Add other specific entity pages as needed
        }

        // If not handling a specific entity, find the last meaningful path segment
        const lastMeaningfulSegment = parts.length > 0 ? parts[parts.length - 1] : '';
        
        // If we have a known mapping for this route, use it
        if (lastMeaningfulSegment && routeMappings[lastMeaningfulSegment]) {
            return routeMappings[lastMeaningfulSegment];
        }
        
        // Otherwise format the segment for display
        return lastMeaningfulSegment
            ?.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, [pathname, params]);

    return (
        <h1 className="dashboard-title">{title}</h1>
    );
};

export default HeaderTitle;
