'use client';

import TypingEffect from '@repo/ui/components/shared/TypingEffect';
import Script from 'next/script';
import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { hireMe } from './_actions/hireMe';
import { SubmitButton } from './_components/SubmitButton';

interface WindowWithTurnstile extends Window {
    turnstile?: { reset: () => void };
}

const initialState = {
    errors: {},
    success: false,
};

export default function HireMe() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(hireMe, initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form input focus/blur styling
    useEffect(() => {
        const handleFocusBlur = (e: Event) => {
            const element = e.target as HTMLElement;
            element.style.boxShadow = e.type === 'focus' ? '0 0 5px rgba(74, 246, 38, 0.5)' : 'none';
            element.style.borderColor = e.type === 'focus' ? 'var(--bs-primary)' : '';
        };

        const formElements = document.querySelectorAll('input, textarea');
        formElements.forEach(element => {
            element.addEventListener('focus', handleFocusBlur);
            element.addEventListener('blur', handleFocusBlur);
        });

        return () => {
            formElements.forEach(element => {
                element.removeEventListener('focus', handleFocusBlur);
                element.removeEventListener('blur', handleFocusBlur);
            });
        };
    }, []);

    // Reset form and Turnstile on successful submission
    useEffect(() => {
        if (state.success) {
            setIsSubmitting(false);
            formRef.current?.reset();
            const windowWithTurnstile = window as WindowWithTurnstile;
            windowWithTurnstile.turnstile?.reset();
            showSuccessMessage();
        }
    }, [state.success]);

    const showSuccessMessage = () => {
        const formSuccess = document.querySelector('.form-success');
        formSuccess?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Check Turnstile validation before form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement;
        if (!turnstileResponse?.value) {
            alert('Please complete the captcha');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData(formRef.current!);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <div className="col-lg-8 offset-lg-1">
            <div className="row">
                <div className="col">
                    {/* Cloudflare Turnstile Captcha */}
                    <Script
                        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                        async
                        defer
                        strategy="afterInteractive"
                    />
                    <h2 className="fs-3 fw-bold terminal-cursor">$ ./schedule_meeting.sh</h2>
                    <p className="mb-4">Tell me about your project and let&apos;s schedule a meeting to discuss how I can help.</p>

                    <div className="row">
                        <div className="col-lg-9">
                            {/* Form errors */}
                            {state.errors?._form && (
                                <div className="alert alert-danger mb-4">
                                    <ul className="mb-0">
                                        {state.errors._form.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {!state.success ? (
                                <form
                                    ref={formRef}
                                    onSubmit={handleSubmit}
                                >
                                    <div className="mb-3">
                                        <label htmlFor="clientName" className="form-label">Your Name</label>
                                        <input
                                            className={`form-control ${state.errors?.clientName ? 'is-invalid' : ''}`}
                                            type="text"
                                            id="clientName"
                                            name="clientName"
                                            required
                                        />
                                        {state.errors?.clientName && (
                                            <div className="invalid-feedback">{state.errors.clientName.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="clientEmail" className="form-label">Your Email</label>
                                        <input
                                            className={`form-control ${state.errors?.clientEmail ? 'is-invalid' : ''}`}
                                            type="email"
                                            id="clientEmail"
                                            name="clientEmail"
                                            required
                                        />
                                        {state.errors?.clientEmail && (
                                            <div className="invalid-feedback">{state.errors.clientEmail.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="projectName" className="form-label">Project Name</label>
                                        <input
                                            className={`form-control ${state.errors?.projectName ? 'is-invalid' : ''}`}
                                            type="text"
                                            id="projectName"
                                            name="projectName"
                                            required
                                        />
                                        {state.errors?.projectName && (
                                            <div className="invalid-feedback">{state.errors.projectName.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="projectBudget" className="form-label">Project Budget</label>
                                        <input
                                            className={`form-control ${state.errors?.projectBudget ? 'is-invalid' : ''}`}
                                            type="text"
                                            id="projectBudget"
                                            name="projectBudget"
                                            placeholder="e.g. $1,000-$5,000"
                                            required
                                        />
                                        {state.errors?.projectBudget && (
                                            <div className="invalid-feedback">{state.errors.projectBudget.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="projectDescription" className="form-label">Project Description</label>
                                        <textarea
                                            className={`form-control ${state.errors?.projectDescription ? 'is-invalid' : ''}`}
                                            id="projectDescription"
                                            name="projectDescription"
                                            required
                                            rows={5}
                                            placeholder="Please describe your project requirements, timeline, and goals..."
                                        ></textarea>
                                        {state.errors?.projectDescription && (
                                            <div className="invalid-feedback">{state.errors.projectDescription.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="scheduleMeetingDate" className="form-label">Preferred Meeting Date</label>
                                        <input
                                            className={`form-control ${state.errors?.scheduleMeetingDate ? 'is-invalid' : ''}`}
                                            type="datetime-local"
                                            id="scheduleMeetingDate"
                                            name="scheduleMeetingDate"
                                            required
                                        />
                                        {state.errors?.scheduleMeetingDate && (
                                            <div className="invalid-feedback">{state.errors.scheduleMeetingDate.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        {/* Cloudflare Turnstile Captcha element */}
                                        <div
                                            className="cf-turnstile"
                                            data-sitekey="0x4AAAAAABMxM4cbQf-x_3Cs"
                                            data-theme="dark"
                                            data-action="hireMe"
                                        />
                                    </div>

                                    <SubmitButton pending={isSubmitting} />
                                </form>
                            ) : (
                                <div className="form-success">
                                    <h4>
                                        <TypingEffect
                                            text="Thank you for scheduling a meeting! I'll get back to you shortly to confirm the details."
                                            typingSpeed={50}
                                            delayBeforeTyping={300}
                                            cursor={true}
                                        />
                                    </h4>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
