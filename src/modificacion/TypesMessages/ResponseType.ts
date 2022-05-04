
/**
 * Mensaje de respuesta del servidor.
 */
export type ResponseType = {
  /**
   * Tipo de mensaje de respuesta.
   */
  type: 'response';
  /**
   * Estado de exito del comando.
   */
  success: boolean;
  /**
   * Mensaje de datos obatenidos.
    */
  data?: string;
  /**
   * Mensaje de error.
    */
  error?: string;
}
