import SocialIcon from '@repo/ui/components/shared/SocialIcon';
import TypingEffect from '@repo/ui/components/shared/TypingEffect';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileData } from '../../_actions/fetchProfile';
import HireMeBtn from './HireMeBtn';
import classes from './ProfileInfo.module.css';

interface ProfileInfoProps {
    profile: ProfileData | null;
}

export default function ProfileInfo({ profile }: ProfileInfoProps) {
    // ProfileInfoSkeleton is now handled by the dynamic import wrapper
    if (!profile) {
        return null;
    }

    const { displayName, workEmail, tagline, avatarUrl, socialLinks, bio } = profile;

    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-1">
            <div className="col profile">
                <Link href="/">
                    <Image
                        className="img-fluid rounded border-0 shadow-sm mb-4"
                        alt="Profile Image"
                        src={avatarUrl}
                        width={300}
                        height={300}
                        priority
                    />
                </Link>
            </div>
            <div className="col">
                <h3 className="fs-5 fw-bold text-primary">
                    <TypingEffect text={displayName} typingSpeed={70} />
                </h3>
                <p>{tagline}</p>
                <p>{bio}</p>
                <h3 className="fs-6 fw-bold text-primary">
                    <TypingEffect text="Email" typingSpeed={70} />
                </h3>
                <p><Link href={`mailto:${workEmail}`}>{workEmail}</Link></p>
                <h3 className="fs-6 fw-bold text-primary">
                    <TypingEffect text="Social" typingSpeed={70} />
                </h3>
                <ul className="list-inline">
                    {socialLinks.map((link, index) => (
                        <li key={link.id || `social-link-${index}`} className="list-inline-item me-3">
                            <Link
                                className="text-reset"
                                href={link.url}
                                target="_blank"
                                rel="noopener"
                                aria-label={`${link.platform} Profile`}
                            >
                                <SocialIcon
                                    platform={link.platform}
                                    size={20}
                                    className="bi fs-5"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className={classes.btns}>
                    <Link className={classes.btn} role="button" href="/blog">
                        ~/ cd Blog
                    </Link>
                    <HireMeBtn />
                </div>
            </div>
        </div>
    );
}