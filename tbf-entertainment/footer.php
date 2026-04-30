</main>

<footer class="tbf-footer">
    <div class="tbf-container">
        <div class="tbf-footer__grid">

            <div class="tbf-footer__brand">
                <img src="<?php echo esc_url( tbf_image( 'tbf-logo-gold.png' ) ); ?>" alt="TBF Entertainment" class="tbf-footer__logo">
                <p class="tbf-footer__tagline">Built from reality. Nothing added. Everything earned.</p>
                <p class="tbf-footer__desc">A culture-driven entertainment company building powerful stories, visual identity, and creative expansion through publishing, artistry, and media.</p>
                <div class="tbf-footer__social">
                    <a href="#" class="tbf-footer__social-link" aria-label="Instagram">IG</a>
                    <a href="#" class="tbf-footer__social-link" aria-label="X / Twitter">X</a>
                    <a href="#" class="tbf-footer__social-link" aria-label="YouTube">YT</a>
                </div>
            </div>

            <div class="tbf-footer__nav">
                <p class="tbf-eyebrow">Navigate</p>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
                <a href="<?php echo esc_url( home_url( '/young-gs-vs-old-gs/' ) ); ?>">Young Gs vs Old Gs</a>
                <a href="<?php echo esc_url( home_url( '/books/' ) ); ?>">Books</a>
                <a href="<?php echo esc_url( home_url( '/media/' ) ); ?>">Media</a>
                <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a>
            </div>

            <div class="tbf-footer__contact">
                <p class="tbf-eyebrow">Contact</p>
                <a href="mailto:info@tbfentertainment.art">info@tbfentertainment.art</a>
                <p>Publishing Inquiries</p>
                <p>Partnership Inquiries</p>
                <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="tbf-footer__inquiry-link">Submit Inquiry &rarr;</a>
            </div>

        </div>

        <div class="tbf-footer__bottom">
            <p>&copy; <?php echo esc_html( date( 'Y' ) ); ?> TBF Entertainment. All rights reserved.</p>
            <p>tbfentertainment.art</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
