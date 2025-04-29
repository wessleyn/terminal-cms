import { PrivacyType } from '../../../generated/prisma'

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