import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const METRICS = [
  { value: "10+", label: "Years in Market", sub: "ACP Focus" },
  { value: "50+", label: "Railway Projects", sub: "Hot Axle" },
  { value: "100+", label: "Solutions", sub: "Brake & OBHS" },
];

const HIGHLIGHTS = [
  { icon: "cpu" as const, text: "IoT Solutions" },
  { icon: "box" as const, text: "Hardware" },
  { icon: "code" as const, text: "Software" },
  { icon: "git-merge" as const, text: "System Design" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: isWeb ? 67 : insets.top + 20, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO */}
      <View style={[styles.hero, { backgroundColor: "#0D1E4A" }]}>
        <View style={styles.heroPill}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.electric, opacity: 0.75 }} />
          <Text style={{ fontSize: 11, color: colors.mutedForeground }}>
            IoT · Hardware · Software · Systems
          </Text>
        </View>
        <Text style={[styles.heroTitle, { color: colors.foreground }]}>
          Driving Innovation for{"\n"}
          <Text style={{ color: colors.orange }}>Railway Systems</Text>
        </Text>
        <Text style={{ fontSize: 15, lineHeight: 22, color: colors.mutedForeground }}>
          We engineer IoT platforms, ruggedized hardware, and intelligent software for modern rail.
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.orange }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Linking.openURL("mailto:VASP@gmail.com");
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Let's Connect</Text>
            <Feather name="arrow-right" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ghostBtn, { borderColor: colors.border }]}
            onPress={() => Haptics.selectionAsync()}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: colors.foreground }}>Know More</Text>
            <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* METRICS */}
      <View style={[styles.metricsRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {METRICS.map((m, i) => (
          <View
            key={m.label}
            style={StyleSheet.flatten([
              styles.metricItem,
              i < METRICS.length - 1
                ? { borderRightWidth: 1, borderRightColor: colors.border }
                : undefined,
            ])}
          >
            <Text style={[styles.metricValue, { color: colors.orange }]}>{m.value}</Text>
            <Text style={{ fontSize: 11, fontWeight: "600", textAlign: "center", color: colors.foreground }}>{m.label}</Text>
            <Text style={{ fontSize: 10, color: colors.mutedForeground, textTransform: "uppercase" }}>{m.sub}</Text>
          </View>
        ))}
      </View>

      {/* HIGHLIGHTS */}
      <View>
        <Text style={{ fontSize: 11, fontWeight: "600", letterSpacing: 1.2, textTransform: "uppercase", color: colors.electric, marginBottom: 8, marginTop: 4 }}>WHAT WE DO</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {HIGHLIGHTS.map((h) => (
            <View
              key={h.text}
              style={[styles.highlightChip, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={{ width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.electric + "22" }}>
                <Feather name={h.icon} size={15} color={colors.electric} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.foreground }}>{h.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ABOUT CARD */}
      <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={[styles.trainBadge, { backgroundColor: colors.orange + "22", borderColor: colors.orange + "44" }]}>
            <Feather name="activity" size={18} color={colors.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>VASP Systemic Pvt. Ltd.</Text>
            <Text style={{ fontSize: 12, color: colors.mutedForeground }}>Indore, India</Text>
          </View>
        </View>
        <Text style={{ fontSize: 14, lineHeight: 21, color: colors.mutedForeground }}>
          Engineering the next generation of intelligent railway systems — 10+ years of ACP focus, Hot Axle detection, and safety-critical innovation.
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
          {["ACP Focus", "Hot Axle", "Brake Binding", "OBHS"].map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, paddingHorizontal: 16 },
  hero: { borderRadius: 24, padding: 24, paddingBottom: 28, gap: 14 },
  heroPill: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroTitle: { fontSize: 30, fontWeight: "700", lineHeight: 36 },
  heroButtons: { flexDirection: "row", gap: 10, marginTop: 4, flexWrap: "wrap" },
  primaryBtn: { borderRadius: 100, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  primaryBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  ghostBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 100, borderWidth: 1, backgroundColor: "rgba(255,255,255,0.05)" },
  metricsRow: { flexDirection: "row", borderWidth: 1, borderRadius: 20, overflow: "hidden" },
  metricItem: { flex: 1, paddingVertical: 16, alignItems: "center", gap: 3 },
  metricValue: { fontSize: 24, fontWeight: "700" },
  highlightChip: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  aboutCard: { borderWidth: 1, borderRadius: 20, padding: 20, gap: 12 },
  trainBadge: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, borderWidth: 1 },
});
