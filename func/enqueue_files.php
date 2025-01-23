<?php 

define('DIST_DEF', 'dist');
define('DIST_URI', get_template_directory_uri() . '/' . DIST_DEF);
define('DIST_PATH', get_template_directory() . '/' . DIST_DEF);
define('JS_DEPENDENCY', array()); 
define('JS_LOAD_IN_FOOTER', true);
define('VITE_SERVER', 'http://127.0.0.1:3000');
define('VITE_ENTRY_POINT', '/main.js');

add_action( 'wp_enqueue_scripts', function() {
  if (defined('IS_VITE_DEVELOPMENT') && IS_VITE_DEVELOPMENT === true) {

    function vite_head_module_hook() {
      echo '<script type="module" crossorigin src="' . VITE_SERVER . VITE_ENTRY_POINT . '"></script>';
    }
        add_action('wp_head', 'vite_head_module_hook', 2);        

  } else {

    $manifest = json_decode( file_get_contents( DIST_PATH . '/manifest.json'), true );
    
    if (is_array($manifest)) {
      $manifest_key = array_keys($manifest);
      if (isset($manifest_key[0])) {
        foreach(@$manifest['assets/src/app.js']['css'] as $css_file) {
          $filepath = DIST_URI . '/' . $css_file;
          $lastModifiedCSS = filemtime( get_template_directory() . '/dist/'.$css_file );
          wp_register_style( 'main', $filepath, false, $lastModifiedCSS );
          wp_enqueue_style( 'main' );
        }
    
        $js_file = @$manifest['assets/src/app.js']['file'];
        if ( ! empty($js_file)) {
          wp_enqueue_script( 'main', DIST_URI . '/' . $js_file, JS_DEPENDENCY, '', JS_LOAD_IN_FOOTER );
        }
      }
    }

  }
});

function enqueue_acf_block_files() {
  if (!is_singular()) {
      return;
  }

  $rows = get_field('flexible_content');
  if ($rows) {
      foreach ($rows as $row) {
          $layout = $row['acf_fc_layout']; // Layout name
          $css_file = get_template_directory_uri() . "/dist/css/{$layout}.css";
          $js_file = get_template_directory_uri() . "/dist/js/{$layout}.js";
          if (file_exists(get_template_directory() . "/dist/css/{$layout}.css")) {
              wp_enqueue_style("block-{$layout}", $css_file, [], null);
          } 
          if (file_exists(get_template_directory() . "/dist/js/{$layout}.js")) {
              wp_enqueue_script("block-{$layout}", $js_file, [], null, ['strategy' => 'defer']);
          } 
      }
  }
}

add_action('wp_enqueue_scripts', 'enqueue_acf_block_files');
