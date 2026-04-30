<?php
/**
 * Template Name: Home Page
 * Homepage — TBF Entertainment Phase 1
 */
get_header();
?>

<!-- ═══════════════════════════════════════════════════
     1. HERO — Cinematic intro with 3D book mockup
═══════════════════════════════════════════════════ -->
<section class="tbf-hero">
    <div class="tbf-hero__grid-overlay"></div>
    <div class="tbf-hero__glow"></div>

    <div class="tbf-container tbf-hero__content">
        <div class="tbf-hero__split">
            <div class="tbf-hero__copy">
                <p class="tbf-eyebrow tbf-fade-up">TBF Entertainment Presents</p>

                <h1 class="tbf-hero__headline tbf-fade-up tbf-delay-1">
                    The Streets Don&rsquo;t Forget.<br>
                    <span class="tbf-text-gold">They Only Pass It Down.</span>
                </h1>

                <div class="tbf-divider tbf-fade-up tbf-delay-2"></div>

                <p class="tbf-hero__body tbf-fade-up tbf-delay-3">
                    Young Gs came up with nothing.<br>
                    Old Gs built an empire.
                </p>
                <p class="tbf-hero__body tbf-fade-up tbf-delay-3">
                    When respect turns to envy and loyalty turns to betrayal,
                    the city becomes a battlefield.
                </p>

                <p class="tbf-hero__authority tbf-fade-up tbf-delay-4">
                    A TBF Entertainment Novel by O.G. Tom Tom
                </p>

                <div class="tbf-hero__actions tbf-fade-up tbf-delay-5">
                    <a href="#email-signup" class="tbf-btn tbf-btn--gold">Buy Paperback</a>
                    <a href="#email-signup" class="tbf-btn tbf-btn--outline">Read on Kindle</a>
                </div>
            </div>

            <div class="tbf-hero__book tbf-fade-up tbf-delay-2">
                <div class="tbf-hero__book-glow"></div>
                <img
                    src="<?php echo esc_url( tbf_image( 'young-gs-3d-book.png' ) ); ?>"
                    alt="Young Gs vs Old Gs: The Takeover by O.G. Tom Tom — 3D book mockup"
                    class="tbf-hero__book-img"
                >
            </div>
        </div>
    </div>

    <div class="tbf-hero__fade-bottom"></div>
</section>

<!-- ═══════════════════════════════════════════════════
     2. FLAGSHIP RELEASE — Book feature section
═══════════════════════════════════════════════════ -->
<section class="tbf-section tbf-section--darker">
    <div class="tbf-section__grid-overlay"></div>
    <div class="tbf-container">
        <p class="tbf-eyebrow tbf-reveal">Now Live &mdash; Flagship Release</p>

        <div class="tbf-split tbf-split--book">
            <div class="tbf-reveal">
                <div class="tbf-book-feature">
                    <div class="tbf-book-feature__glow"></div>
                    <img
                        src="<?php echo esc_url( tbf_image( 'young-gs-cover.png' ) ); ?>"
                        alt="Young Gs vs Old Gs: The Takeover — front cover"
                        class="tbf-book-feature__img"
                    >
                </div>
                <div class="tbf-status-badge">
                    <span class="tbf-status-badge__dot"></span>
                    <span>Available Now &mdash; Print &amp; eBook</span>
                </div>
            </div>

            <div class="tbf-reveal tbf-reveal--delay">
                <div class="tbf-status-badge tbf-status-badge--inline">
                    <span>Debut Release</span>
                </div>

                <h2 class="tbf-headline tbf-headline--lg">
                    Young Gs<br>vs. Old Gs
                </h2>
                <p class="tbf-subtitle-gold">The Takeover &mdash; Book One</p>
                <div class="tbf-divider"></div>
                <p class="tbf-body">
                    A war in Cincinnati. A young crew with nothing to lose. Four OG legends with forty years behind them. The debut release from TBF Entertainment Publishing.
                </p>

                <div class="tbf-meta-list">
                    <div class="tbf-meta-item">
                        <span class="tbf-meta-item__label">Author</span>
                        <span class="tbf-meta-item__sep"></span>
                        <span class="tbf-meta-item__value">O.G. Tom Tom</span>
                    </div>
                    <div class="tbf-meta-item">
                        <span class="tbf-meta-item__label">Publisher</span>
                        <span class="tbf-meta-item__sep"></span>
                        <span class="tbf-meta-item__value">TBF Entertainment Publishing</span>
                    </div>
                    <div class="tbf-meta-item">
                        <span class="tbf-meta-item__label">Category</span>
                        <span class="tbf-meta-item__sep"></span>
                        <span class="tbf-meta-item__value">Urban Fiction / Street Lit</span>
                    </div>
                    <div class="tbf-meta-item">
                        <span class="tbf-meta-item__label">Status</span>
                        <span class="tbf-meta-item__sep"></span>
                        <span class="tbf-meta-item__value">Active Release</span>
                    </div>
                </div>

                <div class="tbf-actions">
                    <a href="<?php echo esc_url( home_url( '/young-gs-vs-old-gs/' ) ); ?>" class="tbf-btn tbf-btn--gold">Full Details &rarr;</a>
                    <a href="#email-signup" class="tbf-btn tbf-btn--outline">Buy on Amazon</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════
     3. THREE PILLARS
