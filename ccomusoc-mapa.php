<?php
/**
 * Plugin Name:       CComuSoc - Mapa Interactivo de Comunicación para el Desarrollo
 * Plugin URI:        https://ccomusoc.com.ar/
 * Description:       Incrusta el Mapa Interactivo Territorial en ccomusoc.com.ar con notas de voz y crowdmapping.
 * Version:           2.4.0
 * Author:            CComuSoc
 * Author URI:        https://ccomusoc.com.ar/
 * License:           GPL v3 or later
 */

if (!defined('ABSPATH')) exit;

add_shortcode('ccomusoc_mapa', function($atts) {
    $a = shortcode_atts(array('altura' => '750px'), $atts);
    return '<iframe src="https://ais-pre-2b4jjrbmiozmzsyjwkpxqd-534004951863.us-east1.run.app" width="100%" height="' . esc_attr($a['altura']) . '" frameborder="0" allow="geolocation; camera; microphone" style="border: 2px solid #0e98d6; border-radius: 14px; width: 100%; min-height: 600px;"></iframe>';
});
