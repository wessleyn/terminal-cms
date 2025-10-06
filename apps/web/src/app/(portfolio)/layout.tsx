import { checkUserSession } from '@repo/auth';
import { UserRole } from '@repo/db';
import Link from 'next/link';
import { fetchProfile } from './_actions/fetchProfile';
import Footer from './_components/Footer';
import ProfileInfoWrapper from './_components/ProfileInfo/ProfileInfoWrapper';

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
    const profileData = await fetchProfile();
    const session = await checkUserSession();

    return (
        <main>
            <section className="py-5">
            {
                session && session.role === UserRole.ADMIN && (
                    <div className="position-fixed top-2 end-0 p-3">
                        <Link href="https://admin.wessleyn.me" className="badge bg-success fs-6 px-3 py-2 text-white text-decoration-none shadow">
                            Admin Panel
                        </Link>
                    </div>
                )
            }
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 mb-4 portfolio-container">
                            <ProfileInfoWrapper profile={profileData} />
                        </div>
                        {children}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}