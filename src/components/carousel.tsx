import {
  Children,
  isValidElement,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { View, type ViewStyle } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import {
  Carousel as CarouselComponent,
  Pagination,
  type CarouselLayout,
  type CarouselRef,
  type CarouselRenderItem,
} from "react-native-reanimated-carousel";

import { Colors } from "@/constants/theme";

type CarouselMode =
  | "default"
  | "parallax"
  | "horizontal-stack"
  | "vertical-stack";

type CarouselProps<T = ReactElement> = {
  children?: ReactNode;
  data?: T[];
  renderItem?: CarouselRenderItem<T>;
  width?: number;
  height?: number;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  mode?: CarouselMode;
  showPagination?: boolean;
  style?: ViewStyle;
};

function getLayout(mode: CarouselMode): CarouselLayout | undefined {
  if (mode === "default") return undefined;
  return { type: mode };
}

export function Carousel<T = ReactElement>({
  children,
  data,
  renderItem,
  height = 200,
  loop = true,
  autoPlay = false,
  autoPlayInterval = 6000,
  mode = "default",
  showPagination = true,
  style,
}: CarouselProps<T>) {
  const progress = useSharedValue(0);
  const ref = useRef<CarouselRef>(null);

  const items =
    data ??
    (Children.toArray(children).filter(isValidElement) as unknown as T[]);

  const render: CarouselRenderItem<T> =
    renderItem ?? (({ item }) => item as unknown as ReactElement);

  if (items.length === 0) return null;

  return (
    <View style={style}>
      <CarouselComponent
        ref={ref}
        style={{ width: "100%", height }}
        data={items}
        loop={loop}
        autoplay={autoPlay}
        autoplayInterval={autoPlayInterval}
        layout={getLayout(mode)}
        progress={progress}
        renderItem={render}
      />

      {showPagination && (
        <Pagination
          progress={progress}
          count={items.length}
          onPress={(index) => ref.current?.scrollTo({ index, animated: true })}
          containerStyle={{
            gap: 8,
            marginTop: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: Colors.gray[4],
          }}
          activeDotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: Colors.light.primary,
          }}
        />
      )}
    </View>
  );
}
