import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { OnboardingPagination } from "@/components/ui/onboarding/onboarding-pagination";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import {
  Carousel,
  type CarouselRef,
} from "react-native-reanimated-carousel";

type BriefingSlide = {
  title: string;
  images: readonly [string, string];
  body: ReactNode;
};

const BRIEFING_SLIDES: BriefingSlide[] = [
  {
    title: "Blivap! With each blood you donate a life is saved.",
    images: [
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80",
    ],
    body: (
      <>
        Due to the massive lack of blood in Nigeria, we as a team{" "}
        <Text style={{ fontFamily: Fonts.inter.bold, fontWeight: "700" }}>
          BLIVAP
        </Text> created this app to solve that
        problem and also help in the problem of poverty by allowing people to
        donate blood and sperm for money.
      </>
    ),
  },
  {
    title: "Donate blood. Get matched. Save lives.",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    ],
    body: (
      <>
        Browse verified donors, request blood when you need it, and book
        appointments at trusted centers. Every donation helps patients across
        Nigeria get the care they need.
      </>
    ),
  },
  {
    title: "Earn while you give back.",
    images: [
      "https://images.unsplash.com/photo-1554224311-beee415c201f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80",
    ],
    body: (
      <>
        Track your donations, manage your wallet, and see welfare reimbursement
        for eligible expenses after a completed donation.
      </>
    ),
  },
];

type ProductBriefingModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

export function ProductBriefingModal({
  visible,
  onDismiss,
}: ProductBriefingModalProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const carouselRef = useRef<CarouselRef>(null);
  const progress = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = Math.min(screenWidth - 40, 360);
  const imageHeight = 112;

  const handleSnap = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleContinue = () => {
    if (activeIndex < BRIEFING_SLIDES.length - 1) {
      carouselRef.current?.scrollTo({ index: activeIndex + 1, animated: true });
      return;
    }

    onDismiss();
  };

  const isLastSlide = activeIndex === BRIEFING_SLIDES.length - 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={isLastSlide ? onDismiss : undefined}
        />

        <View
          style={[styles.card, { width: cardWidth, backgroundColor: theme.card }]}
        >
          <Carousel
            ref={carouselRef}
            style={{ width: cardWidth - 40, height: imageHeight + 180 }}
            data={BRIEFING_SLIDES}
            loop={false}
            progress={progress}
            onSnapToItem={handleSnap}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <ThemedText style={[styles.title, { color: theme.text }]}>
                  {item.title}
                </ThemedText>

                <View style={styles.imageRow}>
                  {item.images.map((uri) => (
                    <Image
                      key={uri}
                      source={{ uri }}
                      style={[styles.image, { height: imageHeight }]}
                      resizeMode="cover"
                    />
                  ))}
                </View>

                <ThemedText style={[styles.body, { color: theme.textSecondary }]}>
                  {item.body}
                </ThemedText>
              </View>
            )}
          />

          <View style={styles.footer}>
            <OnboardingPagination
              count={BRIEFING_SLIDES.length}
              progress={progress}
              primaryColor={theme.primary}
              onPress={(index) =>
                carouselRef.current?.scrollTo({ index, animated: true })
              }
            />

            <Button onPress={handleContinue} style={styles.button}>
              {isLastSlide ? "Get Started" : "Continue"}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  slide: {
    width: "100%",
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 18,
    lineHeight: 26,
    color: "#000000",
    marginBottom: 16,
  },
  imageRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  image: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
  },
  body: {
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    color: "#000000",
  },
  footer: {
    alignItems: "center",
    gap: 20,
    marginTop: 8,
  },
  button: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
  },
});
