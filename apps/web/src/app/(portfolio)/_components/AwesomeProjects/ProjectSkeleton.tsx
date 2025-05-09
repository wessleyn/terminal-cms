import { Card } from "@mantine/core";

export default function ProjectSkeleton() {
    return (
        <Card
            
            className=" h-100 w-full bg-none p-0  position-relative"
            radius='md'>
            {/* Skeleton for image */}
            <div
                className="skeleton-pulse mb-3"
                style={{
                    height: '200px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
            />

            <div className="card-body d-flex flex-column gap-4 p-2 pb-4">
                {/* Title skeleton */}
                <div
                    className="skeleton-pulse"
                    style={{
                        height: '28px',
                        width: '70%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                    }}
                />

                {/* Description skeleton */}
                <div
                    className="skeleton-pulse"
                    style={{
                        height: '60px',
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                    }}
                />

                <div className="d-flex justify-content-between">
                    {/* Tech tags skeleton */}
                    <div className="d-flex flex-wrap gap-2 ">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="skeleton-pulse"
                                style={{
                                    height: '20px',
                                    width: '30px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    marginRight: '10px'
                                }}
                            />
                        ))}
                    </div>
                    {/* Action buttons skeleton */}
                    <div className="d-flex gap-2 ">
                        <div
                            className="skeleton-pulse"
                            style={{
                                height: '20px',
                                width: '30px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px'
                            }}
                        />
                        <div
                            className="skeleton-pulse"
                            style={{
                                height: '20px',
                                width: '30px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px'
                            }}
                        />
                        <div
                            className="skeleton-pulse"
                            style={{
                                height: '20px',
                                width: '30px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}