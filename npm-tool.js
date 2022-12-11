const { createConfig } = require('@banez/npm-tool');
const { createFS } = require('@banez/fs');

const fs = createFS({
  base: process.cwd(),
});

module.exports = createConfig({
  bundle: {
    extend: [
      {
        title: 'Copy components',
        task: async () => {
          await fs.copy('components', ['dist', '_components']);
        },
      },
    ],
  },
});
