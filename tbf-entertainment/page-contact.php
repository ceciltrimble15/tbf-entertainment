<?php
/**
 * Template Name: Contact
 * Contact page with Brevo email capture — Phase 1
 */
get_header();
?>

<!-- ── PAGE HERO ── -->
<section class="tbf-page-hero">
    <div class="tbf-page-hero__grid"></div>
    <div class="tbf-page-hero__glow"></div>
    <div class="tbf-container">
        <p class="tbf-eyebrow tbf-fade-up">TBF Entertainment</p>
        <h1 class="tbf-page-hero__title tbf-fade-up tbf-delay-1">
            Connect<br><span class="tbf-text-blue">With Us</span>
        </h1>
        <div class="tbf-divider tbf-fade-up tbf-delay-2"></div>
        <p class="tbf-page-hero__subtitle tbf-fade-up tbf-delay-3">
            Publishing inquiries, partnership opportunities, media requests, or general questions &mdash; reach out and we&rsquo;ll get back to you.
        </p>
    </div>
    <div class="tbf-page-hero__fade"></div>
</section>

<!-- ── CONTACT CONTENT ── -->
<section class="tbf-section">
    <div class="tbf-container">
        <div class="tbf-split tbf-split--contact">

            <div class="tbf-reveal">
                <p class="tbf-eyebrow">Get in Touch</p>
                <h2 class="tbf-headline">Direct Contact</h2>
                <div class="tbf-divider"></div>

                <div class="tbf-contact-info">
                    <div class="tbf-contact-info__item">
                        <span class="tbf-contact-info__label">Email</span>
                        <a href="mailto:info@tbfentertainment.art" class="tbf-contact-info__value">info@tbfentertainment.art</a>
                    </div>
                    <div class="tbf-contact-info__item">
                        <span class="tbf-contact-info__label">Website</span>
                        <span class="tbf-contact-info__value">tbfentertainment.art</span>
                    </div>
                </div>

                <div class="tbf-contact-topics">
                    <h3 class="tbf-contact-topics__title">Inquiry Types</h3>
                    <div class="tbf-contact-topics__item">
                        <span class="tbf-contact-topics__dot"></span>
                        <div>
                            <strong>General Inquiry</strong>
                            <p>Questions about TBF Entertainment, our work, or our brand.</p>
                        </div>
                    </div>
                    <div class="tbf-contact-topics__item">
                        <span class="tbf-contact-topics__dot"></span>
                        <div>
                            <strong>Publishing</strong>
                            <p>Book orders, author inquiries, wholesale/retail, review copies.</p>
                        </div>
                    </div>
                    <div class="tbf-contact-topics__item">
                        <span class="tbf-contact-topics__dot"></span>
                        <div>
                            <strong>Media</strong>
                            <p>Press, interviews, content partnerships, media coverage.</p>
                        </div>
                    </div>
                    <div class="tbf-contact-topics__item">
                        <span class="tbf-contact-topics__dot"></span>
                        <div>
                            <strong>Partnership</strong>
                            <p>Business partnerships, collaborations, sponsorship.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tbf-reveal tbf-reveal--delay">
                <p class="tbf-eyebrow">Send a Message</p>
                <h2 class="tbf-headline">Submit an Inquiry</h2>
                <div class="tbf-divider"></div>

                <form class="tbf-form" id="tbf-contact-form">
                    <div class="tbf-form__row">
                        <div class="tbf-form__field">
                            <label class="tbf-form__label" for="tbf-name">Name</label>
                            <input type="text" id="tbf-name" name="name" placeholder="Your name" required class="tbf-form__input">
                        </div>
                        <div class="tbf-form__field">
                            <label class="tbf-form__label" for="tbf-email">Email</label>
                            <input type="email" id="tbf-email" name="email" placeholder="Your email" required class="tbf-form__input">
                        </div>
                    </div>
                    <div class="tbf-form__field">
                        <label class="tbf-form__label" for="tbf-type">Inquiry Type</label>
                        <select id="tbf-type" name="type" class="tbf-form__select">
                            <option value="General">General Inquiry</option>
                            <option value="Publishing">Publishing</option>
                            <option value="Artistry">Artistry / Artist Collaboration</option>
                            <option value="Media">Media / Content</option>
                            <option value="Partnership">Business Partnership</option>
                        </select>
                    </div>
                    <div class="tbf-form__field">
                        <label class="tbf-form__label" for="tbf-message">Message</label>
                        <textarea id="tbf-message" name="message" placeholder="Tell us about your inquiry..." required rows="5" class="tbf-form__textarea"></textarea>
                    </div>
                    <button type="submit" class="tbf-btn tbf-btn--gold tbf-btn--wide">Submit Inquiry</button>
                </form>
            </div>

        </div>
    </div>
</section>

<!-- ── EMAIL SIGNUP ── -->
<section class="tbf-section tbf-section--darker" id="email-signup">
    <div class="tbf-container" style="max-width: 640px; text-align: center;">
        <div class="tbf-reveal">
            <p class="tbf-eyebrow" style="justify-content: center;">Stay Connected</p>
            <h2 class="tbf-headline tbf-headline--center">Join the TBF VIP List</h2>
            <p class="tbf-body tbf-body--center">
                Get updates on new releases, exclusive content, and early access to TBF Entertainment projects.
            </p>
            <div class="tbf-brevo-wrapper">
                <!-- BREVO FORM EMBED GOES HERE -->
            </div>
            <a href="#email-signup" class="tbf-btn tbf-btn--gold tbf-btn--wide" style="margin-top: 20px;">Join the List</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
