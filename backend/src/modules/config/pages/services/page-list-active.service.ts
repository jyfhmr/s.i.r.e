// src/modules/config/pages/services/page-list-active.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../entities/page.entity';
import { HelpersService } from '@/helpers/helpers.service';

@Injectable()
export class PageListActiveService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Page)
    private repository: Repository<Page>,
  ) {}

  async execute() {
    try {
      // Obtenemos TODAS las páginas activas y su relación padre
      const allPages = await this.repository.find({
        where: { isActive: true },
        relations: ['pageFather'], // Vital para saber quién es hijo de quién
        order: { order: 'ASC', id: 'ASC' }, // Ordenamos visualmente
      });

      // Separamos los padres (los que no tienen pageFather)
      const parentPages = allPages.filter((p) => !p.pageFather);

      // Separamos los hijos
      const childPages = allPages.filter((p) => p.pageFather);

      // Armamos el árbol mapeando los hijos dentro de sus padres correspondientes
      const tree = parentPages.map((parent) => {
        // Encontramos los hijos que pertenecen a este padre específico
        const childrenOfThisParent = childPages.filter(
          (child) => child.pageFather.id === parent.id,
        );

        return {
          id: parent.id,
          name: parent.name,
          route: parent.route,
          pages: childrenOfThisParent.map((child) => ({
            id: child.id,
            name: child.name,
            route: child.route,
          })),
        };
      });

      return { data: tree }; // Lo envolvemos en data para mantener compatibilidad
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado Árbol de Páginas');
    }
  }
}
