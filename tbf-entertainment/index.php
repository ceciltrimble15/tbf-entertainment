<?php
/**
 * Default template — falls through to front-page.php on homepage.
 */
get_header();
?>

<section class="tbf-section">
    <div class="tbf-container" style="text-align: center; min-height: 40vh; display: flex; align-items: center; justify-content: center;">
        <div>
            <?php if ( have_posts() ) : ?>
                <?php while ( have_posts() ) : the_post(); ?>
                    <h1 class="tbf-headline tbf-headline--center"><?php the_title(); ?></h1>
                    <div class="tbf-divider tbf-divider--center"></div>
                    <div class="tbf-body tbf-body--center" style="max-width: 720px;">
                        <?php the_content(); ?>
                    </div>
                <?php endwhile; ?>
            <?php else : ?>
                <h1 class="tbf-headline tbf-headline--center">Page Not Found</h1>
                <div class="tbf-divider tbf-divider--center"></div>
                <p class="tbf-body tbf-body--center">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="tbf-btn tbf-btn--gold" style="margin-top: 24px;">Back to Home</a>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
