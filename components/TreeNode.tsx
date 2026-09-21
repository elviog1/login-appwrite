import { calculateAge } from "@/lib/date.utils";
import { Person } from "@/lib/personService";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Card, IconButton, Text, useTheme } from "react-native-paper";

interface TreeNodeProps {
  person: Person;
  onEdit?: (person: Person) => void;
  onDelete?: (person: Person) => void;
  onCreate?: (parentPerson: Person) => void;
  isRoot?: boolean;
  readOnly?: boolean;
}

const TreeNode = ({
  person,
  onEdit,
  onDelete,
  onCreate,
  isRoot = false,
  readOnly = false,
}: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const getInitials = (first: string, last: string) => {
    const f = first ? first.trim().charAt(0).toUpperCase() : "";
    const l = last ? last.trim().charAt(0).toUpperCase() : "";
    return `${f}${l}` || "👤";
  };

  const hasChildren = person.children && person.children.length > 0;
  const age = calculateAge(person.birthDate);

  return (
    <View style={styles.nodeContainer}>
      {/* Tarjeta de la persona */}
      <TouchableOpacity onPress={handleToggleExpand} activeOpacity={0.8}>
        <Card
          style={[
            styles.card,
            isRoot && {
              borderColor: theme.colors.primary,
              borderWidth: 1.5,
            },
          ]}
          mode="elevated"
        >
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Avatar.Text
                size={40}
                label={getInitials(person.firstName, person.lastName)}
                style={{
                  backgroundColor: isRoot
                    ? theme.colors.primaryContainer
                    : theme.colors.secondaryContainer,
                  marginRight: 12,
                }}
                color={
                  isRoot
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSecondaryContainer
                }
              />

              <View style={styles.cardInfo}>
                <View style={styles.nameContainer}>
                  <Text variant="titleMedium" style={styles.firstName}>
                    {person.firstName}
                  </Text>
                  <Text
                    variant="titleMedium"
                    style={[styles.lastName, { color: theme.colors.primary }]}
                  >
                    {person.lastName}
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  {isRoot && (
                    <View
                      style={[
                        styles.rootBadge,
                        { backgroundColor: theme.colors.primaryContainer },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rootBadgeText,
                          { color: theme.colors.onPrimaryContainer },
                        ]}
                      >
                        Raíz
                      </Text>
                    </View>
                  )}
                  <Text variant="bodySmall" style={styles.ageText}>
                    📅 {age > 0 ? `${age} años` : "Recién nacido / 0 años"}
                  </Text>
                </View>

                {person.description ? (
                  <Text
                    variant="bodySmall"
                    style={styles.description}
                  >
                    {person.description}
                  </Text>
                ) : null}
              </View>

              <View style={styles.cardActions}>
                {!readOnly && onEdit && (
                  <IconButton
                    icon="pencil-outline"
                    size={20}
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      onEdit(person);
                    }}
                  />
                )}
                <IconButton
                  icon={expanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  style={styles.actionButton}
                  onPress={handleToggleExpand}
                />
              </View>
            </View>

            {/* Badge inferior de descendientes */}
            <View style={styles.cardFooter}>
              {hasChildren ? (
                <View style={styles.childrenBadge}>
                  <IconButton icon="account-group" size={16} style={{ margin: 0, padding: 0 }} />
                  <Text variant="labelSmall" style={styles.childrenCount}>
                    {person.children.length} {person.children.length === 1 ? "hijo" : "hijos"}
                  </Text>
                </View>
              ) : (
                <Text variant="labelSmall" style={styles.noChildrenText}>
                  Sin descendientes
                </Text>
              )}

              {!readOnly && onCreate && (
                <TouchableOpacity
                  style={styles.quickAddChild}
                  onPress={(e) => {
                    e.stopPropagation();
                    onCreate(person);
                  }}
                >
                  <IconButton
                    icon="account-plus-outline"
                    size={16}
                    style={{ margin: 0, padding: 0 }}
                    iconColor={theme.colors.primary}
                  />
                  <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: "600" }}>
                    Agregar hijo
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>

      {/* Hijos expandidos */}
      {expanded && (
        <View style={styles.childrenContainer}>
          <View
            style={[
              styles.childrenLine,
              { backgroundColor: theme.colors.outlineVariant || "#ccc" },
            ]}
          />
          {person.children.map((child) => (
            <TreeNode
              key={child.$id}
              person={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreate={onCreate}
              readOnly={readOnly}
            />
          ))}

          {/* Botón para agregar nuevo hijo */}
          {!readOnly && onCreate && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onCreate(person)}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.addCard,
                  { borderColor: theme.colors.primary, backgroundColor: theme.colors.elevation.level1 },
                ]}
              >
                <Card.Content style={styles.addCardContent}>
                  <IconButton icon="plus-circle-outline" iconColor={theme.colors.primary} size={24} />
                  <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: "600" }}>
                    Agregar hijo a {person.firstName}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default React.memo(TreeNode);

const styles = StyleSheet.create({
  nodeContainer: {
    marginVertical: 6,
  },
  card: {
    width: 280,
    borderRadius: 16,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameContainer: {
    marginBottom: 4,
  },
  firstName: {
    fontWeight: "800",
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  lastName: {
    fontWeight: "600",
    letterSpacing: 0.3,
    lineHeight: 20,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 8,
  },
  rootBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    alignSelf: "center",
  },
  rootBadgeText: {
    fontSize: 10.5,
    fontWeight: "700",
  },
  ageText: {
    opacity: 0.75,
  },
  description: {
    opacity: 0.7,
    marginTop: 4,
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150, 150, 150, 0.2)",
  },
  childrenBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  childrenCount: {
    fontWeight: "600",
    opacity: 0.8,
  },
  noChildrenText: {
    opacity: 0.5,
    fontStyle: "italic",
  },
  quickAddChild: {
    flexDirection: "row",
    alignItems: "center",
  },
  childrenContainer: {
    marginLeft: 32,
    marginTop: 8,
    paddingLeft: 12,
    position: "relative",
  },
  childrenLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 1,
  },
  addButton: {
    marginTop: 6,
  },
  addCard: {
    width: 280,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderRadius: 12,
  },
  addCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});

