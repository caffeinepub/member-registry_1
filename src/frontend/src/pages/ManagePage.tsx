import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { DropdownOption } from "../backend.d";
import {
  useAddDropdownOption,
  useDeleteDropdownOption,
  useDropdownOptions,
  useUpdateDropdownOption,
} from "../hooks/useQueries";

type Category = "district" | "union" | "assembly";

function OptionItem({
  option,
  category,
  onEdit,
  onDelete,
  isDeleting,
}: {
  option: DropdownOption;
  category: Category;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(option.text);
  const update = useUpdateDropdownOption();

  const saveEdit = () => {
    if (!editText.trim() || editText === option.text) {
      setEditing(false);
      return;
    }
    update.mutate(
      { id: option.id, text: editText.trim(), category },
      {
        onSuccess: () => {
          setEditing(false);
          onEdit(option.id, editText.trim());
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-2 py-2 border-b border-border last:border-0">
      {editing ? (
        <>
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="h-9 flex-1 text-sm"
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={saveEdit}
            disabled={update.isPending}
            className="h-9 w-9 text-primary"
          >
            {update.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditing(false)}
            className="h-9 w-9 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm text-foreground">{option.text}</span>
          <Button
            data-ocid="manage.edit_button"
            size="icon"
            variant="ghost"
            onClick={() => setEditing(true)}
            className="h-9 w-9 text-muted-foreground hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            data-ocid="manage.delete_button"
            size="icon"
            variant="ghost"
            onClick={() => onDelete(option.id)}
            disabled={isDeleting}
            className="h-9 w-9 text-muted-foreground hover:text-destructive"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </>
      )}
    </div>
  );
}

function CategorySection({
  title,
  category,
  ocid,
}: {
  title: string;
  category: Category;
  ocid: string;
}) {
  const { data: options = [], isLoading } = useDropdownOptions(category);
  const addOption = useAddDropdownOption();
  const deleteOption = useDeleteDropdownOption();
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newText.trim()) return;
    addOption.mutate(
      { text: newText.trim(), category },
      {
        onSuccess: () => {
          setNewText("");
          setAdding(false);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteOption.mutate(
      { id, category },
      { onSettled: () => setDeletingId(null) },
    );
  };

  return (
    <div
      data-ocid={ocid}
      className="bg-card rounded-xl border border-border shadow-xs overflow-hidden mb-4"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <Button
          data-ocid="manage.add_button"
          size="sm"
          variant="outline"
          onClick={() => setAdding((p) => !p)}
          className="h-8 gap-1.5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {adding && (
        <div className="flex gap-2 px-4 py-3 border-b border-border bg-accent/20">
          <Input
            placeholder={`New ${title.toLowerCase()} name`}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            className="h-9 flex-1 text-sm"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={addOption.isPending || !newText.trim()}
            className="h-9"
          >
            {addOption.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setAdding(false);
              setNewText("");
            }}
            className="h-9"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="px-4">
        {isLoading ? (
          <div className="py-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : options.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No options yet. Add one above.
          </p>
        ) : (
          options.map((opt) => (
            <OptionItem
              key={opt.id}
              option={opt}
              category={category}
              onEdit={() => {}}
              onDelete={handleDelete}
              isDeleting={deletingId === opt.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function ManagePage() {
  return (
    <div className="p-4 pb-8">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground">Manage Options</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add, edit or remove dropdown values
        </p>
      </div>
      <CategorySection
        title="Districts"
        category="district"
        ocid="manage.district_section"
      />
      <CategorySection
        title="Unions"
        category="union"
        ocid="manage.union_section"
      />
      <CategorySection
        title="Assemblies"
        category="assembly"
        ocid="manage.assembly_section"
      />
    </div>
  );
}
