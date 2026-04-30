<?php
/**
 * Template Name: Books
 * Books catalog page — Phase 1
 */
get_header();
?>

<!-- ── PAGE HERO ── -->
<section class="tbf-page-hero">
    <div class="tbf-page-hero__grid"></div>
    <div class="tbf-page-hero__glow"></div>
    <div class="tbf-container">
        <p class="tbf-eyebrow tbf-fade-up">TBF Entertainment &mdash; Publishing Division</p>
        <h1 class="tbf-page-hero__title tbf-fade-up tbf-delay-1">
            The Written<br><span class="tbf-text-blue">Catalog</span>
        </h1>
        <div class="tbf-divider tbf-fade-up tbf-delay-2"></div>
        <p class="tbf-page-hero__subtitle tbf-fade-up tbf-delay-3">
            Street-rooted narratives, original storytelling, and a growing written catalog built for cultural longevity. TBF Publishing is where the work is real and the first release is already in motion.
        </p>
    </div>
    <div class="tbf-page-hero__fade"></div>
</section>

<!-- ── PUBLISHING PILLARS ── -->
<section class="tbf-section">
    <div class="tbf-container">
        <div class="tbf-pillars">
            <div class="tbf-pillar tbf-reveal">
                <div class="tbf-pillar__icon">&marker;</div>
                <h3 class="tbf-pillar__title">Original Stories</h3>
                <p class="tbf-pillar__desc">Every title in the TBF catalog is built on authentic voice, cultural truth, and storytelling with purpose.</p>
            </div>
            <div class="tbf-pillar tbf-reveal tbf-reveal--delay">
                <div class="tbf-pillar__icon">&loz;</div>
                <h3 class="tbf-pillar__title">Long-Term Catalog</h3>
                <p class="tbf-pillar__desc">We are building a library &mdash; not chasing a moment. Each release adds depth and range to the TBF Publishing catalog.</p>
            </div>
            <div class="tbf-pillar tbf-reveal tbf-reveal--delay-2">
                <div class="tbf-pillar__icon">&circledcirc;</div>
                <h3 class="tbf-pillar__title">Culture-First Voice</h3>
                <p class="tbf-pillar__desc">TBF Publishing is rooted in street culture, generational stories, and voices that the mainstream often sidelines.</p>
            </div>
        </div>
    </div>
</section>

<!-- ── FEATURED BOOK: YOUNG GS VS OLD GS ── -->
<section class="tbf-section tbf-section--darker">
    <div class="tbf-container">
        <p class="tbf-eyebrow tbf-reveal">Debut Title &mdash; Now Available</p>

        <div class="tbf-split tbf-split--book" style="margin-top: 24px;">
            <div class="tbf-reveal">
                <div class="tbf-book-card">
                    <div class="tbf-book-card__glow"></div>
                    <img
                        src="<?php echo esc_url( tbf_image( 'young-gs-cover.png' ) ); ?>"
                        alt="Young Gs vs Old Gs: The Takeover — book cover"
                        class="tbf-book-card__img"
                    >
                </div>
                <div class="tbf-status-badge" style="margin-top: 16px;">
                    <span class="tbf-status-badge__dot"></span>
                    <span>Now Available</span>
                </div>
                <div class="tbf-actions" style="margin-top: 12px; flex-direction: column;">
                    <a href="#email-signup" class="tbf-btn tbf-btn--gold" style="width: 100%;">Buy Paperback</a>
                    <a href="#email-signup" class="tbf-btn tbf-btn--outline" style="width: 100%;">Read on Kindle</a>
                </div>
            </div>

            <div class="tbf-reveal tbf-reveal--delay">
                <h2 class="tbf-headline tbf-headline--lg">
                    Young Gs<br>vs. Old Gs
                </h2>
                <p class="tbf-subtitle-gold">The Takeover &mdash; Book One</p>
                <div class="tbf-divider"></div>

                <p class="tbf-body">
                    The debut release from TBF Entertainment Publishing. A story rooted in generational tension, street culture, and authentic voice &mdash; told without compromise and built to last in the catalog.
                </p>
                <p class="tbf-body tbf-body--dim">
                    Young Gs vs. Old Gs: The Takeover sits at the intersection of loyalty, legacy, and the cultural divide between generations raised in the same world but by different rules. This isn&rsquo;t nostalgia &mdash; it&rsquo;s a reckoning.
                </p>

                <blockquote class="tbf-blockquote">
                    <p>&ldquo;The first proof of what TBF Publishing is building &mdash; a catalog with voice, with grit, and with a clear point of view.&rdquo;</p>
                </blockquote>

                <div class="tbf-meta-grid">
                    <div class="tbf-meta-cell">
                        <span class="tbf-meta-cell__label">Author</span>
                        <span class="tbf-meta-cell__value">O.G. Tom Tom</span>
                    </div>
                    <div class="tbf-meta-cell">
                        <span class="tbf-meta-cell__label">Publisher</span>
                        <span class="tbf-meta-cell__value">TBF Entertainment</span>
                    </div>
                    <div class="tbf-meta-cell">
                        <span class="tbf-meta-cell__label">Category</span>
                        <span class="tbf-meta-cell__value">Culture / Fiction</span>
                    </div>
                    <div class="tbf-meta-cell">
                        <span class="tbf-meta-cell__label">Status</span>
                        <span class="tbf-meta-cell__value">Active Release</span>
                    </div>
                </div>

                <a href="<?php echo esc_url( home_url( '/young-gs-vs-old-gs/' ) ); ?>" class="tbf-btn tbf-btn--gold" style="margin-top: 24px;">View Full Book Page &rarr;</a>
            </div>
        </div>
    </div>
