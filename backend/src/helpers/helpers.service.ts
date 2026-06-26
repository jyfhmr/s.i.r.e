import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, ObjectType, QueryRunner } from 'typeorm';

@Global()
@Injectable()
export class HelpersService {
  constructor(private dataSource: DataSource) {}

  async searchFindOneById<T extends { id: number }>(
    entity: ObjectType<T>,
    idTarget: number,
    nameOfTarget: string,
    queryRunner?: QueryRunner,
    relations: string[] = [],
  ): Promise<T> {
    //uso transacciones para poder hacer una función que busque solo obteniendo el entity

    const isExternalTransaction = queryRunner ? true : false;

    if (!isExternalTransaction) {
      console.log('Iniciando transacción interna para encontrar por id');

      queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();

      await queryRunner.startTransaction();
    }

    try {
      if (isNaN(idTarget)) {
        throw new HttpException(
          'El id otorgado para conseguir el/la ' + nameOfTarget + ' no es válido.',
          400,
        );
      }

      const result = await queryRunner.manager.findOne(entity, {
        where: { id: idTarget } as any, // Type cast necesario por el genérico
        relations: relations, // Cargamos las relaciones solicitadas
      });

      if (!result) {
        throw new HttpException(
          'No se encontró el/la ' + nameOfTarget + ' por lo que no se completó la operación',
          404,
        );
      }

      return result;
    } catch (error) {
      //las operaciones de lectura no necesitan rollback

      console.warn('Ocurrió un error buscando una entidad', error);
      if (error instanceof HttpException) {
        throw error;
      }

      console.warn('Ocurrió un error inesperado buscando una entidad', error);

      throw new HttpException('Error interno durante la consulta', 500, { cause: error });
    } finally {
      if (!isExternalTransaction) {
        await queryRunner.release();
      }
    }
  }

  genericErrorHandler(error: any, serviceName: string): HttpException {
    console.warn(`Ocurrió un error en ${serviceName}`, error);

    if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
      throw new HttpException(
        `Conflicto: El número de documento o identificador ya existe en el sistema.`,
        HttpStatus.CONFLICT, // 409
      );
    }

    if (error instanceof HttpException) {
      throw error;
    }

    console.warn(`Ocurrió un error inesperado ,${serviceName}`, error);

    throw new HttpException(`Error interno durante ${serviceName}`, 500, {
      cause: error,
    });
  }

  /**
   * Envuelve una operación en una transacción.
   * Si se pasa un queryRunner, lo usa. Si no, crea uno nuevo,
   * lo gestiona y hace commit/rollback/release.
   */
  async runInTransaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>,
    externalQueryRunner?: QueryRunner,
  ): Promise<T> {
    // Si viene uno de afuera, lo usamos y no lo cerramos nosotros
    const isExternal = !!externalQueryRunner;
    const queryRunner = externalQueryRunner || this.dataSource.createQueryRunner();

    if (!isExternal) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }

    try {
      // Ejecutamos la lógica de negocio pasando el queryRunner
      const result = await operation(queryRunner);

      // Si la transacción es nuestra, hacemos commit
      if (!isExternal) {
        await queryRunner.commitTransaction();
      }

      return result;
    } catch (error) {
      // Si la transacción es nuestra, hacemos rollback
      if (!isExternal) {
        await queryRunner.rollbackTransaction();
      }

      // Usamos tu propio manejador de errores
      throw this.genericErrorHandler(error, 'TransactionWrapper');
    } finally {
      // Si la transacción es nuestra, liberamos el recurso
      if (!isExternal) {
        await queryRunner.release();
      }
    }
  }
}
