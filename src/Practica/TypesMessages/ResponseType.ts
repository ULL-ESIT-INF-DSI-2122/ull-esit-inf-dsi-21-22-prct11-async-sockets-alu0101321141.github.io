import { NotasType } from "./NotasType";

/**
 * Mensaje de respuesta del servidor.
 */
export type ResponseType = {
  /**
   * Tipo de mensaje de respuesta.
   */
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  /**
   * Estado de exito del comando.
   */
  success: boolean;
  /**
   * Color del mensaje de respuesta.
   */
  color: string;
  /**
   * Vector de notas en caso de que el comando las devuelva.
   */
  notes?: NotasType[];
  /**
   * Descripción del error en caso de que el comando falle.
   */
  error?: string;
}
