'use client';

import { TypingEffect } from '@repo/ui/components/shared';
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
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
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
                    <h2 className="fs-3 fw-bold terminal-cursor">$ ./submit_project.sh</h2>
                    <p className="mb-4">Tell me about your project and I&apos;ll get back to you as soon as possible.</p>

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
                                        <label htmlFor="name" className="form-label">name</label>
                                        <input
                                            className={`form-control ${state.errors?.name ? 'is-invalid' : ''}`}
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                        />
                                        {state.errors?.name && (
                                            <div className="invalid-feedback">{state.errors.name.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">email</label>
                                        <input
                                            className={`form-control ${state.errors?.email ? 'is-invalid' : ''}`}
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                        />
                                        {state.errors?.email && (
                                            <div className="invalid-feedback">{state.errors.email.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Project Details</label>
                                        <textarea
                                            className={`form-control ${state.errors?.message ? 'is-invalid' : ''}`}
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                        ></textarea>
                                        {state.errors?.message && (
                                            <div className="invalid-feedback">{state.errors.message.join(', ')}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="date" className="form-label">date</label>
                                        <input
                                            className={`form-control ${state.errors?.date ? 'is-invalid' : ''}`}
                                            type="date"
                                            id="date"
                                            name="date"
                                            required
                                        />
                                        {state.errors?.date && (
                                            <div className="invalid-feedback">{state.errors.date.join(', ')}</div>
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
                                            text="Thank you for your submission! I'll get back to you shortly."
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
