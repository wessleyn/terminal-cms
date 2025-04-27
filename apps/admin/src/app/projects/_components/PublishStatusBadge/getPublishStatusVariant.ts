import { PublishStatus } from '@repo/db';

export const getPublishStatusVariant = (status: PublishStatus) => {
    switch (status) {
        case PublishStatus.PUBLISHED:
            return 'green';
        case PublishStatus.ARCHIVED:
            return 'yellow';
        case PublishStatus.DRAFT:
            return 'gray';
        default:
            return 'default';
    }
};
