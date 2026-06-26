import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { HelpersService } from '@/helpers/helpers.service';

@Injectable()
export class ProfileFindOneService {
  private readonly logger = new Logger(ProfileFindOneService.name);

  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Profile)
    private repository: Repository<Profile>,
    // 🗑️ Eliminamos la inyección de ApplicationProfileService porque ya no lo necesitamos
  ) {}

  async execute(id: number): Promise<Profile> {
    try {
      this.logger.debug(`Buscando perfil con ID: ${id}`);

      // 1. Buscamos el perfil solo con las relaciones que de verdad existen y nos importan
      const profile = await this.repository.findOne({
        where: { id },
        relations: {
          profilePages: {
            page: {
              pageFather: true, // ✅ ¡Clave para que tu función getMenu pueda armar el árbol!
            },
          },
        },
      });

      if (!profile) {
        throw new HttpException(`No se encontró el Perfil con el ID ${id}`, 404);
      }

      // 2. Por si alguna otra parte de tu código (o el frontend) espera la propiedad "pages"
      // llena directamente en el objeto profile, hacemos un mapeo plano súper sencillo.
      profile.pages = profile.profilePages ? profile.profilePages.map((pp) => pp.page) : [];

      return profile;
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Consultar Perfil');
    }
  }
}
