// src/database/seeders/pages.seeder.ts
import { Page } from '@/modules/config/pages/entities/page.entity';
import { Profile } from '@/modules/config/profiles/entities/profile.entity';
import { ProfilePages } from '@/modules/config/profiles/entities/profilePages.entity';
import { Injectable } from '@nestjs/common';
import { MAIN_PAGES, PERMISSIONS_BY_ROLE, SUB_PAGES } from '@shared/common/profile-rules';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

@Injectable()
export class PagesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const pageRepository = dataSource.getRepository(Page);
    const profilePagesRepository = dataSource.getRepository(ProfilePages);
    const profileRepository = dataSource.getRepository(Profile);

    // 1. CREAR SUB-PÁGINAS MÉDICAS
    const pagesMedical = await pageRepository.save([
      { name: SUB_PAGES.PATIENTS, route: '/dashboard/medical/patients' },
    ]);

    // 2. CREAR SUB-PÁGINAS DE CONFIGURACIÓN
    const pagesConfiguration = await pageRepository.save([
      { name: SUB_PAGES.MEDICAL_CENTERS, route: '/dashboard/config/medical-centers' },
      { name: SUB_PAGES.ACCESS_REQUESTS, route: '/dashboard/config/access-requests' },
      { name: SUB_PAGES.USERS, route: '/dashboard/config/users' },
      { name: SUB_PAGES.PROFILES, route: '/dashboard/config/profiles' },
      { name: SUB_PAGES.PAGES, route: '/dashboard/config/pages' },
      { name: SUB_PAGES.PATIENTS_IMPORT, route: '/dashboard/config/patients-import' },
    ]);

    // 3. CREAR SUB-PÁGINAS DE CIUDADANO (para usuarios comunes)
    const pagesCitizen = await pageRepository.save([
      { name: SUB_PAGES.MY_ALERTS, route: '/dashboard/citizen/alerts' },
    ]);

    // 4. CREAR PÁGINAS PADRE Y VINCULAR HIJAS
    const pagesFatherSaved = await pageRepository.save([
      {
        name: MAIN_PAGES.MEDICAL,
        route: '/dashboard/medical',
        order: 1,
        icon: 'MedicineBoxOutlined',
        pages: pagesMedical,
      },
      {
        name: MAIN_PAGES.CONFIGURATION,
        route: '/dashboard/config',
        order: 2,
        icon: 'SettingOutlined',
        pages: pagesConfiguration,
      },
      {
        name: 'Ciudadano',
        route: '/dashboard/citizen',
        order: 3,
        icon: 'UserOutlined',
        pages: pagesCitizen,
      },
    ]);

    // 5. ASIGNAR PERMISOS A LOS PERFILES EN BASE DE DATOS
    const profiles = await profileRepository.find();

    for (const profile of profiles) {
      // Obtenemos los permisos de nuestra constante para ESTE perfil específico
      const rolePerms = PERMISSIONS_BY_ROLE[profile.id];
      if (!rolePerms) continue;

      for (const fatherPage of pagesFatherSaved) {
        // Si es DIOS, se le asigna el padre y TODOS sus hijos
        // Si es otro, validamos si sus hijos están en la constante `rolePerms.pages`

        const allowedChildren = rolePerms.isGodMode
          ? fatherPage.pages
          : fatherPage.pages.filter((child) => rolePerms.pages.includes(child.name));

        // Si tiene al menos un hijo permitido (o es DIOS), le asignamos la página padre al menú
        if (allowedChildren && allowedChildren.length > 0) {
          await profilePagesRepository.save({ profile, page: fatherPage });

          // Y luego guardamos los hijos permitidos
          for (const childPage of allowedChildren) {
            await profilePagesRepository.save({ profile, page: childPage });
          }
        }
      }
    }
  }
}
