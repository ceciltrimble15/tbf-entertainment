<?php
/**
 * TBF Entertainment Theme Functions
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'TBF_VERSION', '1.1.1' );
define( 'TBF_DIR', get_template_directory() );
define( 'TBF_URI', get_template_directory_uri() );

function tbf_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );
    add_theme_support( 'custom-logo', array(
        'height'      => 200,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ) );

    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'tbf-entertainment' ),
        'footer'  => __( 'Footer Menu', 'tbf-entertainment' ),
    ) );
}
add_action( 'after_setup_theme', 'tbf_setup' );

function tbf_enqueue_assets() {
    wp_enqueue_style(
        'tbf-fonts',
        'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    wp_enqueue_style(
        'tbf-main',
        TBF_URI . '/assets/css/main.css',
        array( 'tbf-fonts' ),
        TBF_VERSION
    );

    wp_enqueue_script(
        'tbf-main',
        TBF_URI . '/assets/js/main.js',
        array(),
        TBF_VERSION,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'tbf_enqueue_assets' );

function tbf_body_classes( $classes ) {
    $classes[] = 'tbf-theme';
    if ( is_front_page() ) {
        $classes[] = 'tbf-home';
    }
    return $classes;
}
add_filter( 'body_class', 'tbf_body_classes' );

function tbf_image( $filename ) {
    return TBF_URI . '/assets/images/' . $filename;
}
