#!/usr/bin/env node

import program from 'commander';
import {RedditDownloader} from './RedditDownloader';

const {description, name, version} = require('../package.json');

program
  .name(name)
  .description(description)
  .option('-d, --debug', 'Enable debug logging')
  .option('-o, --output <path>', 'Set download dir')
  .option('-s, --api-secret <secret>', 'Set API secret')
  .option('-i, --app-id <id>', 'Set app ID')
  .version(version, '-v, --version');

program
  .command('user')
  .arguments('<username>')
  .action(async (username, {parent}) => {
    const redditDownloader = new RedditDownloader({
      apiSecret: parent.apiSecret,
      appId: parent.appId,
      ...(parent.debug && {debug: true}),
      ...(parent.output && {downloadDir: parent.output}),
    });

    try {
      const posts = await redditDownloader.downloadSubmitted(username);
      console.log('posts', posts);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
