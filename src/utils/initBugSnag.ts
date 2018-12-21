import { Client, Configuration } from 'bugsnag-react-native';
import { BUGSNAG_TOKEN } from '@utils';

const bugSnagConfig: Configuration = new Configuration(BUGSNAG_TOKEN);

export const bugsnag: Client = new Client(bugSnagConfig);
