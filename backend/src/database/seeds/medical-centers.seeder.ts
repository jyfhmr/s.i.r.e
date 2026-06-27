import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';

export default class MedicalCentersSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const medicalCenterRepository = dataSource.getRepository(MedicalCenter);

    // 3 centros médicos de Los Teques y Miranda como ejemplo
    const centers = [
      {
        name: 'Hospital Victorino Santaella',
        state: 'Miranda',
        municipality: 'Los Teques',
        address: 'Av. Intercomunal de Los Teques',
      },
      {
        name: 'Centro de Salud Los Teques',
        state: 'Miranda',
        municipality: 'Los Teques',
        address: 'Calle Principal de Los Teques',
      },
      {
        name: 'Hospital de Carrizal',
        state: 'Miranda',
        municipality: 'Carrizal',
        address: 'Carretera Panamericana, Carrizal',
      },
    ];

    await medicalCenterRepository.save(centers);

    console.log('✅ Centros médicos iniciales creados con éxito');
  }
}
