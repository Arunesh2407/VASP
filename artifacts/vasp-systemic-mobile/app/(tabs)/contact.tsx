import { Feather } from "@expo/vector-icons";
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

const CONTACT_ITEMS = [
  {
    icon: "mail" as const,
    label: "Email",
    value: "VASP@gmail.com",
    action: () => Linking.openURL("mailto:VASP@gmail.com"),
  },
  {
    icon: "phone" as const,
    label: "Phone",
    value: "8446636550",
    action: () => Linking.openURL("tel:8446636550"),
  },
  {
    icon: "map-pin" as const,
    label: "Location",
    value: "7th floor prakash tower, Indore, MP, India",
    action: () => Linking.openURL("https://maps.google.com/?q=7th+floor+prakash+tower+Indore+MP+India"),
  },
  {
    icon: "globe" as const,
    label: "Website",
    value: "vaspsystemic.com",
    action: () => Linking.openURL("https://vaspsystemic.com"),
  },
];

const CAPABILITIES = [
  "Hot Axle Detection",
  "Brake Binding Systems",
  "OBHS Solutions",
  "ACP Automation",
  "Rail IoT Platforms",
  "System Integration",
];

export default function ContactScreen() {
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
        <View style={[styles.pill, { backgroundColor: colors.orange + "22", borderColor: colors.orange + "44" }]}>
          <Text style={[styles.pillText, { color: colors.orange }]}>GET IN TOUCH</Text>
        </View>
        <Text style={[styles.heading, { color: colors.foreground }]}>Let's Build Together</Text>
        <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
          Reach out to discuss your railway technology needs.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: colors.orange }]}
        onPress={() => Linking.openURL("mailto:VASP@gmail.com")}
        activeOpacity={0.85}
      >
        <Feather name="mail" size={18} color="#fff" />
        <Text style={styles.ctaText}>Send Us an Email</Text>
        <Feather name="arrow-right" size={16} color="#fff" />
      </TouchableOpacity>

      <View style={[styles.section, { borderColor: colors.border }]}>
        {CONTACT_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={StyleSheet.flatten([
              styles.contactRow,
              i < CONTACT_ITEMS.length - 1
                ? { borderBottomWidth: 1, borderBottomColor: colors.border }
                : undefined,
            ])}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={[styles.contactIcon, { backgroundColor: colors.electric + "22" }]}>
              <Feather name={item.icon} size={16} color={colors.electric} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              <Text style={[styles.contactValue, { color: colors.foreground }]}>{item.value}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.capabilitiesSection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Core Capabilities</Text>
        <View style={styles.capabilityGrid}>
          {CAPABILITIES.map((cap) => (
            <View
              key={cap}
              style={[styles.capBadge, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.capDot, { backgroundColor: colors.orange }]} />
              <Text style={[styles.capText, { color: colors.foreground }]}>{cap}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.footerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.footerTitle, { color: colors.foreground }]}>VASP Systemic Pvt. Ltd.</Text>
        <Text style={[styles.footerSub, { color: colors.mutedForeground }]}>
          Engineering the next generation of intelligent railway systems.
        </Text>
        <Text style={[styles.footerCopy, { color: colors.mutedForeground }]}>
          © {new Date().getFullYear()} · Indore, India
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    gap: 10,
    marginBottom: 4,
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
  ctaButton: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  section: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    backgroundColor: "transparent",
  },
  contactIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  capabilitiesSection: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  capabilityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  capBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
  },
  capDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  capText: {
    fontSize: 13,
    fontWeight: "500",
  },
  footerCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 6,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  footerSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  footerCopy: {
    fontSize: 12,
    marginTop: 4,
  },
});
