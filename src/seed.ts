import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

//import { SeederModule } from './seeder/seeder.module';
//import { SeederService } from './seeder/seeder.service';

/*async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(SeederService);
      seeder
        .seed()
        .then(() => {
          Logger.debug('Seeding complete!');
        })
        .catch((error) => {
          Logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();*/
