import { HappyIndex } from '@repo/db';

export const getHappyIndexVariant = (status: HappyIndex) => {
    switch (status) {
        case HappyIndex.AWESOME:
            return 'amber';
        case HappyIndex.USEFUL:
            return 'blue';
        case HappyIndex.NEUTRAL:
            return 'gray';
        case HappyIndex.COOL:
            return 'green';
        default:
            return 'default';
    }
};
