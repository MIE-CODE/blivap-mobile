import { Button } from "@/components/button";
import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../../services/api-client";
import { Hospital } from "../../../../services/hospitals.service";
import { Donor } from "../../../../types/donor";
import { listFromResponse, pickString } from "../../../utils/api-lists";
import { AppBooking, parseBooking } from "../../../utils/bookings";
import { getErrorMessage } from "../../../../utils/lib";
import { WelfareBreakdown } from "../donate/welfare-breakdown";

type RequestBloodDonationModalProps = {
  visible: boolean;
  donor?: Donor;
  onClose: () => void;
};

type UrgencyLevel = "critical" | "high" | "moderate" | "low";

const URGENCY_OPTIONS: {
  value: UrgencyLevel;
  label: string;
  detail: string;
  dotColor: string;
}[] = [
  { value: "critical", label: "Critical", detail: "Within 2 hours", dotColor: "#EB5757" },
  { value: "high", label: "High", detail: "Within 6 hours", dotColor: "#F2994A" },
  { value: "moderate", label: "Moderate", detail: "Within 12 hours", dotColor: "#F2C94C" },
  { value: "low", label: "Low", detail: "Within 24 hours", dotColor: "#3EB655" },
];

const UNIT_OPTIONS = [
  { label: "1 unit", value: "1" },
  { label: "2 units", value: "2" },
  { label: "3 units", value: "3" },
  { label: "4 units", value: "4" },
  { label: "5 units", value: "5" },
];

const URGENCY_HOURS: Record<UrgencyLevel, number> = {
  critical: 2,
  high: 6,
  moderate: 12,
  low: 24,
};

function hospitalTitle(hospital: Hospital) {
  const name = hospital.name.trim();
  const city = hospital.city?.trim();
  if (!city) return name;
  const suffix = `, ${city}`;
  return name.toLowerCase().endsWith(suffix.toLowerCase())
    ? name.slice(0, -suffix.length)
    : name;
}

function hospitalPlace(hospital: Hospital) {
  const parts = [hospital.city, hospital.state]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
  const seen = new Set<string>();
  return parts
    .filter((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(", ");
}

function parseHospitals(body: unknown): Hospital[] {
  return listFromResponse(body).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const id = pickString(record.id ?? record._id);
    const name = pickString(record.name);
    if (!id || !name) return [];
    return [
      {
        id,
        name,
        city: pickString(record.city) ?? undefined,
        state: pickString(record.state) ?? undefined,
        addressLine: pickString(record.addressLine) ?? undefined,
      },
    ];
  });
}