═══════════════════════════════════════════════════ -->
<section class="tbf-section">
    <div class="tbf-container">
        <div class="tbf-section-header tbf-reveal">
            <p class="tbf-eyebrow">The Architecture</p>
            <h2 class="tbf-headline tbf-headline--center">Three Lanes. One Direction.</h2>
            <div class="tbf-divider tbf-divider--center"></div>
        </div>

        <div class="tbf-pillars">
            <div class="tbf-pillar tbf-pillar--active tbf-reveal">
                <div class="tbf-pillar__top-line"></div>
                <div class="tbf-pillar__icon">&marker;</div>
                <span class="tbf-pillar__badge">Current Lead Division</span>
                <h3 class="tbf-pillar__title">Publishing</h3>
                <p class="tbf-pillar__desc">Books, street-rooted narratives, original storytelling, and a growing written catalog.</p>
                <a href="<?php echo esc_url( home_url( '/books/' ) ); ?>" class="tbf-pillar__link">Explore &rarr;</a>
            </div>
            <div class="tbf-pillar tbf-reveal tbf-reveal--delay">
                <div class="tbf-pillar__icon">&sung;</div>
                <h3 class="tbf-pillar__title">Artistry</h3>
                <p class="tbf-pillar__desc">Independent artist collaborations, music-driven storytelling, and culture-centered sound development.</p>
                <span class="tbf-pillar__link tbf-text-muted">Coming Soon</span>
            </div>
            <div class="tbf-pillar tbf-reveal tbf-reveal--delay-2">
                <div class="tbf-pillar__icon">&target;</div>
                <h3 class="tbf-pillar__title">Media</h3>
                <p class="tbf-pillar__desc">Visual storytelling, interviews, creative content, and cinematic media expression.</p>
                <a href="<?php echo esc_url( home_url( '/media/' ) ); ?>" class="tbf-pillar__link">Explore &rarr;</a>
            </div>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════
     4. EMAIL SIGNUP — Brevo capture
═══════════════════════════════════════════════════ -->
<section class="tbf-section tbf-section--darker" id="email-signup">
    <div class="tbf-container tbf-email-block">
        <div class="tbf-section-header tbf-reveal">
            <img src="<?php echo esc_url( tbf_image( 'tbf-logo-gold.png' ) ); ?>" alt="TBF Entertainment" class="tbf-email-block__logo">
            <div class="tbf-divider tbf-divider--gold tbf-divider--center"></div>
            <h2 class="tbf-headline tbf-headline--center">Get Chapter One Free</h2>
            <p class="tbf-body tbf-body--center tbf-body--narrow">
                Join the TBF VIP list and get the opening chapter delivered straight to your inbox.
            </p>
        </div>

        <div class="tbf-brevo-wrapper tbf-reveal">
            <!-- BREVO FORM EMBED GOES HERE -->
        </div>

        <div class="tbf-reveal">
            <a href="#email-signup" class="tbf-btn tbf-btn--gold tbf-btn--wide">Join the List</a>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════
     5. VISION / EXPANSION
═══════════════════════════════════════════════════ -->
<section class="tbf-section">
    <div class="tbf-container">
        <div class="tbf-split">
            <div class="tbf-reveal">
                <div class="tbf-vision-box">
                    <div class="tbf-vision-box__corner tbf-vision-box__corner--tl"></div>
                    <div class="tbf-vision-box__corner tbf-vision-box__corner--br"></div>
                    <div class="tbf-vision-box__watermark">TBF</div>
                    <div class="tbf-vision-box__items">
                        <div class="tbf-vision-box__item">
                            <span class="tbf-vision-box__num">01</span>
                            <span class="tbf-vision-box__sep"></span>
                            <span class="tbf-vision-box__label">Story</span>
                        </div>
                        <div class="tbf-vision-box__item">
                            <span class="tbf-vision-box__num">02</span>
                            <span class="tbf-vision-box__sep"></span>
                            <span class="tbf-vision-box__label">Sound</span>
                        </div>
                        <div class="tbf-vision-box__item">
                            <span class="tbf-vision-box__num">03</span>
                            <span class="tbf-vision-box__sep"></span>
                            <span class="tbf-vision-box__label">Screen</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tbf-reveal tbf-reveal--delay">
                <p class="tbf-eyebrow">Long-Term Vision</p>
                <h2 class="tbf-headline">Built to Scale Across Story, Sound, and Screen</h2>
                <div class="tbf-divider"></div>
                <p class="tbf-body">
                    Publishing is the first public lane, but TBF Entertainment is being structured as a long-term creative company with room for artist collaborations, visual media, future releases, and a broader cultural footprint.
                </p>
                <p class="tbf-body tbf-body--dim">
                    This is not a single-project company. The architecture is built for expansion &mdash; across catalog depth, creative formats, and cultural reach.
                </p>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
