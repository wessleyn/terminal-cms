import "../globals.css";
import { fetchProfile } from './_actions/fetchProfile';
import Footer from './_components/Footer';
import ProfileInfo from './_components/ProfileInfo';

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
    // Fetch profile data from the database
    const profileData = await fetchProfile();

    return (
        <main>
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 mb-4 portfolio-container">
                            <ProfileInfo profile={profileData} />
                        </div>
                        {children}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}