</section>

<!-- ── MORE IN THE VAULT ── -->
<section class="tbf-section">
    <div class="tbf-container">
        <div class="tbf-section-header tbf-reveal">
            <p class="tbf-eyebrow">The Catalog Grows</p>
            <h2 class="tbf-headline tbf-headline--center">More Stories<br>In the Vault</h2>
            <div class="tbf-divider tbf-divider--center"></div>
        </div>

        <div class="tbf-vault-grid">
            <div class="tbf-vault-card tbf-reveal">
                <div class="tbf-vault-card__placeholder">?</div>
                <div class="tbf-vault-card__label">Untitled</div>
                <div class="tbf-vault-card__status">Coming Soon</div>
            </div>
            <div class="tbf-vault-card tbf-reveal tbf-reveal--delay">
                <div class="tbf-vault-card__placeholder">?</div>
                <div class="tbf-vault-card__label">Untitled</div>
                <div class="tbf-vault-card__status">Coming Soon</div>
            </div>
            <div class="tbf-vault-card tbf-reveal tbf-reveal--delay-2">
                <div class="tbf-vault-card__placeholder">?</div>
                <div class="tbf-vault-card__label">Untitled</div>
                <div class="tbf-vault-card__status">Coming Soon</div>
            </div>
        </div>

        <div class="tbf-reveal" style="text-align: center; margin-top: 32px;">
            <div class="tbf-info-box">
                <p>Additional titles are in development. The TBF Publishing catalog is being built with intention &mdash; one release at a time.</p>
                <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="tbf-btn tbf-btn--outline" style="margin-top: 16px;">Submit a Publishing Inquiry</a>
            </div>
        </div>
    </div>
</section>

<!-- ── EMAIL SIGNUP ── -->
<section class="tbf-section tbf-section--darker" id="email-signup">
    <div class="tbf-container" style="max-width: 640px; text-align: center;">
        <div class="tbf-reveal">
            <p class="tbf-eyebrow" style="justify-content: center;">Get Chapter One Free</p>
            <h2 class="tbf-headline tbf-headline--center">Join the TBF VIP List</h2>
            <p class="tbf-body tbf-body--center">Get the opening chapter of Young Gs vs Old Gs delivered straight to your inbox.</p>
            <div class="tbf-brevo-wrapper">
                <!-- BREVO FORM EMBED GOES HERE -->
            </div>
            <a href="#email-signup" class="tbf-btn tbf-btn--gold tbf-btn--wide" style="margin-top: 20px;">Join the List</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
