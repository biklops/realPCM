<?php

/*
* Add your own functions here. You can also copy some of the theme functions into this file. 
* Wordpress will use those functions instead of the original functions then.
*/

/* AWESOME! Adds custom classes to everything in Enfold */

if ( isset( $avia_config['use_child_theme_functions_only'] ) ) {
	return;
}
add_theme_support( 'avia_template_builder_custom_css' );

add_action( 'wp_enqueue_scripts', 'pcm_load_scripts', 9999);

function pcm_load_scripts() {
	wp_enqueue_script( 'app', trailingslashit( get_stylesheet_directory_uri() ) . '/js/blobs.js', '', wp_get_theme()->get( 'Version' ), true );

	wp_localize_script( 'app', 'ajax', array(
		'bodyBlobImg'   => trailingslashit( get_stylesheet_directory_uri() ) . "js/img/rainbowgrad.png",
		'footerBlobImg' => trailingslashit( get_stylesheet_directory_uri() ) . "js/img/rainbowgrad-green.png",
		'bodyTag'       => '.body-blobs-wrap',
		'footerTag'     => '.footer_color'
	) );

	wp_deregister_style( 'avia-style' );
	// Then add it again, using your custom version number
	wp_register_style( 'style-css', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
	//finally enqueue it again
	wp_enqueue_style( 'style-css');
}

