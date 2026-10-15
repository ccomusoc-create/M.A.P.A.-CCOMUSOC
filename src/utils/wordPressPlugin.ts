/**
 * Generador y exportador del Plugin dedicado para WordPress (ccomusoc.com.ar)
 */

export function getWordPressPluginPHPCode(): string {
  return `<?php
/**
 * Plugin Name:       CComuSoc - Mapa Interactivo de Comunicación para el Desarrollo
 * Plugin URI:        https://ccomusoc.com.ar/
 * Description:       Incrusta y sincroniza el Mapa Interactivo Territorial de Comunicación para el Desarrollo en ccomusoc.com.ar. Mapeo participativo, testimonios orales comunitarios, geolocalización y sincronización automática.
 * Version:           2.4.0
 * Requires at least: 5.6
 * Requires PHP:      7.4
 * Author:            CComuSoc
 * Author URI:        https://ccomusoc.com.ar/
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       ccomusoc-mapa
 */

if (!defined('ABSPATH')) {
    exit;
}

define('CCOMUSOC_MAPA_VERSION', '2.4.0');
define('CCOMUSOC_MAPA_DIR', plugin_dir_path(__FILE__));
define('CCOMUSOC_MAPA_URL', plugin_dir_url(__FILE__));

class CComuSoc_Mapa_Plugin {

    public function __construct() {
        add_shortcode('ccomusoc_mapa', array($this, 'render_map_shortcode'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function render_map_shortcode($atts) {
        $a = shortcode_atts(array(
            'altura' => '720px',
            'tema'   => 'auto',
            'ancho'  => '100%',
            'url'    => ''
        ), $atts);

        $default_url = get_option('ccomusoc_app_url', 'https://ais-pre-2b4jjrbmiozmzsyjwkpxqd-534004951863.us-east1.run.app');
        $target_url = !empty($a['url']) ? esc_url($a['url']) : esc_url($default_url);

        ob_start();
        ?>
        <div class="ccomusoc-mapa-container" style="width: <?php echo esc_attr($a['ancho']); ?>; max-width: 100%; margin: 1.5rem 0; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(14, 152, 214, 0.15); border: 1px solid #0e98d6;">
            <iframe 
                src="<?php echo $target_url; ?>" 
                width="100%" 
                height="<?php echo esc_attr($a['altura']); ?>" 
                frameborder="0" 
                loading="lazy" 
                allow="geolocation; camera; microphone"
                title="CComuSoc - Mapa Interactivo de Comunicación para el Desarrollo"
                style="display: block; width: 100%; min-height: 550px; border: none;"
            ></iframe>
        </div>
        <?php
        return ob_get_clean();
    }

    public function add_admin_menu() {
        add_menu_page(
            'CComuSoc Mapa',
            'CComuSoc Mapa',
            'manage_options',
            'ccomusoc-mapa',
            array($this, 'render_admin_page'),
            'dashicons-location-alt',
            28
        );
    }

    public function register_settings() {
        register_setting('ccomusoc_mapa_settings', 'ccomusoc_app_url');
        register_setting('ccomusoc_mapa_settings', 'ccomusoc_admin_telegram');
        register_setting('ccomusoc_mapa_settings', 'ccomusoc_admin_whatsapp');
    }

    public function render_admin_page() {
        $current_url = get_option('ccomusoc_app_url', 'https://ais-pre-2b4jjrbmiozmzsyjwkpxqd-534004951863.us-east1.run.app');
        ?>
        <div class="wrap" style="max-width: 900px; font-family: system-ui, sans-serif;">
            <div style="background: #0e98d6; color: #fff; padding: 1.5rem 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h1 style="color: #fff; margin: 0 0 0.5rem 0; font-size: 1.8rem; font-weight: 800;">CComuSoc - Mapa Interactivo Territorial</h1>
                <p style="margin: 0; opacity: 0.95; font-size: 0.95rem;">Comunicación Social para el Desarrollo Comunitario (ccomusoc.com.ar)</p>
            </div>

            <div style="background: #fff; padding: 2rem; border-radius: 12px; border: 1px solid #ccd0d4; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 2rem;">
                <h2 style="margin-top: 0; color: #1d2327;">Configuración de la Aplicación</h2>
                <form method="post" action="options.php">
                    <?php settings_fields('ccomusoc_mapa_settings'); ?>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label for="ccomusoc_app_url">URL de la Aplicación Web</label></th>
                            <td>
                                <input type="url" id="ccomusoc_app_url" name="ccomusoc_app_url" value="<?php echo esc_attr($current_url); ?>" class="regular-text" style="width: 100%; max-width: 500px;" />
                                <p class="description">Dirección URL donde está alojada la app de CComuSoc.</p>
                            </td>
                        </tr>
                    </table>
                    <?php submit_button('Guardar Cambios'); ?>
                </form>
            </div>

            <div style="background: #f0f6fc; border-left: 4px solid #0e98d6; padding: 1.5rem; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #0e98d6;">Cómo mostrar el mapa en tu sitio web:</h3>
                <p>Copia y pega este shortcode en cualquier página, entrada o bloque de WordPress:</p>
                <code style="display: block; padding: 1rem; background: #fff; border: 1px solid #c8d7e1; border-radius: 6px; font-size: 1rem; font-weight: bold; color: #0e98d6;">[ccomusoc_mapa altura="750px"]</code>
                <p style="margin-top: 1rem; margin-bottom: 0; font-size: 0.85rem; color: #50575e;">Soporta parámetros adicionales como: <code>altura="800px"</code> o <code>ancho="100%"</code>.</p>
            </div>
        </div>
        <?php
    }
}

new CComuSoc_Mapa_Plugin();
`;
}

export function downloadWordPressPluginZip(): void {
  const link = document.createElement('a');
  link.href = '/ccomusoc-mapa.zip';
  link.download = 'ccomusoc-mapa.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadWordPressPluginFile(): void {
  const code = getWordPressPluginPHPCode();
  const blob = new Blob([code], { type: 'application/x-php' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'ccomusoc-mapa.php');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
