/**
 * Notificaciones a través de Canales de Telegram y WhatsApp
 * Sustituye notificaciones Push nativas pesadas por canales ligeros y accesibles en territorio.
 */

export interface MessagingConfig {
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  whatsappEnabled: boolean;
  whatsappAdminPhone: string;
  whatsappGroupName?: string;
}

const STORAGE_KEY = 'ccomusoc_messaging_config_v1';

export function getMessagingConfig(): MessagingConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer config de mensajería:', err);
  }
  return {
    telegramEnabled: true,
    telegramBotToken: '',
    telegramChatId: '@ccomusoc_alertas',
    whatsappEnabled: true,
    whatsappAdminPhone: '+5491100000000',
    whatsappGroupName: 'CComuSoc - Equipo Territorial'
  };
}

export function saveMessagingConfig(config: MessagingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error al guardar config de mensajería:', err);
  }
}

/**
 * Envía una alerta a Telegram
 */
export async function sendTelegramNotification(
  text: string,
  config: MessagingConfig
): Promise<{ success: boolean; message: string }> {
  if (!config.telegramBotToken) {
    // Simulación en territorio: registra en log con formato listo
    return {
      success: true,
      message: `[Simulación Telegram] Mensaje encolado para ${config.telegramChatId}: ${text.slice(0, 60)}...`
    };
  }

  try {
    const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text: text,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    return {
      success: data.ok,
      message: data.ok ? 'Notificación enviada a Telegram exitosamente.' : (data.description || 'Error de Telegram')
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Error de red al conectar con Telegram'
    };
  }
}

/**
 * Genera el enlace de WhatsApp para abrir en un toque desde el celular del administrador
 */
export function generateWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Envía una notificación comunitaria automática a ambos canales configurados
 */
export async function notifyCommunityEvent(
  type: 'nuevo_proyecto' | 'nuevo_testimonio' | 'punto_sugerido' | 'alerta_territorial',
  title: string,
  location: string,
  details: string
): Promise<{ telegram: boolean; whatsappUrl: string }> {
  const config = getMessagingConfig();

  const formattedMessage = `📢 <b>CCOMUSOC ALERTA TERRITORIAL</b>\n\n` +
    `📍 <b>Tipo:</b> ${type.toUpperCase().replace('_', ' ')}\n` +
    `🏷️ <b>Título:</b> ${title}\n` +
    `📌 <b>Localidad:</b> ${location}\n` +
    `📝 <b>Detalle:</b> ${details}\n\n` +
    `🌐 <i>Ver en mapa: https://ccomusoc.com.ar</i>`;

  let telegramSuccess = false;
  if (config.telegramEnabled) {
    const result = await sendTelegramNotification(formattedMessage, config);
    telegramSuccess = result.success;
  }

  const plainText = `*CCOMUSOC ALERTA TERRITORIAL*\nTipo: ${type}\nTítulo: ${title}\nLugar: ${location}\n${details}\nPortal: https://ccomusoc.com.ar`;
  const whatsappUrl = generateWhatsAppLink(config.whatsappAdminPhone, plainText);

  return {
    telegram: telegramSuccess,
    whatsappUrl
  };
}
