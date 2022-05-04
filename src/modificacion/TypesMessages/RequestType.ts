/**
 * Tipo de mensaje de petición.
 */
export type RequestType = {
  /**
   * Tipo de petición que se le hace al servidor
   */
  type: 'comand';
  /**
   * Nombre del usuario
   */
  nameComand: string;
  /**
   * Título de la nota.
   */
  options?: string[];
}
