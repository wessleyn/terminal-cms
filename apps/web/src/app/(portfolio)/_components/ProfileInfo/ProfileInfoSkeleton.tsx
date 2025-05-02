import classes from './ProfileInfo.module.css';

export default function ProfileInfoSkeleton() {
    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-1">
            <div className="col profile">
                {/* Skeleton for avatar */}
                <div
                    className="img-fluid border rounded border-0 shadow-sm mb-4 skeleton-pulse"
                    style={{
                        width: '300px',
                        height: '300px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                    }}
                />
            </div>
            <div className="col">
                {/* Name skeleton */}
                <div
                    className="skeleton-pulse mb-3"
                    style={{
                        height: '28px',
                        width: '70%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                    }}
                />

                {/* Tagline skeleton */}
                <div
                    className="skeleton-pulse mb-3"
                    style={{
                        height: '20px',
                        width: '90%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                    }}
                />

                {/* Description skeleton - multiple lines */}
                <div
                    className="skeleton-pulse mb-3"
                    style={{
                        height: '60px',
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                    }}
                />

                {/* Email heading skeleton */}
                <div
                    className="skeleton-pulse mb-2"
                    style={{
                        height: '24px',
                        width: '40%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                    }}
                />

                {/* Email text skeleton */}
                <div
                    className="skeleton-pulse mb-3"
                    style={{
                        height: '20px',
                        width: '60%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                    }}
                />

                {/* Social heading skeleton */}
                <div
                    className="skeleton-pulse mb-2"
                    style={{
                        height: '24px',
                        width: '40%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                    }}
                />

                {/* Social icons skeleton */}
                <div className="list-inline mb-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="list-inline-item skeleton-pulse"
                            style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '10px'
                            }}
                        />
                    ))}
                </div>

                {/* Button skeleton */}
                <div className={classes.btns}>
                    <div
                        className="skeleton-pulse mb-3"
                        style={{
                            height: '40px',
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px'
                        }}
                    />
                    <div
                        className="skeleton-pulse"
                        style={{
                            height: '40px',
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}