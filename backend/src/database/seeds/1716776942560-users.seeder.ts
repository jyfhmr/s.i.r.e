import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/config/users/entities/user.entity';
import { Profile } from '@/modules/config/profiles/entities/profile.entity';

export default class UserSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const profileRepository = dataSource.getRepository(Profile);

    const initialPassword = '123456';
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(initialPassword, salt);

    const superAdminProfile = await profileRepository.save({
      name: 'DIOS',
      description: 'Administrador dios del sistema',
    });

    const medicoProfile = await profileRepository.save({
      name: 'MÉDICO',
      description: 'Personal de salud',
    });

    const ciudadanoProfile = await profileRepository.save({
      name: 'USUARIO COMÚN',
      description: 'Ciudadano que vigila cédulas mediante alertas',
    });

    // ===== Un usuario de cada tipo para pruebas (contraseña: 123456) =====

    // 1) DIOS (super administrador)
    await userRepository.insert({
      name: 'José Hernández',
      email: 'jyfhmr@gmail.com',
      password: hashedPassword,
      profile: superAdminProfile,
      fullName: 'Administrador',
      dni: '29555543',
    });

    // 2) MÉDICO (personal de salud)
    await userRepository.insert({
      name: 'Usuario Personal',
      email: 'doctor@sire.com',
      password: hashedPassword,
      profile: medicoProfile,
      fullName: 'Gregory House',
      dni: '11111111',
    });

    // 3) USUARIO COMÚN (ciudadano)
    await userRepository.insert({
      name: 'Ciudadano Prueba',
      email: 'ciudadano@sire.com',
      password: hashedPassword,
      profile: ciudadanoProfile,
      fullName: 'María Pérez',
      dni: '22222222',
    });
  }
}
