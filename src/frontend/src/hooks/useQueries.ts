import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DropdownOption, Member } from "../backend.d";
import { useActor } from "./useActor";

export function useDropdownOptions(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDropdownOptions(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchMembers(
  query: string,
  field: string,
  enabled: boolean,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Member[]>({
    queryKey: ["search", query, field],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchMembers(query.trim(), field);
    },
    enabled: !!actor && !isFetching && enabled && query.trim().length > 0,
  });
}

export function useAddMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      mobile: string;
      address: string;
      districtId: string;
      unionId: string;
      assemblyId: string;
      memberId: string;
    }) =>
      actor!.addMember(
        data.name,
        data.mobile,
        data.address,
        data.districtId,
        data.unionId,
        data.assemblyId,
        data.memberId,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useAddDropdownOption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ text, category }: { text: string; category: string }) =>
      actor!.addDropdownOption(text, category),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["dropdown", vars.category] }),
  });
}

export function useUpdateDropdownOption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      text,
      category: _category,
    }: { id: string; text: string; category: string }) =>
      actor!.updateDropdownOption(id, text),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["dropdown", vars.category] }),
  });
}

export function useDeleteDropdownOption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category: _category,
    }: { id: string; category: string }) => actor!.deleteDropdownOption(id),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["dropdown", vars.category] }),
  });
}
