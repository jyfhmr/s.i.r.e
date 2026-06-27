import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';
import { caracasCenters } from './data/caracas.data';
import { laGuairaCenters } from './data/la-guaira.data';
import { mirandaCenters } from './data/miranda.data';

export default class MedicalCentersSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const medicalCenterRepository = dataSource.getRepository(MedicalCenter);

    const centers = [
      ...mirandaCenters,
      ...caracasCenters,
      ...laGuairaCenters,
    ];

    await medicalCenterRepository.save(centers);

    console.log('✅ Centros médicos iniciales creados con éxito');
  }
}
