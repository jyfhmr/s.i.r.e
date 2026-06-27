import { ProfileFindOneService } from '@/modules/config/profiles/services/profile-find-one.service';
import { UserFindByUsernameService } from '@/modules/config/users/services/user-find-by-username.service';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userFindByUsernameService: UserFindByUsernameService,
    private profileFindOneService: ProfileFindOneService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{
    access_token: string;
    name: string;
    username: string;
    profileId: number;
    profileName: string;
    userId: number;
  }> {
    console.log('Iniciando sesión...', username, pass);

    if (!username || !pass) throw new HttpException('El usuario o contraseña son inválidos', 400);

    const user = await this.userFindByUsernameService.execute(username);

    if (!user) {
      throw new UnauthorizedException('Usuario invalido');
    }

    const perfil = await this.profileFindOneService.execute(user.profile.id);

    if (!perfil || !perfil.pages) {
      throw new Error('Profile or profile pages not found');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Clave inválida');
    }

    const payload = {
      sub: user.id,
      username: user.email,
      name: user.name,
      profileId: user.profile.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      name: user.name,
      username: user.email,
      profileId: user.profile.id,
      profileName: perfil.name,
      userId: user.id,
    };
  }

  async getMenu(idProfile: number): Promise<{ menu: any[] }> {
    const perfil = await this.profileFindOneService.execute(idProfile);

    if (!perfil || !perfil.profilePages) {
      throw new Error('Perfil o páginas del perfil no encontrados');
    }

    // Extraemos las páginas planas desde la tabla pivote
    const allowedPages = perfil.profilePages.map((pp) => pp.page).filter((page) => page.isActive);

    // 1. Separar Padres e Hijos
    const parentPages = allowedPages.filter((p) => !p.pageFather);
    const childPages = allowedPages.filter((p) => p.pageFather);

    // 2. Construir el árbol
    const menu = parentPages.map((parent) => {
      // Buscamos los hijos que le pertenecen a este padre
      const children = childPages
        .filter((child) => child.pageFather.id === parent.id)
        .sort((a, b) => a.order - b.order)
        .map((child) => ({
          key: `pag-id-${child.id}`,
          label: child.name,
          route: child.route,
          order: child.order,
        }));

      return {
        key: `mod-id-${parent.id}`,
        label: parent.name,
        icon: parent.icon ? `<${parent.icon} />` : null,
        order: parent.order,
        children: children.length > 0 ? children : undefined,
        route: children.length === 0 ? parent.route : undefined, // Si no tiene hijos, es ruteable directo
      };
    });

    // 3. Ordenar el nivel principal
    menu.sort((a, b) => a.order - b.order);

    return { menu };
  }
}
