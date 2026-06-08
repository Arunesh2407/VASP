import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const SERVICES = [
  {
    icon: "cpu" as const,
    title: "IoT Solutions",
    tagline: "Connected Edge Intelligence",
    desc: "Purpose-built sensors and gateways for trackside and onboard railway deployment. Real-time telemetry at scale.",
    bg: "#0D1A38",
    accent: "#3B82F6",
  },
  {
    icon: "box" as const,
    title: "Hardware",
    tagline: "Ruggedized for Rail",
    desc: "Industrial-grade hardware engineered for vibration, temperature extremes, and 24/7 railway operations.",
    bg: "#2A1000",
    accent: "#F97316",
  },
  {
    icon: "code" as const,
    title: "Software",
    tagline: "Real-Time Intelligence",
    desc: "Monitoring dashboards, analytics platforms, and control software powering critical operational decisions.",
    bg: "#051A0D",
    accent: "#22C55E",
  },
  {
    icon: "git-merge" as const,
    title: "System Design",
    tagline: "End-to-End Architecture",
    desc: "Full-stack integration and safety-critical system design for complex railway infrastructure projects.",
    bg: "#110826",
    accent: "#A78BFA",
  },
];

function ServiceCard({ item }: { item: (typeof SERVICES)[0] }) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: item.bg, borderColor: colors.border }]}>
      <View style={[styles.iconBadge, { backgroundColor: item.accent + "22", borderColor: item.accent + "44" }]}>
        <Feather name={item.icon} size={22} color={item.accent} />
      </View>
      <Text style={[styles.tagline, { color: item.accent }]}>{item.tagline}</Text>
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.title}</Text>
      <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{item.desc}</Text>
    </View>
  );
}

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: isWeb ? 67 + 16 : insets.top + 16,
          paddingBottom: isWeb ? 34 + 32 : insets.bottom + 32,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.pill, { backgroundColor: colors.electric + "22", borderColor: colors.electric + "44" }]}>
          <Text style={[styles.pillText, { color: colors.electric }]}>WHAT WE BUILD</Text>
        </View>
        <Text style={[styles.heading, { color: colors.foreground }]}>Our Core Services</Text>
        <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
          A vertically-integrated stack tuned for the realities of modern rail.
        </Text>
      </View>

      <View style={styles.grid}>
        {SERVICES.map((item) => (
          <ServiceCard key={item.title} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 0,
  },
  header: {
    marginBottom: 24,
    gap: 10,
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subheading: {
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    gap: 14,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    gap: 8,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 21,
  },
});
