export default {
  client: 'postgresql',
  connection:
    process.env.URL || 'postgresql://user:password@localhost:5432/postgres',
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: 'data/migrations',
    extension: 'mjs',
    loadExtensions: ['.mjs'],
  },
  seeds: {
    directory: 'data/seeds',
    extension: 'mjs',
    loadExtensions: ['.mjs'],
  },
}
