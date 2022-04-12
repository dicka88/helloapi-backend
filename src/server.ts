import pino from 'pino';

import app from './app';

(async () => {
  const server = await app({
    logger: pino({
      level: 'debug',
    }),
  });

  const port = process.env.PORT || 3000;

  server.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    server.log.info('Server run at port 3000');
  });
})();
