<?php
$avia_theme_location = 'avia';
$avia_menu_class     = $avia_theme_location . '-menu';
$args                = array(
	'theme_location'  => $avia_theme_location,
	'menu_id'         => 'main-menu',
	'menu_class'      => 'main-menu',
	'container_class' => 'main-menu-wrap',
	'echo'            => false,
	'walker'          => new avia_responsive_mega_menu()
); ?>

<nav class="blobby-menu">
    <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open"/>
    <label class="menu-open-button" for="menu-open">
        <svg width="30px" height="30px" viewBox="0 0 30 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 42 (36781) - http://www.bohemiancoding.com/sketch -->
            <title>Combined Shape</title>
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
                <path d="M15,12.8786797 L5.56066017,3.43933983 L4.5,2.37867966 L2.37867966,4.5 L3.43933983,5.56066017 L12.8786797,15 L3.93324317,23.9454365 L2.872583,25.0060967 L4.99390335,27.127417 L6.05456352,26.0667568 L15,17.1213203 L23.9454365,26.0667568 L25.0060967,27.127417 L27.127417,25.0060967 L26.0667568,23.9454365 L17.1213203,15 L26.5606602,5.56066017 L27.6213203,4.5 L25.5,2.37867966 L24.4393398,3.43933983 L15,12.8786797 Z" id="Combined-Shape" stroke="#FFFFFF" stroke-width="3"></path>
            </g>
        </svg>
    </label>

    <span href="#" class="blob"></span>
    <span href="#" class="blob"></span>
    <span href="#" class="blob"></span>
    <span href="#" class="blob"></span>
    <span href="#" class="blob"></span>

    <?php echo wp_nav_menu( $args ); ?>

    <!-- filters -->
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
            <filter id="shadowed-goo">

                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />

                <feComposite in2="goo" in="SourceGraphic" result="mix" />
            </filter>
            <filter id="goo">
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feComposite in2="goo" in="SourceGraphic" result="mix" />
            </filter>
        </defs>
    </svg>

</nav>

