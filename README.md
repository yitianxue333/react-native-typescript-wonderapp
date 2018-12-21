# Wonder App

## Mobile Tech Stack
- Node 10.4.1
- React Native 0.56.0
- TypeScript
- Redux
- Cocoapods (iOS)

## Main React Native Dependencies
- React Navigation v2
- Redux persist (Redux connection to Local Storage)
- Redux (App storage)
- Redux Sagas (Async redux middleware)
- Axios (Network Requests)
- React Native Camera
- React Native Calendars (Pretty Calendar Display)
- Gifted Chat (Chat)
- Reactotron (DevTool)


## Getting up and running
- `git clone ...` - Clone the repository
- `yarn` or `npm install` - install the node dependencies
- `gem install cocoapods` - Install cocoapods on your machine
- `cd ios` and run `pod install` - Install the pods needed for the iOS
- `yarn dev` or `npm run dev` - start the iPhone 5s simulator (see package.json)
- Make sure you have TSLint installed and configured in your editor

## Project Structure

```
|-- src
  |-- assets - Images, Audio, Global styles, etc.
  |-- services - Third party integration pieces (Google Maps ex)
  |-- store
    |-- reducers - Redux reducers
    |-- actions
    |-- sagas - Redux sagas split by "feature" or model
  |-- types - TypeScript types that map to backend models and other app structures
  |-- utils - Generic reuseable utilities
  |-- views
    |-- router - React navigation implementation and navigators
    |-- components - Dumb components
      |-- theme - created components specific to this app's theme
    |-- containers - Specific redux-connected components that are needed in a mid-level
    |-- screens - The Top level redux-connected components
```

## Contributing

Please make all contributions based off the `develop` branch. The `develop` branch is where new features or implementations will be built from. After making an appropriate branch and completing your work. Please make a pull request to merge to develop from your branch, adding *Miguel* `mcabs3` as the reviewer.

## Beta Release
We use fastlane for automated releases to hockeyapp where our Android and iOS beta apps are released.

- Ruby (>= 2.3.6)
- bundler (gem install bundler)
- fastlane (gem install fastlane)

## Integrations

FaceBook
- App ID: `2172025979530425`
- App Token: `7bea5ee8e73c5fdba2d7533cc8dbc061`

## Outstanding Issues
- Proposal Swiper styling (Miguel)
- Match popup modal not popping up (Miguel)
- Photo Upload/Video Upload (John)
- Chat API Implementation (John)
- SVG not loading for wonders