import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import styles, { DEVICE_WIDTH } from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import SwipeViewSlide from './swipeview-slide';
import Theme from 'src/assets/styles/theme';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';

interface SwipeViewProps {
  children?: any;
  config?: SwipeViewConfig;
  onSkip: TouchableOpacityOnPress;
  onComplete: TouchableOpacityOnPress;
}

interface SwipeViewState {
  currentIndex: number;
}

interface SwipeViewConfig {
  showControls?: boolean;
  allowSkip?: boolean;
}

export default class SwipeView extends React.Component<
  SwipeViewProps,
  SwipeViewState
> {
  static Slide = SwipeViewSlide;

  constructor(props: SwipeViewProps) {
    super(props);
  }

  state: SwipeViewState = {
    currentIndex: 0
  };

  list: ScrollView | null = null;

  numOfSlides = () => React.Children.count(this.props.children);

  goTo = (idx: number) => {
    if (idx >= 0 && idx < this.numOfSlides()) {
      this.list.scrollTo({ x: DEVICE_WIDTH * idx });
      this.setState({ currentIndex: idx });
    }
  }

  renderBody = (body: string) => {
    if (body) {
      return (
        <View>
          <Text style={styles.bodyTxt}>{body}</Text>
        </View>
      );
    }
  }

  renderDots = () => {
    const { currentIndex } = this.state;
    const { children, onSkip, onComplete } = this.props;

    const dots = React.Children.map(children, (child, i) => (
      <View key={i} style={styles.dot}>
        <Icon
          name='circle'
          size={8}
          color={
            currentIndex === i ? Theme.colors.primary : Theme.colors.textColor
          }
        />
      </View>
    ));

    const isLast = currentIndex === this.numOfSlides() - 1;

    return (
      <View>
        <View style={styles.dotsContainer}>{dots}</View>
        <TouchableOpacity onPress={isLast ? onComplete : onSkip}>
          <Text style={styles.skipTxt}>{isLast ? 'GET STARTED' : 'SKIP'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onScroll = (e: any) => {
    const { contentOffset } = e.nativeEvent;
    if (contentOffset.x % DEVICE_WIDTH === 0) {
      this.goTo(contentOffset.x / DEVICE_WIDTH);
    }
  }

  renderFooter = () => {
    const actions = [];
    const { config } = this.props;
    if (!config.showControls) {
      actions.push(<View />);
    }
  }

  render() {
    const { children } = this.props;
    return (
      <View>
        <ScrollView
          onScroll={this.onScroll}
          pagingEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          ref={(list) => {
            this.list = list;
          }}
          horizontal
        >
          {children}
        </ScrollView>
        <View style={styles.footer}>{this.renderDots()}</View>
      </View>
    );
  }
}
