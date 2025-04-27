import { Metadata } from 'next';
import { fetchPrivacyPolicy } from './_actions/fetchPrivacy';

export const metadata: Metadata = {
    title: "Privacy Policy | Wessley's Terminal",
    description: "Privacy policy detailing how we handle your data when you use our website."
};

export default async function PrivacyPage() {
    // Fetch privacy policy sections from the database
    const { success, data: privacyData, error } = await fetchPrivacyPolicy();

    return (
        <div className="col-md-8 offset-md-1">
            <div className="row">
                <div className="col">
                    <h2 className="fs-3 fw-bold text-primary terminal-cursor">$ cat ~/privacy.txt</h2>
                    <div className="mb-5 terminal-content">
                        <h3 className="fs-5 fw-bold text-primary">Privacy Policy</h3>
                        <p className="text-muted">Last Updated: {privacyData?.updatedAt ? new Date(privacyData.updatedAt).toLocaleDateString() : 'April 16, 2025'}</p>

                        {privacyData?.descPhrase && <p>{privacyData.descPhrase}</p>}

                        {!success ? (
                            <div className="alert alert-danger">
                                <p>Error: {error}</p>
                                <p>Unable to load privacy policy content. Please try again later.</p>
                            </div>
                        ) : privacyData && privacyData.sections && privacyData.sections.length > 0 ? (
                            // Map through privacy sections from the database
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            privacyData.sections.map((section: any) => (
                                <div key={section.id} className="mb-4">
                                    <h4 className="fs-5 fw-bold text-primary">{section.title}</h4>
                                    {/* Split content by newlines and render paragraphs */}
                                    {section.content.split('\n\n').map((paragraph: string, i: number) => (
                                        <div key={i} className="mb-3">
                                            {paragraph.startsWith('-') ? (
                                                <ul>
                                                    {paragraph.split('\n').map((item: string, j: number) => (
                                                        <li key={j}>{item.substring(2)}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>{paragraph}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info">
                                <p>No privacy policy sections found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}