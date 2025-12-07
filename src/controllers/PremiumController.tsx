import { Usuario } from '../domain/entities/Usuario';
import UsuarioController from './UsuarioController';

export class PremiumController {
  private usuarioController = new UsuarioController();

  async actualizarPremium(
    userId: string,
    newData: Partial<Usuario>
  ): Promise<void> {
    try {
      this.usuarioController.actualizarUsuario(userId, {
        premium: newData.premium,
      });
    } catch (error) {
      throw error;
    }
  }
}
