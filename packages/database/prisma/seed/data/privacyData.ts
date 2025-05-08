import { PrivacyType } from '../../../generated/prisma';

export const privacyData = {
    type: PrivacyType.PORTFOLIO,
    descPhrase: "This Privacy Policy describes how your personal information is collected, used, and shared when you visit wessleyn.me (the \"Site\").",
    sections: [
        {
            title: "Personal Information We Collect",
            content: "When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.\n\nAdditionally, as you browse the Site, we collect information about the individual web pages that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as \"Device Information.\"",
            order: 0
        },
        {
            title: "How We Collect Device Information",
            content: "We collect Device Information using the following technologies:\n\n- \"Cookies\" are data files that are placed on your device or computer and often include an anonymous unique identifier.\n- \"Log files\" track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.",
            order: 1
        },
        {
            title: "Contact Form Information",
            content: "When you use the contact form on our Site, we collect the personal information you provide, such as your name, email address, and any other information you include in your message. We refer to this information as \"Contact Information.\"\n\nWhen we talk about \"Personal Information\" in this Privacy Policy, we are talking both about Device Information and Contact Information.",
            order: 2
        },
        {
            title: "How We Use Your Personal Information",
            content: "We use your Contact Information to communicate with you, respond to your inquiries, and provide you with information or services that you request from us.\n\nWe use the Device Information that we collect to help us screen for potential security issues and improve and optimize our Site (for example, by analyzing user navigation patterns and generating analytics about how our users browse and interact with the Site).",
            order: 3
        },
        {
            title: "Sharing Your Personal Information",
            content: "We share your Personal Information with third parties to help us use your Personal Information, as described above. For example:\n\n- We use Formspree to process contact form submissions.\n- We use Cloudflare Turnstile for CAPTCHA verification to prevent spam.\n- We use Simple Analytics to help us understand how our customers use the Site.\n\nWe may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant, or other lawful request for information we receive, or to otherwise protect our rights.",
            order: 4
        },
        {
            title: "Do Not Track",
            content: "We respect Do Not Track signals from your browser and use analytics services (Simple Analytics) that do not track you across websites.",
            order: 5
        },
        {
            title: "Data Retention",
            content: "When you submit a contact form through the Site, we will maintain your Contact Information for our records unless and until you ask us to delete this information.",
            order: 6
        },
        {
            title: "Changes",
            content: "We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.",
            order: 7
        },
        {
            title: "Contact Us",
            content: "For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at privacy@wessleyn.me.",
            order: 8
        }
    ]
};

export const blogPrivacyData = {
    type: PrivacyType.BLOG,
    descPhrase: "This Privacy Policy describes how your personal information is collected, used, and shared when you visit the Terminal Blog (the \"Blog\").",
    sections: [
        {
            title: "Personal Information We Collect",
            content: "When you visit the Blog, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.\n\nAdditionally, as you browse the Blog, we collect information about the individual web pages that you view, what websites or search terms referred you to the Blog, and information about how you interact with the Blog. We refer to this automatically-collected information as \"Device Information.\"",
            order: 0
        },
        {
            title: "How We Collect Device Information",
            content: "We collect Device Information using the following technologies:\n\n- \"Cookies\" are data files that are placed on your device or computer and often include an anonymous unique identifier.\n- \"Log files\" track actions occurring on the Blog, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.",
            order: 1
        },
        {
            title: "Comments Information",
            content: "When you leave comments on our Blog, we collect the data shown in the comments form, and also your IP address and browser user agent string to help spam detection.\n\nAn anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. After approval of your comment, your profile picture is visible to the public in the context of your comment.",
            order: 2
        },
        {
            title: "How We Use Your Personal Information",
            content: "We use the Device Information that we collect to help us screen for potential security issues and improve and optimize our Blog (for example, by analyzing user navigation patterns and generating analytics about how our users browse and interact with the Blog).",
            order: 3
        },
        {
            title: "Sharing Your Personal Information",
            content: "We share your Personal Information with third parties to help us use your Personal Information, as described above. For example:\n\n- We use Cloudflare Turnstile for CAPTCHA verification to prevent spam.\n- We use Simple Analytics to help us understand how our readers use the Blog.\n\nWe may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant, or other lawful request for information we receive, or to otherwise protect our rights.",
            order: 4
        },
        {
            title: "Do Not Track",
            content: "We respect Do Not Track signals from your browser and use analytics services (Simple Analytics) that do not track you across websites.",
            order: 5
        },
        {
            title: "Data Retention",
            content: "When you comment on the Blog, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.",
            order: 6
        },
        {
            title: "Changes",
            content: "We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.",
            order: 7
        },
        {
            title: "Contact Us",
            content: "For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at privacy@blog.wessleyn.me.",
            order: 8
        }
    ]
};

export const termsData = {
    type: PrivacyType.TERMS,
    descPhrase: "Welcome to Terminal Blog. By accessing this website, you are agreeing to be bound by these Terms and Conditions of Use.",
    sections: [
        {
            title: "Acceptance of Terms",
            content: "By accessing and using Terminal Blog (the \"Blog\"), you accept and agree to be bound by the terms and provisions of this agreement.",
            order: 0
        },
        {
            title: "Use License",
            content: "Permission is granted to temporarily view the materials (information or software) on the Blog for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n\n- Modify or copy the materials;\n- Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);\n- Attempt to decompile or reverse engineer any software contained on the Blog;\n- Remove any copyright or other proprietary notations from the materials; or\n- Transfer the materials to another person or \"mirror\" the materials on any other server.",
            order: 1
        },
        {
            title: "Disclaimer",
            content: "The materials on the Blog are provided on an 'as is' basis. The author makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
            order: 2
        },
        {
            title: "Limitations",
            content: "In no event shall the author or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Blog, even if the author or an authorized representative has been notified orally or in writing of the possibility of such damage.",
            order: 3
        },
        {
            title: "Comments",
            content: "When you comment on the Blog, you are responsible for the content of your comments. We reserve the right to remove comments that contain offensive language, personal attacks, spam, or are otherwise deemed inappropriate by the Blog administrators.",
            order: 4
        },
        {
            title: "Links",
            content: "The Blog may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.",
            order: 5
        },
        {
            title: "Modifications",
            content: "The author may revise these terms of service for the Blog at any time without notice. By using this Blog you are agreeing to be bound by the then current version of these terms of service.",
            order: 6
        },
        {
            title: "Governing Law",
            content: "These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
            order: 7
        },
        {
            title: "Contact Us",
            content: "If you have any questions about these Terms, please contact us at terms@blog.wessleyn.me.",
            order: 8
        }
    ]
};