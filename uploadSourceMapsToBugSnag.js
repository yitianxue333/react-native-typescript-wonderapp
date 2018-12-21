const util = require("util");
const exec = util.promisify(require("child_process").exec);

const BUGSNAG_TOKEN = "38c3267508acb58c6e39fab639bfad76";
const VALID_PLATFORMS = {
  ios: true,
  android: true,
};

const upload = async (platform, appVersion) => {
  if (!VALID_PLATFORMS[platform]) {
    console.log(`platform:`, platform);
    console.log(`appVersion:`, appVersion);

    return console.log(`\nFirst argument must be 'ios' or 'android'`);
  }

  if (!appVersion) {
    return console.log(
      `\nSecond argument must be the app version.

ios: "Build Number"
android: "versionCode" `,
    );
  }

  // Valid plaform
  const BUNDLE_PATH = `./${platform}-release.bundle`;
  const SOURCE_MAP_PATH = `./${platform}-release.bundle.map`;
  const MINIFIED_URL =
    platform === "ios" ? `main.jsbundle` : `index.android.bundle`;
  const buildBundle = `yarn generate-${platform}-bundle`;

  // Final command
  const cmd = `${buildBundle} && bugsnag-sourcemaps upload --api-key ${BUGSNAG_TOKEN} --app-version ${appVersion} --minified-file ${BUNDLE_PATH} --source-map ${SOURCE_MAP_PATH} --minified-url ${MINIFIED_URL} --upload-sources`;

  try {
    const uploadSourceMaps = await exec(cmd);

    console.log(`uploadSourceMaps:`, uploadSourceMaps);

    await exec("rm *.bundle");
    await exec("rm *.bundle.map");
    return true;
  } catch (err) {
    console.log(`Error uploading source maps:`, err);

    return false;
  }
};

const ARGS = process.argv.slice(2);

if (ARGS.length === 2) {
  const [platform, appVersion] = ARGS;

  upload(platform, appVersion);
} else {
  console.log(
    `\nPlease run as: node uploadSourceMapsToBugSnag.js [ios/android] [appVersion]`,
  );
}
