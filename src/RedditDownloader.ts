import * as fs from 'fs-extra';
import logdown from 'logdown';
import * as os from 'os';
import * as path from 'path';
import RedditClient, {API as RedditAPI} from 'reddit-wrapper-v2';

export interface Options {
  apiSecret: string;
  appId: string;
  debug?: boolean;
  downloadDir?: string;
}

export class RedditDownloader {
  private readonly apiClient: RedditAPI;
  private readonly logger: logdown.Logger;
  private readonly options: Required<Options>;

  constructor(options: Options) {
    this.options = {debug: false, downloadDir: '.', ...options};
    this.logger = logdown('reddit-downloader', {
      logger: console,
      markdown: false,
    });
    this.logger.state.isEnabled = !!this.options.debug;

    this.options.downloadDir = path.resolve(this.options.downloadDir);

    this.apiClient = RedditClient({
      api_secret: this.options.apiSecret,
      app_id: this.options.appId,
      logs: !!this.options.debug,
      password: '',
      retry_on_server_error: 1,
      retry_on_wait: true,
      username: '',
    }).api;

    this.saveConfig();
  }

  async downloadSubmitted(username: string): Promise<any> {
    const posts = await this.apiClient.get(`/user/${username}/submitted`, {
      sort: 'new',
    });

    return posts;
  }

  private saveConfig(): void {
    const configDir = path.join(os.homedir(), '.reddit-downloader');
    const configFilePath = path.join(configDir, 'config.json');
    fs.ensureDirSync(configDir);
    fs.writeFileSync(configFilePath, JSON.stringify(this.options), 'utf-8');
  }
}
