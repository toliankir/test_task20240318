import { UserEntity } from '../entity/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ArticleEntity } from '../entity/article.entity';

export default class ArticleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query(`
      TRUNCATE "articles" RESTART IDENTITY;
    `);
    const tokenFactory = factoryManager.get(ArticleEntity);
    await tokenFactory.saveMany(10);
  }
}
