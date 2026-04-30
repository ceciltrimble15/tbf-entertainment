<?php
/**
 * Template Name: Media
 * Media division page — Phase 1
 */
get_header();
?>

<!-- ── PAGE HERO ── -->
<section class="tbf-page-hero">
    <div class="tbf-page-hero__grid"></div>
    <div class="tbf-page-hero__glow"></div>
    <div class="tbf-container">
        <p class="tbf-eyebrow tbf-fade-up">TBF Entertainment &mdash; Media Division</p>
        <h1 class="tbf-page-hero__title tbf-fade-up tbf-delay-1">
            Visual.<br><span class="tbf-text-blue">Story. Screen.</span>
        </h1>
        <div class="tbf-divider tbf-fade-up tbf-delay-2"></div>
        <p class="tbf-page-hero__subtitle tbf-fade-up tbf-delay-3">
            Original visual content, interviews, cinematic storytelling, and culture-based creative expression. The TBF Media division is an active creative lane &mdash; built to complement and amplify everything the brand produces.
        </p>
    </div>
    <div class="tbf-page-hero__fade"></div>
</section>

<!-- ── MEDIA OVERVIEW ── -->
<section class="tbf-section">
    <div class="tbf-container">
        <div class="tbf-split">
            <div class="tbf-reveal">
                <p class="tbf-eyebrow">The Media Lane</p>
                <h2 class="tbf-headline">Visual Storytelling.<br>Cinematic Expression.</h2>
                <div class="tbf-divider"></div>
                <p class="tbf-body">
                    TBF Entertainment&rsquo;s media division covers original visual content, interviews, cinematic storytelling, and culture-based creative expression. Built to complement and expand the publishing and artistry lanes.
                </p>
                <p class="tbf-body tbf-body--dim">
                    This is a lane for visual narratives that carry the same weight, discipline, and authenticity as everything else under the TBF banner.
                </p>
            </div>
            <div class="tbf-reveal tbf-reveal--delay">
                <div class="tbf-feature-list">
                    <div class="tbf-feature-list__item">
                        <span class="tbf-feature-list__num">01</span>
                        <div>
                            <h4 class="tbf-feature-list__title">Original Content</h4>
                            <p class="tbf-feature-list__desc">Video, documentary-style storytelling, and cinematic short-form content.</p>
                        </div>
                    </div>
                    <div class="tbf-feature-list__item">
                        <span class="tbf-feature-list__num">02</span>
                        <div>
                            <h4 class="tbf-feature-list__title">Interviews &amp; Features</h4>
                            <p class="tbf-feature-list__desc">Culture-driven conversations and behind-the-scenes looks at the TBF universe.</p>
                        </div>
                    </div>
                    <div class="tbf-feature-list__item">
                        <span class="tbf-feature-list__num">03</span>
                        <div>
                            <h4 class="tbf-feature-list__title">Book Trailers</h4>
                            <p class="tbf-feature-list__desc">Cinematic promotional content for TBF Publishing releases.</p>
                        </div>
                    </div>
                    <div class="tbf-feature-list__item">
                        <span class="tbf-feature-list__num">04</span>
                        <div>
                            <h4 class="tbf-feature-list__title">Social Content</h4>
                            <p class="tbf-feature-list__desc">Platform-native content for BookTok, Instagram, YouTube, and X.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ── CONTENT GRID ── -->
<section class="tbf-section tbf-section--darker">
    <div class="tbf-container">
        <div class="tbf-section-header tbf-reveal">
            <p class="tbf-eyebrow">Coming Soon</p>
            <h2 class="tbf-headline tbf-headline--center">Media Content</h2>
            <div class="tbf-divider tbf-divider--center"></div>
            <p class="tbf-body tbf-body--center tbf-body--narrow tbf-body--dim">
                Original media content is in development. This space will showcase TBF&rsquo;s media lane as visual projects become public.
            </p>
        </div>

        <div class="tbf-media-grid">
            <?php for ( $i = 1; $i <= 6; $i++ ) : ?>
            <div class="tbf-media-placeholder tbf-reveal">
                <div class="tbf-media-placeholder__inner">
                    <span class="tbf-media-placeholder__icon">&#9655;</span>
                    <span class="tbf-media-placeholder__label">Coming Soon</span>
                </div>
            </div>
            <?php endfor; ?>
        </div>
    </div>
</section>

<!-- ── MEDIA CTA ── -->
<section class="tbf-section">
    <div class="tbf-container" style="max-width: 720px; text-align: center;">
        <div class="tbf-reveal">
            <p class="tbf-eyebrow" style="justify-content: center;">Media Inquiries</p>
            <h2 class="tbf-headline tbf-headline--center">Have a Story to Tell?<br>Let&rsquo;s Build It.</h2>
            <div class="tbf-divider tbf-divider--center"></div>
            <p class="tbf-body tbf-body--center tbf-body--dim">
                TBF Entertainment is selectively developing its media content pipeline. If you have a visual project or media partnership inquiry, reach out.
            </p>
            <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="tbf-btn tbf-btn--gold" style="margin-top: 16px;">Submit Media Inquiry</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
