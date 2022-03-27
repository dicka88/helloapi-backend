import * as mongoose from 'mongoose';
import envConfig from '../config/env';

import Apis from '../app/models/Api';

const project = {
  userId: '623e84583c5fabae22616988',
  collaborators: [],
  projectName: 'Ecommerce',
  projectAvatarUrl: null,
  projectDescription: 'Project Just For Testing',
  prefixPath: 'ecommerce',
  hitTotal: 0,
  apiKey: 'mantabjiwa',
  endpoints: [{
    name: 'users',
    description: 'List of users',
    method: 'GET',
    path: 'users',
    type: 'json',
    schema: {
      name: 'name.firstName',
      email: 'internet.email',
    },
    count: null,
    data: 'Ku',
  }],
};

mongoose.connect(envConfig.MONGODB_URL).then(async () => {
  console.log('Mongodb connected');
  await Apis.create(project);

  process.exit();
});
