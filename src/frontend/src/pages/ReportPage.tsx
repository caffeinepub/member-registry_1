import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, MapPin, Search, User, Users } from "lucide-react";
import { useState } from "react";
import type { Member } from "../backend.d";
import {
  useDropdownOptions,
  useMembers,
  useSearchMembers,
} from "../hooks/useQueries";

type SearchField = "name" | "memberId" | "assemblyId";

const FIELDS: {
  value: SearchField;
  label: string;
  icon: React.ElementType;
  ocid: string;
}[] = [
  { value: "name", label: "Name", icon: User, ocid: "report.name_tab" },
  {
    value: "memberId",
    label: "Member ID",
    icon: Hash,
    ocid: "report.member_id_tab",
  },
  {
    value: "assemblyId",
    label: "Assembly",
    icon: MapPin,
    ocid: "report.assembly_tab",
  },
];

function MemberCard({
  member,
  index,
  districts,
  unions,
  assemblies,
}: {
  member: Member;
  index: number;
  districts: Record<string, string>;
  unions: Record<string, string>;
  assemblies: Record<string, string>;
}) {
  return (
    <div
      data-ocid={`report.item.${index}`}
      className="bg-card rounded-xl border border-border shadow-xs p-4 space-y-2"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-foreground text-base">
            {member.name}
          </p>
          <p className="text-xs text-muted-foreground">ID: {member.memberId}</p>
        </div>
        <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
          {assemblies[member.assemblyId] || "—"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <div>
          <span className="text-xs text-muted-foreground block">Mobile</span>
          <span className="text-foreground">{member.mobile}</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block">District</span>
          <span className="text-foreground">
            {districts[member.districtId] || "—"}
          </span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block">Union</span>
          <span className="text-foreground">
            {unions[member.unionId] || "—"}
          </span>
        </div>
      </div>
      <div>
        <span className="text-xs text-muted-foreground block">Address</span>
        <span className="text-sm text-foreground">{member.address}</span>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const [searchField, setSearchField] = useState<SearchField>("name");
  const [inputValue, setInputValue] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);

  const { data: districts = [] } = useDropdownOptions("district");
  const { data: unions = [] } = useDropdownOptions("union");
  const { data: assemblies = [] } = useDropdownOptions("assembly");
  const { data: allMembers = [], isLoading: allLoading } = useMembers();
  const { data: searchResults, isLoading: searchLoading } = useSearchMembers(
    activeQuery,
    searchField,
    searchEnabled && activeQuery.trim().length > 0,
  );

  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d.text]));
  const unionMap = Object.fromEntries(unions.map((u) => [u.id, u.text]));
  const assemblyMap = Object.fromEntries(assemblies.map((a) => [a.id, a.text]));

  const members: Member[] =
    searchEnabled && activeQuery.trim() ? (searchResults ?? []) : allMembers;
  const isLoading =
    searchEnabled && activeQuery.trim() ? searchLoading : allLoading;

  const handleSearch = () => {
    setActiveQuery(inputValue);
    setSearchEnabled(true);
  };

  const handleFieldChange = (f: SearchField) => {
    setSearchField(f);
    setActiveQuery("");
    setInputValue("");
    setSearchEnabled(false);
  };

  return (
    <div className="p-4 pb-8">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground">Report</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search and view member records
        </p>
      </div>

      <div className="flex gap-2 mb-3 bg-muted rounded-lg p-1">
        {FIELDS.map((f) => {
          const Icon = f.icon;
          return (
            <button
              type="button"
              key={f.value}
              data-ocid={f.ocid}
              onClick={() => handleFieldChange(f.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-md text-xs font-medium transition-colors ${
                searchField === f.value
                  ? "bg-card text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mb-5">
        <Input
          data-ocid="report.search_input"
          placeholder={`Search by ${FIELDS.find((f) => f.value === searchField)?.label}...`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-12 flex-1"
        />
        <Button
          data-ocid="report.search_button"
          onClick={handleSearch}
          className="h-12 px-4"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div
          data-ocid="report.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No members found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div data-ocid="report.list" className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {members.length} member{members.length !== 1 ? "s" : ""} found
          </p>
          {members.map((m, i) => (
            <MemberCard
              key={m.id}
              member={m}
              index={i + 1}
              districts={districtMap}
              unions={unionMap}
              assemblies={assemblyMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
