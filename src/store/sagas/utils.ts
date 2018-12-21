import { setAlertModal } from '@actions';
import * as alertTexts from '@texts';

export const getStore = () => require('@store').store;
export const getStoreState = () => getStore().getState();

export const handleAxiosError = (error: any) => {
  if (error.response) {
    const stringedError = JSON.stringify(error);
    console.log(`API error:`, error.response);
    console.log(`API stringed error:`, stringedError);

    const { data, config } = error.response;
    const { dispatch } = getStore();

    // TODO: map the error responses to texts to them dispatch here

    if (
      config.data &&
      config.data.includes('verify') &&
      data.message === 'Not found'
    ) {
      dispatch(
        setAlertModal({
          ...alertTexts.loginAlertTexts
        })
      );
    }

    if (
      data.errors &&
      data.errors.email[0] &&
      data.errors.email[0] === 'has already been taken'
    ) {
      dispatch(
        setAlertModal({
          ...alertTexts.emailInUseAlertTexts
        })
      );
    }

    if (data.message === 'Not a unique record') {
      dispatch(
        setAlertModal({
          ...alertTexts.phoneInUseAlertTexts
        })
      );
    }

    // Alert.alert(
    //   `HTTP ${error.response.status}`,
    //   JSON.stringify(
    //     {
    //       ...data,
    //       url: config.url,
    //       method: config.method
    //     },
    //     null,
    //     2
    //   )
    // );
  } else {
    console.log(`error:`, error);
    console.warn(error);
  }
};
