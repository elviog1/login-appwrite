import TreeNode from "@/components/TreeNode";
import { useAuth } from "@/contexts/auth-context";
import { getAllOtherTrees, PublicTree } from "@/lib/personService";
import { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";

export default function ExploreScreen() {
  const theme = useTheme();
  const { user } = useAuth();

  const [trees, setTrees] = useState<PublicTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTree, setSelectedTree] = useState<PublicTree | null>(null);

  const loadTrees = async () => {
    try {
      setLoading(true);
      const data = await getAllOtherTrees(user ? user.$id : undefined);
      setTrees(data);
    } catch (err) {
      console.error("Error loading public trees:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrees();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTrees();
  };

  const filteredTrees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return trees;
    const cleanQ = q.startsWith("@") ? q.slice(1) : q;

    return trees.filter((tree) => {
      if (tree.userId.toLowerCase().includes(cleanQ)) return true;
      if (tree.rootName.toLowerCase().includes(q)) return true;
      return tree.allPersons.some(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    });
  }, [trees, searchQuery]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Buscando árboles familiares...</Text>
      </View>
    );
  }

  if (selectedTree) {
    const rootFirstName = selectedTree.rootName.split(" ")[0] || "";
    const rootLastName = selectedTree.rootName.split(" ").slice(1).join(" ") || "";

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View
          style={[
            styles.treeViewHeader,
            { backgroundColor: theme.colors.elevation.level2 },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedTree(null)}
          >
            <IconButton icon="arrow-left" size={24} />
            <View>
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.primary, fontWeight: "700" }}
              >
                @{selectedTree.userId}
              </Text>
              <View style={styles.nameWrapper}>
                <Text variant="titleMedium" style={styles.firstName}>
                  {rootFirstName}
                </Text>
                <Text
                  variant="titleMedium"
                  style={[styles.lastName, { color: theme.colors.primary }]}
                >
                  {" "}{rootLastName}
                </Text>
              </View>
              <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                {selectedTree.totalMembers} {selectedTree.totalMembers === 1 ? "integrante" : "integrantes"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
          <ScrollView contentContainerStyle={styles.treeScrollContent}>
            {selectedTree.roots.map((root) => (
              <TreeNode
                key={root.$id}
                person={root}
                isRoot
                readOnly
              />
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar por usuarios o personas"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          elevation={1}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {filteredTrees.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Avatar.Icon
              size={64}
              icon="account-search-outline"
              style={{ backgroundColor: theme.colors.primaryContainer, marginBottom: 16 }}
              color={theme.colors.primary}
            />
            <Text variant="titleMedium" style={{ fontWeight: "700", textAlign: "center" }}>
              {searchQuery ? "No se encontraron coincidencias" : "No hay otros árboles disponibles aún"}
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.7, textAlign: "center", marginTop: 8 }}>
              {searchQuery
                ? "Intenta buscando por otro nombre o apellido."
                : "Cuando otros usuarios creen sus árboles, podrás explorarlos aquí."}
            </Text>
          </View>
        ) : (
          filteredTrees.map((tree) => {
            const rootFirstName = tree.rootName.split(" ")[0] || "";
            const rootLastName = tree.rootName.split(" ").slice(1).join(" ") || "";
            const previewNames = tree.allPersons
              .map((p) => `${p.firstName} ${p.lastName}`)
              .join(", ");

            return (
              <Card
                key={tree.userId}
                style={styles.treeCard}
                mode="elevated"
                onPress={() => setSelectedTree(tree)}
              >
                <Card.Content>
                  <View style={styles.cardTopRow}>
                    <Avatar.Icon
                      size={44}
                      icon="tree"
                      style={{ backgroundColor: theme.colors.primaryContainer }}
                      color={theme.colors.primary}
                    />
                    <View style={styles.cardHeaderInfo}>
                      <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.primary, fontWeight: "700", marginBottom: 2 }}
                        numberOfLines={1}
                      >
                        @{tree.userId}
                      </Text>
                      <View style={styles.nameWrapper}>
                        <Text variant="titleMedium" style={styles.firstName}>
                          {rootFirstName}
                        </Text>
                        <Text
                          variant="titleMedium"
                          style={[styles.lastName, { color: theme.colors.primary }]}
                        >
                          {" "}{rootLastName}
                        </Text>
                      </View>
                      <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 2 }}>
                        Raíz del árbol
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.membersBadge,
                        { backgroundColor: theme.colors.secondaryContainer },
                      ]}
                    >
                      <Text
                        style={[
                          styles.membersBadgeText,
                          { color: theme.colors.onSecondaryContainer },
                        ]}
                      >
                        {tree.totalMembers} {tree.totalMembers === 1 ? "persona" : "personas"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.previewContainer}>
                    <Text variant="bodySmall" style={{ opacity: 0.75 }}>
                      👥 Integrantes: {previewNames}
                    </Text>
                  </View>
                </Card.Content>

                <Card.Actions style={styles.cardActions}>
                  <Button
                    mode="text"
                    icon="compass"
                    onPress={() => setSelectedTree(tree)}
                  >
                    Explorar árbol
                  </Button>
                </Card.Actions>
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchbar: {
    borderRadius: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  treeCard: {
    marginBottom: 14,
    borderRadius: 18,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    flexShrink: 1,
  },
  firstName: {
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  lastName: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  membersBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  membersBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  previewContainer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150, 150, 150, 0.2)",
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  treeViewHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  treeScrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
});