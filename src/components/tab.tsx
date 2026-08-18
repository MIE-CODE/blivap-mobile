import { useTheme } from "@/hooks/use-theme";
import {
  Children,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  useState,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TabProps = PropsWithChildren<{
  title: string;
}>;

export function Tab({ children }: TabProps) {
  return <View style={styles.panel}>{children}</View>;
}

type TabSwitcherProps = {
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
  initialIndex?: number;
};

export default function TabSwitcher({
  children,
  initialIndex = 0,
}: TabSwitcherProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(initialIndex);
  const tabs = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement<TabProps>[];

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { borderColor: theme.primary }]}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;

          return (
            <Pressable
              key={tab.props.title}
              onPress={() => setActiveTab(index)}
              style={[
                styles.tab,
                isActive && { backgroundColor: theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: theme.text },
                  isActive && styles.activeTabText,
                ]}
              >
                {tab.props.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.content}>{tabs[activeTab]}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 24,
  },
  tabBar: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7.5,
    borderRadius: 20,
  },

  tabText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#ffffff",
  },
  content: {
    width: "100%",
  },
  panel: {
    width: "100%",
  },
});
