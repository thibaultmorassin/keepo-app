import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "@legendapp/state/react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/contexts/session";
import { addTodo, todos$ as _todos$, toggleDone } from "@/utils/SupaLegend";
import { Tables } from "@/utils/database.types";
import { color, space } from "@/theme/tokens";
import { type } from "@/theme/typography";

const NOT_DONE_ICON = String.fromCodePoint(0x1f7e0);
const DONE_ICON = String.fromCodePoint(0x2705);

function NewTodo() {
  const [text, setText] = useState("");

  const handleSubmitEditing = () => {
    if (!text.trim()) return;
    addTodo(text.trim());
    setText("");
  };

  return (
    <TextInput
      value={text}
      onChangeText={setText}
      onSubmitEditing={handleSubmitEditing}
      placeholder="What do you want to do today?"
      placeholderTextColor={color.textMuted}
      style={styles.input}
    />
  );
}

function Todo({ todo }: { todo: Tables<"todos"> }) {
  return (
    <TouchableOpacity
      onPress={() => toggleDone(todo.id)}
      style={[styles.todo, todo.done ? styles.done : null]}
    >
      <Text style={styles.todoText}>
        {todo.done ? DONE_ICON : NOT_DONE_ICON} {todo.text}
      </Text>
    </TouchableOpacity>
  );
}

const Todos = observer(({ todos$ }: { todos$: typeof _todos$ }) => {
  const todos = todos$.get() as Record<string, Tables<"todos">> | undefined;

  if (!todos) return null;

  return (
    <FlatList
      data={Object.values(todos)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: { item: Tables<"todos"> }) => <Todo todo={item} />}
      style={styles.todos}
    />
  );
});

export default function HomeScreen() {
  const { signOut } = useSession();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Legend-State Example</Text>
        <Button variant="ghost" size="sm" onPress={() => signOut()}>
          Se déconnecter
        </Button>
      </View>
      <NewTodo />
      <Todos todos$={_todos$} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bgApp,
    flex: 1,
    margin: space[6],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[4],
  },
  heading: {
    ...type.title,
    color: color.textPrimary,
    flex: 1,
  },
  input: {
    borderColor: color.borderStrong,
    borderRadius: 8,
    borderWidth: 2,
    height: 64,
    marginTop: space[6],
    padding: space[6],
    fontSize: 20,
    color: color.textPrimary,
  },
  todos: {
    flex: 1,
    marginTop: space[6],
  },
  todo: {
    borderRadius: 8,
    marginBottom: space[6],
    padding: space[6],
    backgroundColor: color.amber100,
  },
  done: {
    backgroundColor: color.green100,
  },
  todoText: {
    fontSize: 20,
    color: color.textPrimary,
  },
});
