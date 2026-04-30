<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="TBF Entertainment — Publishing, Artistry, Media. Home of Young Gs vs Old Gs by O.G. Tom Tom.">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<nav class="tbf-nav" id="tbf-nav">
    <div class="tbf-nav__inner">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="tbf-nav__logo">
            <img src="<?php echo esc_url( tbf_image( 'tbf-logo-gold.png' ) ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="tbf-nav__logo-img">
        </a>

        <div class="tbf-nav__links" id="tbf-nav-links">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="tbf-nav__link<?php if ( is_front_page() ) echo ' active'; ?>">Home</a>
            <a href="<?php echo esc_url( home_url( '/young-gs-vs-old-gs/' ) ); ?>" class="tbf-nav__link<?php if ( is_page( 'young-gs-vs-old-gs' ) ) echo ' active'; ?>">Young Gs vs Old Gs</a>
            <a href="<?php echo esc_url( home_url( '/books/' ) ); ?>" class="tbf-nav__link<?php if ( is_page( 'books' ) ) echo ' active'; ?>">Books</a>
            <a href="<?php echo esc_url( home_url( '/media/' ) ); ?>" class="tbf-nav__link<?php if ( is_page( 'media' ) ) echo ' active'; ?>">Media</a>
            <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="tbf-nav__link<?php if ( is_page( 'contact' ) ) echo ' active'; ?>">Contact</a>
        </div>

        <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="tbf-btn tbf-btn--outline tbf-nav__cta">Get in Touch</a>

        <button class="tbf-nav__burger" id="tbf-burger" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>

    <div class="tbf-nav__mobile" id="tbf-mobile-menu">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="tbf-nav__link">Home</a>
        <a href="<?php echo esc_url( home_url( '/young-gs-vs-old-gs/' ) ); ?>" class="tbf-nav__link">Young Gs vs Old Gs</a>
        <a href="<?php echo esc_url( home_url( '/books/' ) ); ?>" class="tbf-nav__link">Books</a>
        <a href="<?php echo esc_url( home_url( '/media/' ) ); ?>" class="tbf-nav__link">Media</a>
        <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="tbf-nav__link">Contact</a>
        <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="tbf-btn tbf-btn--outline" style="margin-top: 12px;">Get in Touch</a>
    </div>
</nav>

<main class="tbf-main">
