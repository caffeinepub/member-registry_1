import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAddMember, useDropdownOptions } from "../hooks/useQueries";

const EMPTY_FORM = {
  name: "",
  mobile: "",
  address: "",
  districtId: "",
  unionId: "",
  assemblyId: "",
  memberId: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const { data: districts = [] } = useDropdownOptions("district");
  const { data: unions = [] } = useDropdownOptions("union");
  const { data: assemblies = [] } = useDropdownOptions("assembly");
  const addMember = useAddMember();

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.mobile ||
      !form.address ||
      !form.districtId ||
      !form.unionId ||
      !form.assemblyId ||
      !form.memberId
    )
      return;
    addMember.mutate(form, {
      onSuccess: () => {
        setForm(EMPTY_FORM);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      },
    });
  };

  return (
    <div className="p-4 pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Member Registration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details to register a new member
        </p>
      </div>

      {submitted && (
        <div
          data-ocid="register.success_state"
          className="mb-4 flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-sm font-medium text-primary"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Member registered successfully!
        </div>
      )}

      {addMember.isError && (
        <div
          data-ocid="register.error_state"
          className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm font-medium text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to register. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            data-ocid="register.name_input"
            placeholder="Enter full name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mobile">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobile"
            data-ocid="register.mobile_input"
            type="tel"
            placeholder="Enter mobile number"
            value={form.mobile}
            onChange={(e) => set("mobile", e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">
            Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            data-ocid="register.address_input"
            placeholder="Enter full address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            required
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            District <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.districtId}
            onValueChange={(v) => set("districtId", v)}
            required
          >
            <SelectTrigger
              data-ocid="register.district_select"
              className="h-12"
            >
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>
            Union <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.unionId}
            onValueChange={(v) => set("unionId", v)}
            required
          >
            <SelectTrigger data-ocid="register.union_select" className="h-12">
              <SelectValue placeholder="Select union" />
            </SelectTrigger>
            <SelectContent>
              {unions.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>
            Assembly <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.assemblyId}
            onValueChange={(v) => set("assemblyId", v)}
            required
          >
            <SelectTrigger
              data-ocid="register.assembly_select"
              className="h-12"
            >
              <SelectValue placeholder="Select assembly" />
            </SelectTrigger>
            <SelectContent>
              {assemblies.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="memberId">
            Member ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="memberId"
            data-ocid="register.member_id_input"
            placeholder="Enter member ID"
            value={form.memberId}
            onChange={(e) => set("memberId", e.target.value)}
            required
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          data-ocid="register.submit_button"
          className="w-full h-12 text-base font-semibold mt-2"
          disabled={addMember.isPending}
        >
          {addMember.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registering...
            </>
          ) : (
            "Register Member"
          )}
        </Button>
      </form>
    </div>
  );
}
