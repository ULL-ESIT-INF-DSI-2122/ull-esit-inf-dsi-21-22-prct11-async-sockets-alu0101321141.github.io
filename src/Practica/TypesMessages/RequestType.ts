/**
 * Tipo de mensaje de petición.
 */
export type RequestType = {
  /**
   * Tipo de petición que se le hace al servidor
   */
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  /**
   * Nombre del usuario
   */
  nameUser: string;
  /**
   * Título de la nota.
   */
  title?: string;
  /**
   * Contenido de la nota.
   */
  body?: string;
  /**
   * Color de la nota.
   */
  color?: string;
}
