import { setSeederFactory } from 'typeorm-extension';
import { ArticleEntity } from '../entity/article.entity';
import { DeepPartial } from 'typeorm';

export default setSeederFactory(ArticleEntity, (faker) => {
  const article: DeepPartial<ArticleEntity> = {
    title: faker.lorem.sentence(5),
    text: faker.lorem.sentences(3),
    userId: 2,
  };

  return article;
});
