const { createConfig } = require('@banez/npm-tool');
const { createFS } = require('@banez/fs');

const fs = createFS({
  base: process.cwd(),
});

module.exports = createConfig({
  bundle: {
    extend: [
      {
        title: 'Create components',
        task: async () => {
          await fs.copy(['components'], ['dist', 'components']);
        },
      },
    ],
  },
});