export const RequestBloodDonationModal = ({
  visible,
  donor,
  onClose,
}: RequestBloodDonationModalProps) => {
  const theme = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const [urgency, setUrgency] = useState<UrgencyLevel>("high");
  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const [urgencyFrame, setUrgencyFrame] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const urgencyAnchor = useRef<View>(null);
  const [units, setUnits] = useState<string | null>(null);
  const [unitsOpen, setUnitsOpen] = useState(false);
  const [unitsFrame, setUnitsFrame] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const unitsAnchor = useRef<View>(null);
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [hospitalQuery, setHospitalQuery] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [funding, setFunding] = useState(false);
  const [fundedBooking, setFundedBooking] = useState<AppBooking | null>(null);
  const hospitalRequest = useRef(0);

  const searchHospitals = useMemo(
    () =>
      debounce((query: string) => {
        const request = ++hospitalRequest.current;
        setSearching(true);
        void $api.hospitals
          .list({ query: query.trim() || undefined, page: 1, limit: 20 })
          .then((res) => {
            if (request !== hospitalRequest.current) return;
            setHospitals(parseHospitals(res));
          })
          .catch((error) => {
            if (request !== hospitalRequest.current) return;
            setHospitals([]);
            Toast.show({
              type: "error",
              text1: getErrorMessage(error, "Could not load hospitals"),
            });
          })
          .finally(() => {
            if (request === hospitalRequest.current) setSearching(false);
          });
      }, 300),
    [],
  );

  useEffect(() => () => searchHospitals.cancel(), [searchHospitals]);

  useEffect(() => {
    if (!visible || !hospitalOpen || hospitalId) {
      searchHospitals.cancel();
      hospitalRequest.current += 1;
      setSearching(false);
      return;
    }
    searchHospitals(hospitalQuery);
  }, [hospitalId, hospitalOpen, hospitalQuery, searchHospitals, visible]);

  const selectedUrgency =
    URGENCY_OPTIONS.find((option) => option.value === urgency) ?? URGENCY_OPTIONS[1];
  const selectedUnits = UNIT_OPTIONS.find((option) => option.value === units);

  const handleSubmit = async () => {
    const donorUserId = donor?.userId || donor?.id;
    if (!donorUserId) {
      Toast.show({ type: "error", text1: "Choose a donor first" });
      return;
    }
    if (!units) {
      Toast.show({ type: "error", text1: "Please select units needed" });
      return;
    }
    if (!hospitalId) {
      Toast.show({ type: "error", text1: "Please select a hospital" });
      return;
    }

    const scheduledAt = new Date(
      Date.now() + URGENCY_HOURS[urgency] * 60 * 60 * 1000,
    ).toISOString();

    try {
      setSubmitting(true);
      const created = await $api.bookings.request({
        donorUserId,
        hospitalId,
        scheduledAt,
      });
      const booking = parseBooking(created);
      if (
        booking?.status === "awaiting_welfare_funding" &&
        booking.welfare
      ) {
        setFundedBooking(booking);
        return;
      }
      Toast.show({ type: "success", text1: "Blood donation request submitted" });
      handleClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not submit the request"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFund = async () => {
    if (!fundedBooking) return;
    try {
      setFunding(true);
      await $api.welfare.fund(fundedBooking.id);
      Toast.show({
        type: "success",
        text1: fundedBooking.welfare?.label ?? "Welfare expenses held",
      });
      handleClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not cover welfare expenses"),
      });
    } finally {
      setFunding(false);
    }
  };

  const handleClose = () => {
    setUrgency("high");
    setUrgencyOpen(false);
    setUnits(null);
    setUnitsOpen(false);
    setHospitalId(null);
    setHospitalQuery("");
    setHospitals([]);
    setHospitalOpen(false);
    setFundedBooking(null);
    onClose();
  };

  const fieldBorder = (open: boolean) => (open ? theme.primary : theme.hairline);

  const openUrgency = () => {
    setUnitsOpen(false);
    setHospitalOpen(false);
    urgencyAnchor.current?.measureInWindow((x, y, width, height) => {
      setUrgencyFrame({ x, y, width, height });
      setUrgencyOpen(true);
    });
  };

  const closeUrgency = () => setUrgencyOpen(false);

  const openUnits = () => {
    setUrgencyOpen(false);
    setHospitalOpen(false);
    unitsAnchor.current?.measureInWindow((x, y, width, height) => {
      setUnitsFrame({ x, y, width, height });
      setUnitsOpen(true);
    });
  };

  const closeUnits = () => setUnitsOpen(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <ScrollView
            style={{ maxHeight: windowHeight * 0.78 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <ThemedText style={styles.title}>Request Blood Donation</ThemedText>
            <ThemedText
              type="xSmall"
              style={{ color: theme.textSecondary, marginTop: 4 }}
            >
              Fill in the details to request blood duration
            </ThemedText>

            <Line
              strokeWidth={1}
              strokeColor={theme.hairline}
              style={{ marginVertical: 16 }}
            />

            {fundedBooking?.welfare ? (
              <>
                <WelfareBreakdown
                  welfare={fundedBooking.welfare}
                  covering={funding}
                  onCover={() => void handleFund()}
                />
                <Button
                  variant="soft"
                  onPress={handleClose}
                  style={{
                    marginTop: 16,
                    borderRadius: 10,
                    backgroundColor: theme.muted,
                  }}
                  textStyle={{ color: theme.text, fontSize: 14 }}
                >
                  Close
                </Button>
              </>
            ) : (
              <>
            <ThemedText style={styles.sectionLabel}>Urgency Level</ThemedText>
            <View ref={urgencyAnchor} collapsable={false}>
              <Pressable
                onPress={openUrgency}
                style={[styles.fieldBox, { borderColor: fieldBorder(urgencyOpen) }]}
              >
                <View style={[styles.dot, { backgroundColor: selectedUrgency.dotColor }]} />
                <ThemedText style={styles.fieldValue} numberOfLines={1}>
                  {selectedUrgency.label}
                  <ThemedText style={{ color: theme.textSecondary }}>
                    {`  ·  ${selectedUrgency.detail}`}
                  </ThemedText>
                </ThemedText>
                <Ionicons
                  name={urgencyOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>

            <ThemedText style={[styles.sectionLabel, styles.fieldGap]}>
              Units Needed
            </ThemedText>
            <View ref={unitsAnchor} collapsable={false}>
              <Pressable
                onPress={openUnits}
                style={[styles.fieldBox, { borderColor: fieldBorder(unitsOpen) }]}
              >
                <ThemedText
                  numberOfLines={1}
                  style={[
                    styles.fieldValue,
                    { color: selectedUnits ? theme.text : theme.textSecondary },
                  ]}
                >
                  {selectedUnits ? selectedUnits.label : "Select units needed"}
                </ThemedText>
                <Ionicons
                  name={unitsOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>

            <ThemedText style={[styles.sectionLabel, styles.fieldGap]}>
              Hospital/Medical Center
            </ThemedText>
            <View style={[styles.fieldBox, { borderColor: fieldBorder(hospitalOpen) }]}>
              <Ionicons name="search" size={16} color={theme.textSecondary} />
              <TextInput
                value={hospitalQuery}
                placeholder="Search hospital or city"
                placeholderTextColor={theme.textSecondary}
                onFocus={() => {
                  setHospitalOpen(true);
                  setUrgencyOpen(false);
                  setUnitsOpen(false);
                }}
                onChangeText={(value) => {
                  setHospitalQuery(value);
                  setHospitalId(null);
                  setHospitalOpen(true);
                }}
                style={[
      styles.input,
      { color: theme.text },
      Platform.OS === "android"
        ? { includeFontPadding: false, textAlignVertical: "center" }
        : null,
    ]}
              />
              {searching ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : hospitalQuery ? (
                <Pressable
                  hitSlop={8}
                  onPress={() => {
                    setHospitalQuery("");
                    setHospitalId(null);
                    setHospitals([]);
                    setHospitalOpen(true);
                  }}
                >
                  <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                </Pressable>
              ) : null}
            </View>
            {hospitalOpen && !hospitalId ? (
              <View style={[styles.menu, { borderColor: theme.hairline, backgroundColor: theme.card }]}>
                {searching && hospitals.length === 0 ? (
                  <ThemedText style={[styles.empty, { color: theme.textSecondary }]}>
                    Searching hospitals...
                  </ThemedText>
                ) : hospitals.length === 0 ? (
                  <ThemedText style={[styles.empty, { color: theme.textSecondary }]}>
                    {hospitalQuery.trim()
                      ? "No hospitals match that search"
                      : "No hospitals found"}
                  </ThemedText>
                ) : (
                  <ScrollView
                    style={styles.hospitalList}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                  >
                    {hospitals.map((hospital, index) => {
                      const place = hospitalPlace(hospital);
                      return (
                        <Pressable
                          key={hospital.id}
                          onPress={() => {
                            setHospitalId(hospital.id);
                            setHospitalQuery(hospitalTitle(hospital));
                            setHospitalOpen(false);
                          }}
                          style={[
                            styles.hospitalRow,
                            index < hospitals.length - 1 && [
                              styles.hospitalDivider,
                              { borderBottomColor: theme.hairline },
                            ],
                          ]}
                        >
                          <View style={[styles.hospitalMark, { backgroundColor: theme.tint }]}>
                            <Ionicons name="business-outline" size={16} color={theme.primary} />
                          </View>
                          <View style={styles.hospitalCopy}>
                            <ThemedText style={styles.hospitalName} numberOfLines={1}>
                              {hospitalTitle(hospital)}
                            </ThemedText>
                            {place ? (
                              <ThemedText
                                numberOfLines={1}
                                style={[styles.hospitalPlace, { color: theme.textSecondary }]}
                              >
                                {place}
                              </ThemedText>
                            ) : null}
                          </View>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            ) : null}

            <View style={styles.actions}>
              <Button
                variant="soft"
                onPress={handleClose}
                style={{ ...styles.actionButton, backgroundColor: theme.muted }}
                textStyle={{ color: theme.text, fontSize: 14 }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => void handleSubmit()}
                loading={submitting}
                style={styles.actionButton}
                textStyle={{ fontSize: 14 }}
              >
                Submit
              </Button>
            </View>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={urgencyOpen}
        transparent
        animationType="fade"
        onRequestClose={closeUrgency}
      >
        <Pressable style={styles.popoverBackdrop} onPress={closeUrgency}>
          <View
            onStartShouldSetResponder={() => true}
            style={[
              styles.popover,
              {
                top: urgencyFrame.y + urgencyFrame.height + 6,
                left: urgencyFrame.x,
                width: urgencyFrame.width,
                backgroundColor: theme.card,
                borderColor: theme.hairline,
              },
            ]}
          >
            {URGENCY_OPTIONS.map((option) => {
              const selected = option.value === urgency;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    setUrgency(option.value);
                    closeUrgency();
                  }}
                  style={[
                    styles.menuRow,
                    selected && { backgroundColor: theme.backgroundSelected },
                  ]}
                >
                  <View style={[styles.dot, { backgroundColor: option.dotColor }]} />
                  <ThemedText style={styles.menuLabel}>{option.label}</ThemedText>
                  <ThemedText style={[styles.menuDetail, { color: theme.textSecondary }]}>
                    {option.detail}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={unitsOpen}
        transparent
        animationType="fade"
        onRequestClose={closeUnits}
      >
        <Pressable style={styles.popoverBackdrop} onPress={closeUnits}>
          <View
            onStartShouldSetResponder={() => true}
            style={[
              styles.popover,
              {
                top: unitsFrame.y + unitsFrame.height + 6,
                left: unitsFrame.x,
                width: unitsFrame.width,
                backgroundColor: theme.card,
                borderColor: theme.hairline,
              },
            ]}
          >
            {UNIT_OPTIONS.map((option) => {
              const selected = option.value === units;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    setUnits(option.value);
                    closeUnits();
                  }}
                  style={[
                    styles.menuRow,
                    selected && { backgroundColor: theme.backgroundSelected },
                  ]}
                >
                  <ThemedText style={styles.menuLabel}>{option.label}</ThemedText>
                  {selected ? (
                    <Ionicons name="checkmark" size={18} color={theme.primary} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 18,
    textAlign: "center",
  },
  sectionLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
    marginBottom: 8,
  },
  fieldGap: {
    marginTop: 16,
  },
  fieldBox: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fieldValue: {
    flex: 1,
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  popoverBackdrop: {
    flex: 1,
  },
  popover: {
    position: "absolute",
    borderWidth: 1,
    borderColor: Colors.gray[5],
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  menu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.gray[5],
    borderRadius: 10,
    overflow: "hidden",
  },
  menuRow: {
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuLabel: {
    flexShrink: 1,
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
  },
  menuDetail: {
    marginLeft: "auto",
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
  hospitalList: {
    maxHeight: 240,
  },
  hospitalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  hospitalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray[5],
  },
  hospitalMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  hospitalCopy: {
    flex: 1,
    gap: 2,
  },
  hospitalName: {
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
  },
  hospitalPlace: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
  empty: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
  },
});
