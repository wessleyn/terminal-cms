import { ActivityStatus } from '@repo/db';

export const getActivityStatusVariant = (status: ActivityStatus) => {
    switch (status) {
        case ActivityStatus.COMPLETED:
            return 'yellow';
        case ActivityStatus.IN_PROGRESS:
            return 'violet';
        case ActivityStatus.NOT_STARTED:
            return 'red';
        case ActivityStatus.ABANDONED:
            return 'gray';
        case ActivityStatus.ARCHIVED:
            return 'dark';
        default:
            return 'default';
    }
};
