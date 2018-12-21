import * as React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  PanResponderInstance,
  PanResponderGestureState,
  NativeSyntheticEvent
} from 'react-native';
import { width as WIDTH } from '@assets';

const X_SWIPE_THRESHOLD_COEFF: number = 0.5;
const SWIPE_THRESHOLD: number = WIDTH * X_SWIPE_THRESHOLD_COEFF;
// const SWIPE_DURATION: number = 250; // Animated.timing
const SWIPE_SPEED: number = 12; // Animated.spring
const VELOCITY_THRESHOLD: number = 0.55;
const COMMON_RANGE: number[] = [-WIDTH, 0, WIDTH];

const localStyles = StyleSheet.create({
  commonCard: {
    position: 'absolute'
  },
  container: {
    flex: 1
  }
});

interface Swiper {
  _swipeEnabled: boolean;
  _index: number;
  _opacityOutputRanges: number[][];
  _animGlobalTabX: Animated.Value;
  _bodyPosition: Animated.Value;
  _bodyPanResponder: PanResponderInstance;
}
interface ISwiperProps {
  data: any[];
  renderCard: (data: any) => React.ReactNode;
  onSwipeRight: (data?: any) => void;
  onSwipeLeft: (data?: any) => void;
}

interface ISwiperState {
  index: number;
}

class Swiper extends React.PureComponent<ISwiperProps, ISwiperState> {
  constructor(props: ISwiperProps) {
    super(props);

    this.state = {
      index: 0
    };

    this._opacityOutputRanges = [];
    this._bodyPosition = new Animated.Value(0);

    this._bodyPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (event, gesture) => {
        const { dx, dy, vy } = gesture;
        const { target } = event.nativeEvent;

        if (
          (dx < -2 || dx > 2) && // low dx
          (dy > -5 || dy < 5) && // accounts for +- of gesture direction
          (vy > -VELOCITY_THRESHOLD && vy < VELOCITY_THRESHOLD) // disable when vy is high
        ) {
          return true;
        }

        return false;
      },
      onPanResponderMove: (_, gesture) => {
        const { dx: bodyX } = gesture;
        // const bodyX = this.getXPreventOverflow(gesture.dx, 1500, false);

        // const { x: tabX, y: tabY } = this.getTabXFromBodyPan({ bodyX, bodyY });

        // console.log(`tabX from BODY`, tabX);

        // console.log(`global anim X val is:`, globalAnimX);

        this._bodyPosition.setValue(bodyX);
      },
      onPanResponderRelease: this.handleSettingPosition
    });
  }

  private handleSettingPosition = (
    event: NativeSyntheticEvent<any>,
    gesture: PanResponderGestureState
  ): void => {
    const { dx, vx } = gesture;

    console.log(`handling setting body position on release`);

    if (dx < -SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
      this.forceSwipe('left');
    } else if (dx > SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
      this.forceSwipe('right');
    } else {
      this.resetPosition();
    }
  }

  private onSwipeComplete = (
    direction: string,
    reset: boolean = false
  ): void => {
    const { index } = this.state;
    const { onSwipeRight, onSwipeLeft } = this.props;

    this._bodyPosition.setValue(0);

    if (reset) {
      this.setState({ index: 0 });
    } else {
      const callback = direction === 'left' ? onSwipeLeft : onSwipeRight;
      callback(index);
    }
  }

  private resetPosition = (): void => {
    console.log(`Resetting position.`);
    Animated.spring(this._bodyPosition, {
      toValue: 0,
      useNativeDriver: true
    }).start();
  }

  private forceSwipe = (direction: string, xMultiplier: number = 1): void => {
    const { data } = this.props;
    const { index } = this.state;
    const isRight = direction === 'right';

    if (!data) {
      return;
    }

    // if ((index === data.length - 1 && !isRight) || (index === 0 && isRight)) {
    //   return this.resetPosition();
    // }

    console.log(`Force swiping ${direction}`);

    const x = isRight ? WIDTH * xMultiplier : -WIDTH * xMultiplier;

    console.log(`x`, x);

    Animated.spring(this._bodyPosition, {
      toValue: x,
      speed: SWIPE_SPEED,
      overshootClamping: true,
      useNativeDriver: true
    }).start(() => {
      this.onSwipeComplete(direction);
    });
  }

  private getBodyStyle = (
    i: number
  ): {
    opacity: Animated.AnimatedInterpolation;
    transform: [{ [key: string]: Animated.AnimatedInterpolation }];
  } => {
    const { index } = this.state;

    const isActive = i === index;
    const isNext = i === index + 1;
    const offsetMult = isActive ? 1 : i - index;
    const offset = WIDTH * offsetMult;
    const negOffset = offset > 0 ? offset * -1 : offset;

    const outputRange = isActive || !isNext ? [-offset, 0, offset] : [0, 0, 0];

    const rotateOutputRange = isActive
      ? ['-20deg', '0deg', '20deg']
      : ['0deg', '0deg', '0deg'];

    const translateX = this._bodyPosition.interpolate({
      inputRange: [negOffset, 0, negOffset * -1], // [-WIDTH, 0, WIDTH]
      outputRange
    });

    const rotate = this._bodyPosition.interpolate({
      inputRange: [negOffset, 0, negOffset * -1], // [-WIDTH, 0, WIDTH]
      outputRange: rotateOutputRange
    });

    const scale = this._bodyPosition.interpolate({
      inputRange: COMMON_RANGE,
      outputRange: isNext ? [1, 1, 1] : isActive ? [1, 1, 1] : [0, 0, 0]
    });

    // const opacity = this._bodyPosition.interpolate({
    //   inputRange: COMMON_RANGE,
    //   outputRange: isActive ? [0, 1, 0] : [1, 0, 1]
    // });

    return {
      //   opacity,
      transform: [{ translateX }, { scale }, { rotate }]
      //   zIndex: -i
    };
  }

  private renderCards = (): React.ReactNodeArray => {
    const { index } = this.state;
    const { data, renderCard } = this.props;

    return data
      .map((dataItem, i: number) => {
        const offset = WIDTH * (i - index);

        const activeProps =
          i === index ? this._bodyPanResponder.panHandlers : {};

        return (
          <Animated.View
            key={i}
            {...activeProps}
            style={[this.getBodyStyle(i), localStyles.commonCard]}
          >
            {renderCard(dataItem)}
          </Animated.View>
        );
      })
      .reverse();
  }

  render(): React.ReactNode {
    return <View style={localStyles.container}>{this.renderCards()}</View>;
  }
}

export { Swiper };
