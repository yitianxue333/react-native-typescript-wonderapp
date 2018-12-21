import {
  NavigationActions,
  StackActions,
  NavigationParams,
  NavigationRoute,
  NavigationNavigateAction
} from 'react-navigation';

let navigatorRef: any;

function setContainer(container: any) {
  navigatorRef = container;
}

function goBack(routeName?: string) {
  navigatorRef.goBack(routeName);
}

function popToTop() {
  navigatorRef.dispatch(StackActions.popToTop({}));
}

function reset(routeName: string, keyValue?: string | null) {
  navigatorRef.dispatch(
    StackActions.reset({
      key: keyValue,
      index: 0,
      actions: [NavigationActions.navigate({ routeName })]
    })
  );
}

function navigate(
  routeName: string,
  params?: NavigationParams,
  action?: NavigationNavigateAction
) {
  navigatorRef.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      action
    })
  );
}

function navigateDeep(
  actions: Array<{ routeName: string; params?: NavigationParams }>
) {
  navigatorRef.dispatch(
    actions.reduceRight(
      (prevAction, action): any =>
        NavigationActions.navigate({
          routeName: action.routeName,
          params: action.params,
          action: prevAction
        }),
      undefined
    )
  );
}

function getCurrentRoute(): NavigationRoute | null {
  if (!navigatorRef || !navigatorRef.state.nav) {
    return null;
  }

  return navigatorRef.state.nav.routes[navigatorRef.state.nav.index] || null;
}

export default {
  goBack,
  setContainer,
  navigateDeep,
  navigate,
  reset,
  getCurrentRoute,
  popToTop
};
